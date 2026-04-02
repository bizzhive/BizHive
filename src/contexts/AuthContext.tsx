import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n, { supportedLanguages } from "@/i18n";
import { supabase } from "@/services/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<unknown>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const syncPreferredLanguage = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("preferred_language")
      .eq("user_id", userId)
      .maybeSingle();

    const preferredLanguage = profile?.preferred_language;
    const isSupportedLanguage = supportedLanguages.some((language) => language.code === preferredLanguage);

    if (isSupportedLanguage && i18n.resolvedLanguage !== preferredLanguage) {
      await i18n.changeLanguage(preferredLanguage);
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        sessionStorage.removeItem("pending_verification_email");
        await syncPreferredLanguage(data.session.user.id);
      }
      setIsLoading(false);
    };
    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password");
        return;
      }

      if (event === "SIGNED_IN") {
        sessionStorage.removeItem("pending_verification_email");
        if (session?.user?.id) {
          void syncPreferredLanguage(session.user.id);
        }
        const isRecoveryFlow = window.location.pathname === "/reset-password";
        if (!isRecoveryFlow) {
          navigate("/dashboard");
        }
      } else if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, fullName = "") => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined,
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    sessionStorage.setItem("pending_verification_email", email);
    navigate("/email-verification");
    return data;
  };

  const resendVerificationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      throw error;
    }
    toast({ title: "Email Sent", description: "A new verification link has been sent to your email." });
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    sessionStorage.removeItem("pending_verification_email");
  };

  const value = { user, session, isLoading, signUp, signInWithGoogle, signOut, resendVerificationEmail };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
