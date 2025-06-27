
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Shield, Star } from "lucide-react";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", loginData);
    // Handle login logic
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", registerData);
    // Handle registration logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to BizHive
            </h1>
            <p className="text-gray-600 text-lg">
              Join thousands of entrepreneurs building successful businesses
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Why Join BizHive?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Premium Document Access</h3>
                      <p className="text-gray-600 text-sm">Access 500+ legal templates, forms, and business documents</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Expert Community</h3>
                      <p className="text-gray-600 text-sm">Connect with mentors, find co-founders, and network with entrepreneurs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Star className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Incubator Directory</h3>
                      <p className="text-gray-600 text-sm">Get matched with the right incubators and funding opportunities</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Free vs Premium</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Planning Tools</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Basic Legal Guidance</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Document Templates</span>
                    <span className="text-blue-600 font-medium">Premium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Community Access</span>
                    <span className="text-blue-600 font-medium">Premium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Incubator Matching</span>
                    <span className="text-blue-600 font-medium">Premium</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Auth Forms */}
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
                      <CardDescription>
                        Enter your credentials to access your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              className="pl-10"
                              value={loginData.email}
                              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
                              type="password"
                              placeholder="Enter your password"
                              className="pl-10"
                              value={loginData.password}
                              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <Link to="/forgot-password" className="text-blue-600 hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <Button type="submit" className="w-full">
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="register">
                    <CardHeader>
                      <CardTitle>Create Account</CardTitle>
                      <CardDescription>
                        Join BizHive and start building your business today
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="name"
                              type="text"
                              placeholder="Your full name"
                              className="pl-10"
                              value={registerData.name}
                              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="register-email"
                              type="email"
                              placeholder="your@email.com"
                              className="pl-10"
                              value={registerData.email}
                              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="register-password"
                              type="password"
                              placeholder="Create a strong password"
                              className="pl-10"
                              value={registerData.password}
                              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="confirm-password"
                              type="password"
                              placeholder="Confirm your password"
                              className="pl-10"
                              value={registerData.confirmPassword}
                              onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          By creating an account, you agree to our{" "}
                          <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
                          and{" "}
                          <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        </div>
                        <Button type="submit" className="w-full">
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
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
