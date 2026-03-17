import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Target, BarChart3, Cog, Rocket, Shield, Award, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FAQSection from "@/components/FAQSection";

const manageFAQs = [
  { question: "When should I start scaling my business?", answer: "Scale when you have consistent revenue, a proven business model, and repeatable customer acquisition. Key indicators: positive unit economics, growing demand you can't fulfill, and operational processes that are documented and can be delegated." },
  { question: "How do I manage cash flow during growth?", answer: "Maintain at least 3-6 months of operating expenses as runway. Use cash flow forecasting, negotiate longer payment terms with suppliers, invoice promptly, and consider invoice factoring for B2B businesses. Never confuse revenue with profit." },
  { question: "What metrics should I track?", answer: "Focus on: Customer Acquisition Cost (CAC), Lifetime Value (LTV), Monthly Recurring Revenue (MRR), Churn Rate, Burn Rate, and Runway. The LTV:CAC ratio should be at least 3:1 for a healthy business." },
  { question: "How do I build a strong team while scaling?", answer: "Hire for culture fit first, skills second. Document processes before hiring. Start with generalists, move to specialists as you grow. Invest in onboarding, use OKRs for alignment, and build a feedback culture early." },
  { question: "Should I seek external funding to grow?", answer: "Not always. Bootstrap if your business generates healthy cash flow. Seek funding only if: you need to grow faster than cash flow allows, your market has a winner-takes-all dynamic, or capital-intensive infrastructure is needed. Remember, every rupee of funding comes with dilution." },
];
const Manage = () => {
  const navigate = useNavigate();

  const managementAreas = [
    { icon: TrendingUp, title: "Scale Operations", description: "Expand your team, enhance efficiency", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-900/20", features: ["Team Expansion", "Process Optimization", "Service Diversification", "Quality Control"], path: "/tools" },
    { icon: Users, title: "Customer Management", description: "Build loyalty and engagement", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20", features: ["CRM Integration", "Loyalty Programs", "Feedback Systems", "Support Optimization"], path: "/ai-assistant" },
    { icon: DollarSign, title: "Financial Management", description: "Monitor performance, optimize costs", color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-50 dark:bg-purple-900/20", features: ["Cash Flow Analysis", "Cost Optimization", "Investment Planning", "Risk Management"], path: "/tools/financial-calculator" },
  ];

  const scalingStrategies = [
    { icon: Target, title: "Market Expansion", description: "Enter new markets and demographics", path: "/plan/market-research" },
    { icon: BarChart3, title: "Performance Analytics", description: "Track KPIs and optimize operations", path: "/tools/startup-calculator" },
    { icon: Cog, title: "Automation", description: "Streamline processes with technology", path: "/tools" },
    { icon: Rocket, title: "Growth Hacking", description: "Rapid experimentation for growth", path: "/blog" },
    { icon: Shield, title: "Risk Management", description: "Identify and mitigate business risks", path: "/legal" },
    { icon: Award, title: "Quality Assurance", description: "Maintain excellence while scaling", path: "/launch" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">Manage & Scale Your Business</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Grow your business with advanced management strategies and proven scaling techniques
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {managementAreas.map((area, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 ${area.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <area.icon className={`h-7 w-7 ${area.color}`} />
                </div>
                <CardTitle className="text-xl">{area.title}</CardTitle>
                <CardDescription>{area.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  {area.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full" variant="outline" onClick={() => navigate(area.path)}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Advanced Scaling Strategies</h2>
            <p className="text-lg text-muted-foreground">Proven methodologies to accelerate growth</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scalingStrategies.map((strategy, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate(strategy.path)}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <strategy.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{strategy.title}</CardTitle>
                  </div>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
