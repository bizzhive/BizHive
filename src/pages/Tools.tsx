
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Calculator, DollarSign, PieChart, BarChart } from "lucide-react";
import { Link } from "react-router-dom";

const Tools = () => {
  const tools = [
    {
      name: "Business Model Canvas",
      description: "Create a visual representation of your business model using the proven Business Model Canvas framework.",
      icon: Target,
      href: "/tools/business-canvas",
      color: "blue",
      features: ["9 Key Components", "Visual Layout", "Export Options", "Save Progress"]
    },
    {
      name: "SWOT Analysis",
      description: "Analyze your business's Strengths, Weaknesses, Opportunities, and Threats to make informed strategic decisions.",
      icon: TrendingUp,
      href: "/tools/swot-analysis",
      color: "green",
      features: ["Strategic Framework", "Color-coded Sections", "Action Items", "Download Report"]
    },
    {
      name: "Startup Cost Calculator",
      description: "Calculate your initial investment requirements and monthly operating costs to determine total startup capital needed.",
      icon: Calculator,
      href: "/tools/startup-calculator",
      color: "purple",
      features: ["One-time Costs", "Monthly Expenses", "Runway Planning", "Funding Requirements"]
    },
    {
      name: "Financial Calculator",
      description: "Calculate revenue projections, expenses, and profitability for your business with detailed financial analysis.",
      icon: DollarSign,
      href: "/tools/financial-calculator",
      color: "orange",
      features: ["Revenue Projections", "Expense Tracking", "Profitability Analysis", "Break-even Calculation"]
    }
  ];

  const comingSoonTools = [
    {
      name: "Pitch Deck Builder",
      description: "Create compelling investor presentations with our guided pitch deck builder.",
      icon: PieChart,
      color: "red"
    },
    {
      name: "Market Size Calculator",
      description: "Estimate your total addressable market (TAM) and market opportunity.",
      icon: BarChart,
      color: "teal"
    }
  ];

  const colors = {
    blue: "bg-blue-500 text-blue-50",
    green: "bg-green-500 text-green-50",
    purple: "bg-purple-500 text-purple-50",
    orange: "bg-orange-500 text-orange-50",
    red: "bg-red-500 text-red-50",
    teal: "bg-teal-500 text-teal-50"
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 animate-bounce-in">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Business Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-up">
            Powerful tools to help you plan, analyze, and grow your business
          </p>
        </div>

        {/* Available Tools */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 group dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${colors[tool.color as keyof typeof colors]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl dark:text-white">{tool.name}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {tool.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to={tool.href} className="flex items-center justify-center">
                        Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coming Soon */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Coming Soon</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {comingSoonTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="opacity-75 dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${colors[tool.color as keyof typeof colors]} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl dark:text-white">{tool.name}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
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
