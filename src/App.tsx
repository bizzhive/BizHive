// Force re-deploy
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Plan from "./pages/Plan";
import Launch from "./pages/Launch";
import Manage from "./pages/Manage";
import Legal from "./pages/Legal";
import Incubators from "./pages/Incubators";
import Community from "./pages/Community";
import Documents from "./pages/Documents";
import Tools from "./pages/Tools";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Taxation from "./pages/Taxation";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import MarketResearch from "./pages/plan/MarketResearch";
import BusinessPlan from "./pages/plan/BusinessPlan";
import BusinessCanvas from "./pages/tools/BusinessCanvas";
import SwotAnalysis from "./pages/tools/SwotAnalysis";
import StartupCalculator from "./pages/tools/StartupCalculator";
import FinancialCalculator from "./pages/tools/FinancialCalculator";
import PitchDeckBuilder from "./pages/tools/PitchDeckBuilder";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdminPanel from "./pages/AdminPanel";
import AIAssistant from "./pages/AIAssistant";
import PlanLearn from "./pages/plan/PlanLearn";
import LaunchLearn from "./pages/launch/LaunchLearn";
import ManageLearn from "./pages/manage/ManageLearn";
import ResourcesLearn from "./pages/resources/ResourcesLearn";
import EmailVerification from "./pages/EmailVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
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
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/resources/learn" element={<ResourcesLearn />} />
                <Route path="/email-verification" element={<EmailVerification />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
