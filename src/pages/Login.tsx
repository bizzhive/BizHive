import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Compass, FileCheck2, Users } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import { useTranslation } from "react-i18next";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signInWithGoogle, signUp, user, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();

  const initialMode = location.pathname === "/register" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(location.pathname === "/register" ? "signup" : "signin");
  }, [location.pathname]);

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard");
    }
  }, [authLoading, navigate, user]);

  const isSignUp = mode === "signup";

  const switchMode = (nextMode: string) => {
    const typedMode = nextMode === "signup" ? "signup" : "signin";
    setMode(typedMode);
    navigate(typedMode === "signup" ? "/register" : "/login", { replace: true });
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: t("Error"),
        description:
          error instanceof Error ? error.message : t("Failed to log in with Google"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSignUp && password !== confirmPassword) {
      toast({
        title: t("Error"),
        description: t("Passwords do not match"),
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: t("Error"),
        description: t("Password must be at least 6 characters"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName.trim());
        toast({
          title: t("Account created"),
          description: t("Please check your email to verify your account."),
        });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: t("Error"),
        description:
          error instanceof Error ? error.message : t("Authentication failed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      actions={<LanguageSelector />}
      eyebrow={t("Account access")}
      title={t("Build your workspace with confidence")}
      description={t("BizHive brings planning, launch workflows, legal guidance, and operating tools into one focused platform for founders.")}
      features={[
        {
          icon: <Compass className="h-5 w-5" />,
          title: t("Guided progress"),
          description: t("Move from idea to launch with structured tools, clear next steps, and one dashboard that keeps your business context in sync."),
        },
        {
          icon: <FileCheck2 className="h-5 w-5" />,
          title: t("Document-ready workflows"),
          description: t("Keep templates, signatures, and profile details aligned so every new plan or document starts with cleaner inputs."),
        },
        {
          icon: <Users className="h-5 w-5" />,
          title: t("Built for real founders"),
          description: t("Use BizHive as a planning hub, a launch checklist, and an operating cockpit while your product and team grow."),
        },
      ]}
      footer={t("Your selected language, onboarding state, and workspace setup follow you across the platform after sign-in.")}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-border/70 px-6 py-6 sm:px-8 sm:py-8">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {isSignUp ? t("Create your account") : t("Welcome back")}
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.045em] text-foreground">
                {isSignUp ? t("Set up your BizHive account") : t("Sign in to continue building")}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                {isSignUp
                  ? t("Create your account once, verify your email, and we will guide you through your workspace setup.")
                  : t("Pick up your plans, saved tools, and profile workspace exactly where you left off.")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 sm:px-8 sm:py-8">
          <Tabs value={mode} onValueChange={switchMode} className="space-y-6">
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-[20px] border border-border/70 bg-muted/40 p-1">
              <TabsTrigger value="signin" className="rounded-2xl py-2.5">
                {t("Sign In")}
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-2xl py-2.5">
                {t("Sign Up")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-0">
              <form onSubmit={handleEmailAuth} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t("Email")}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="login-password">{t("Password")}</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      {t("Forgot Password")}
                    </Link>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    required
                  />
                </div>

                <Button type="submit" className="h-12 w-full text-base" disabled={isLoading}>
                  {isLoading ? t("Loading...") : t("Sign In")}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <form onSubmit={handleEmailAuth} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">{t("Full name")}</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder={t("Your name")}
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t("Email")}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                    required
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t("Password")}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">{t("Confirm Password")}</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder={t("Repeat password")}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="h-12 w-full text-base" disabled={isLoading}>
                  {isLoading ? t("Loading...") : t("Create an Account")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/70" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 tracking-[0.2em] text-muted-foreground">
                {t("Or continue with")}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-2xl border-border/70 bg-background/70 text-base"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isLoading ? t("Redirecting...") : t("Continue with Google")}
          </Button>

          <div className="mt-6 rounded-[24px] border border-border/70 bg-muted/28 px-4 py-4 text-sm leading-6 text-muted-foreground">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">
                  {isSignUp ? t("What happens next?") : t("Need a fresh start?")}
                </p>
                <p className="mt-1">
                  {isSignUp
                    ? t("After sign-up we send a verification email, then your dashboard onboarding collects the details needed for profile completion, language sync, and business setup.")
                    : t("Jump back into your dashboard, or head to password recovery if you need to reset access before continuing.")}
                </p>
              </div>
              {!isSignUp ? (
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  {t("Reset access")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </AuthShell>
  );
};

export default Login;
