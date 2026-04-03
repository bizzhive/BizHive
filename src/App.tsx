import { Suspense, lazy, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdminAccessDialog } from "@/components/admin/AdminAccessDialog";
import { LoadingState, PageHeader, SiteContainer } from "@/components/site/SitePrimitives";
import { hasTemporaryAdminAccess } from "@/services/admin/access";
import Layout from "./components/Layout";
import CookieConsent from "./components/CookieConsent";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Index = lazy(() => import("./pages/Index"));
const Plan = lazy(() => import("./pages/Plan"));
const Launch = lazy(() => import("./pages/Launch"));
const Manage = lazy(() => import("./pages/Manage"));
const Legal = lazy(() => import("./pages/Legal"));
const Incubators = lazy(() => import("./pages/Incubators"));
const Community = lazy(() => import("./pages/Community"));
const Documents = lazy(() => import("./pages/Documents"));
const Tools = lazy(() => import("./pages/Tools"));
const Login = lazy(() => import("./pages/Login"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Taxation = lazy(() => import("./pages/Taxation"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const MarketResearch = lazy(() => import("./pages/plan/MarketResearch"));
const BusinessPlan = lazy(() => import("./pages/plan/BusinessPlan"));
const BusinessCanvas = lazy(() => import("./pages/tools/BusinessCanvas"));
const SwotAnalysis = lazy(() => import("./pages/tools/SwotAnalysis"));
const StartupCalculator = lazy(() => import("./pages/tools/StartupCalculator"));
const FinancialCalculator = lazy(() => import("./pages/tools/FinancialCalculator"));
const PitchDeckBuilder = lazy(() => import("./pages/tools/PitchDeckBuilder"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const PlanLearn = lazy(() => import("./pages/plan/PlanLearn"));
const LaunchLearn = lazy(() => import("./pages/launch/LaunchLearn"));
const ManageLearn = lazy(() => import("./pages/manage/ManageLearn"));
const ResourcesLearn = lazy(() => import("./pages/resources/ResourcesLearn"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const DocumentLanguageSync = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const language = i18n.resolvedLanguage || "en";
    const isRtlLanguage = ["ar", "fa", "he", "ur"].includes(language);

    document.documentElement.lang = language;
    document.documentElement.dir = isRtlLanguage ? "rtl" : "ltr";
  }, [i18n.resolvedLanguage]);

  return null;
};

const RouteFallback = () => (
  <div className="page-shell">
    <SiteContainer>
      <LoadingState
        className="min-h-[50vh]"
        title="Loading workspace"
        description="We are pulling in the next page so the transition feels consistent across the product."
      />
    </SiteContainer>
  </div>
);

const AdminPanelRoute = () => {
  const navigate = useNavigate();
  const [accessGranted, setAccessGranted] = useState(() => hasTemporaryAdminAccess());
  const [gateOpen, setGateOpen] = useState(() => !hasTemporaryAdminAccess());

  if (accessGranted) {
    return <AdminPanel />;
  }

  return (
    <>
      <div className="page-shell">
        <SiteContainer>
          <PageHeader
            eyebrow="Protected area"
            title="Admin access is gated"
            description="Use the temporary password to open the control panel. This gate is isolated so it can be replaced with role-based auth later without rebuilding the admin UI."
            actions={
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Temporary access control enabled
              </div>
            }
          />
        </SiteContainer>
      </div>
      <AdminAccessDialog
        open={gateOpen}
        onOpenChange={(open) => {
          setGateOpen(open);
          if (!open && !hasTemporaryAdminAccess()) {
            navigate("/", { replace: true });
          }
        }}
        onSuccess={() => {
          setAccessGranted(true);
          setGateOpen(false);
        }}
      />
    </>
  );
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/plan/market-research" element={<MarketResearch />} />
        <Route path="/plan/business-plan" element={<BusinessPlan />} />
        <Route path="/plan/learn" element={<PlanLearn />} />
        <Route path="/launch" element={<Launch />} />
        <Route path="/launch/learn" element={<LaunchLearn />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/manage/learn" element={<ManageLearn />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/incubators" element={<Incubators />} />
        <Route path="/community" element={<Community />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/business-canvas" element={<BusinessCanvas />} />
        <Route path="/tools/swot-analysis" element={<SwotAnalysis />} />
        <Route path="/tools/startup-calculator" element={<StartupCalculator />} />
        <Route path="/tools/financial-calculator" element={<FinancialCalculator />} />
        <Route path="/tools/pitch-deck-builder" element={<PitchDeckBuilder />} />
        <Route path="/taxation" element={<Taxation />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/subscribe" element={<Contact />} />
        <Route path="/admin" element={<AdminPanelRoute />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/resources/learn" element={<ResourcesLearn />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <DocumentLanguageSync />
          <Toaster />
          <Sonner />
          <ScrollToTop />
          <Layout>
            <AppRoutes />
          </Layout>
          <CookieConsent />
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
