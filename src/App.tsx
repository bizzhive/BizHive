
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "./components/Layout";
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
import MarketResearch from "./pages/plan/MarketResearch";
import BusinessPlan from "./pages/plan/BusinessPlan";
import BusinessCanvas from "./pages/tools/BusinessCanvas";
import SwotAnalysis from "./pages/tools/SwotAnalysis";
import StartupCalculator from "./pages/tools/StartupCalculator";
import FinancialCalculator from "./pages/tools/FinancialCalculator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/plan/market-research" element={<MarketResearch />} />
              <Route path="/plan/business-plan" element={<BusinessPlan />} />
              <Route path="/launch" element={<Launch />} />
              <Route path="/manage" element={<Manage />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/incubators" element={<Incubators />} />
              <Route path="/community" element={<Community />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/business-canvas" element={<BusinessCanvas />} />
              <Route path="/tools/swot-analysis" element={<SwotAnalysis />} />
              <Route path="/tools/startup-calculator" element={<StartupCalculator />} />
              <Route path="/tools/financial-calculator" element={<FinancialCalculator />} />
              <Route path="/taxation" element={<Taxation />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/subscribe" element={<Contact />} />
              <Route path="/tools/*" element={<Tools />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
