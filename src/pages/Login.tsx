
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Shield, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import BeeIcon from "@/components/BeeIcon";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to log in with Google", variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (error) throw error;
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to log in", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: { data: { full_name: registerData.name } },
      });
      if (error) throw error;
      navigate("/email-verification");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to register", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <BeeIcon className="w-14 h-14 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to BizHive</h1>
            <p className="text-muted-foreground text-lg">Join thousands of entrepreneurs building successful businesses</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Why Join BizHive?</h2>
                <div className="space-y-4">
                  {[
                    { icon: Shield, color: "text-primary", bg: "bg-primary/10", title: "Premium Document Access", desc: "Access 500+ legal templates and business documents" },
                    { icon: User, color: "text-primary", bg: "bg-primary/10", title: "Expert Community", desc: "Connect with mentors and fellow entrepreneurs" },
                    { icon: Star, color: "text-primary", bg: "bg-primary/10", title: "AI Business Advisor", desc: "Get personalized guidance from Bee AI" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className={`p-2 ${item.bg} rounded-lg`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Card className="w-full max-w-md mx-auto">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <CardHeader>
                      <CardTitle>Welcome Back</CardTitle>
                      <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Continue with Google
                        </Button>
                      </div>
                      <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with email</span></div>
                      </div>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" placeholder="your@email.com" className="pl-10" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="password" type="password" placeholder="Enter your password" className="pl-10" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
                          </div>
                        </div>
                        <div className="text-sm"><Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link></div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Signing in..." : "Sign In"}{!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                      </form>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="register">
                    <CardHeader>
                      <CardTitle>Create Account</CardTitle>
                      <CardDescription>Join BizHive and start building your business today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Continue with Google
                        </Button>
                      </div>
                      <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with email</span></div>
                      </div>
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="text" placeholder="Your full name" className="pl-10" value={registerData.name} onChange={(e) => setRegisterData({...registerData, name: e.target.value})} required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="email" placeholder="your@email.com" className="pl-10" value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="Create a password" className="pl-10" value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="Confirm password" className="pl-10" value={registerData.confirmPassword} onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})} required />
                          </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Creating account..." : "Create Account"}{!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                      </form>
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
