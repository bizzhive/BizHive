
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import MarketResearch from "./pages/plan/MarketResearch";
import BusinessPlan from "./pages/plan/BusinessPlan";
import BusinessCanvas from "./pages/tools/BusinessCanvas";
import SwotAnalysis from "./pages/tools/SwotAnalysis";
import StartupCalculator from "./pages/tools/StartupCalculator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/subscribe" element={<Contact />} />
            {/* Tool routes - these can be expanded later */}
            <Route path="/tools/*" element={<Tools />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
