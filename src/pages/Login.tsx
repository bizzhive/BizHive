import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { pathname } = useLocation();
  const initialTab = pathname === "/register" ? "register" : "login";
  const { signIn, signInWithGoogle, signUp } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ email: "", password: "", fullName: "" });

  const title = useMemo(
    () => (activeTab === "login" ? t("auth.loginTitle") : t("auth.registerTitle")),
    [activeTab, t]
  );
  const body = useMemo(
    () => (activeTab === "login" ? t("auth.loginBody") : t("auth.registerBody")),
    [activeTab, t]
  );

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await signIn(loginForm.email, loginForm.password);
    } catch (error) {
      toast({ title: t("common.error"), description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await signUp(registerForm.email, registerForm.password, registerForm.fullName);
    } catch (error) {
      toast({ title: t("common.error"), description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({ title: t("common.error"), description: (error as Error).message, variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <AuthShell title={title} body={body}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl border border-border/80 bg-muted/40">
          <TabsTrigger value="login" className="rounded-2xl">
            {t("auth.tabs.login")}
          </TabsTrigger>
          <TabsTrigger value="register" className="rounded-2xl">
            {t("auth.tabs.register")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder={t("auth.placeholders.email")}
              value={loginForm.email}
              onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
              className="h-12 rounded-2xl"
              required
            />
            <Input
              type="password"
              placeholder={t("auth.placeholders.password")}
              value={loginForm.password}
              onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
              className="h-12 rounded-2xl"
              required
            />
            <Button type="submit" className="h-12 w-full rounded-2xl" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.tabs.login")}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="text"
              placeholder={t("auth.placeholders.fullName")}
              value={registerForm.fullName}
              onChange={(event) => setRegisterForm((current) => ({ ...current, fullName: event.target.value }))}
              className="h-12 rounded-2xl"
              required
            />
            <Input
              type="email"
              placeholder={t("auth.placeholders.email")}
              value={registerForm.email}
              onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
              className="h-12 rounded-2xl"
              required
            />
            <Input
              type="password"
              placeholder={t("auth.placeholders.password")}
              value={registerForm.password}
              onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
              className="h-12 rounded-2xl"
              required
            />
            <Button type="submit" className="h-12 w-full rounded-2xl" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.actions.createAccount")}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="mt-5 space-y-3">
        <Button variant="ghost" className="h-12 w-full rounded-2xl border border-border/80" onClick={handleGoogle} disabled={loading}>
          {t("auth.actions.continueWithGoogle")}
        </Button>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Link to="/forgot-password" className="hover:text-foreground">
            {t("auth.actions.forgotPassword")}
          </Link>
          <Link to={activeTab === "login" ? "/register" : "/login"} className="hover:text-foreground">
            {activeTab === "login" ? t("auth.actions.needAccount") : t("auth.actions.alreadyHaveAccount")}
          </Link>
        </div>
      </div>
    </AuthShell>
  );
};

export default Login;
