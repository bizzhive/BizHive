import { Suspense, lazy, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdminAccessDialog } from "@/components/admin/AdminAccessDialog";
import { EmptyState, LoadingState, SiteContainer } from "@/components/site/SitePrimitives";
import { hasTemporaryAdminAccess } from "@/services/admin/access";
import { supportedLanguages } from "@/i18n";
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
const Cookies = lazy(() => import("./pages/Cookies"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
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
    const languageConfig = supportedLanguages.find((item) => item.code === language);

    document.documentElement.lang = language;
    document.documentElement.dir = languageConfig?.dir || "ltr";
  }, [i18n.resolvedLanguage]);

  return null;
};

const RouteFallback = () => {
  const { t } = useTranslation();

  return (
    <div className="page-shell">
      <SiteContainer>
        <LoadingState
          className="min-h-[50vh]"
          title={t("routeFallback.title")}
          description={t("routeFallback.description")}
        />
      </SiteContainer>
    </div>
  );
};

const AdminPanelRoute = () => {
  const { t } = useTranslation();
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
          <EmptyState
            title={t("footer.adminTitle")}
            description={t("footer.adminBody")}
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
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
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
