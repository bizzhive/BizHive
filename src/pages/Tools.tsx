import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Calculator, DollarSign, PieChart, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Tools = () => {
  const tools = [
    {
      name: "Business Model Canvas",
      description: "Map your value proposition, customer segments, channels, and economics in one place.",
      icon: Target,
      href: "/tools/business-canvas",
      features: ["9 key blocks", "Visual layout", "Save progress", "Reusable outputs"],
    },
    {
      name: "SWOT Analysis",
      description: "Break your business into strengths, weaknesses, opportunities, and threats for clearer decisions.",
      icon: TrendingUp,
      href: "/tools/swot-analysis",
      features: ["Strategic framing", "Actionable prompts", "Save work", "Shareable summary"],
    },
    {
      name: "Startup Cost Calculator",
      description: "Estimate capital needed for launch, monthly burn, and initial runway.",
      icon: Calculator,
      href: "/tools/startup-calculator",
      features: ["One-time costs", "Monthly costs", "Runway planning", "Capital target"],
    },
    {
      name: "Financial Calculator",
      description: "Project revenue, expenses, break-even points, and profit direction.",
      icon: DollarSign,
      href: "/tools/financial-calculator",
      features: ["Revenue projections", "Expense planning", "Break-even", "Scenario review"],
    },
    {
      name: "Pitch Deck Builder",
      description: "Create a guided investor story with autosave and a live slide-style preview.",
      icon: PieChart,
      href: "/tools/pitch-deck-builder",
      features: ["10-slide structure", "Autosave", "Slide preview", "Draft export"],
    },
  ];

  const upcoming = [
    {
      name: "Market Size Calculator",
      description: "Estimate TAM, SAM, and SOM with structured prompts.",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent">
            <Target className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground">Business Tools</h1>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-muted-foreground">Use guided tools to plan, model, and present your business with more confidence.</p>
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Available Tools</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.name} className="group transition-all hover:-translate-y-1 hover:shadow-xl">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-5 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {tool.features.map((feature) => (
                        <div key={feature} className="rounded-md bg-muted px-3 py-2">{feature}</div>
                      ))}
                    </div>
                    <Button asChild className="w-full">
                      <Link to={tool.href}>Launch Tool <ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-foreground">Coming Next</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {upcoming.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.name} className="bg-muted/40">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button disabled className="w-full">Coming Soon</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
