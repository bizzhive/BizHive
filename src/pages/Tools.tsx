
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Search, 
  Award, 
  Calculator, 
  PieChart,
  FileCheck,
  Users,
  Lightbulb,
  BarChart3,
  Zap,
  Star
} from "lucide-react";

const Tools = () => {
  const toolCategories = [
    {
      title: "Planning & Strategy",
      description: "Tools to plan and strategize your business",
      tools: [
        {
          name: "Business Model Canvas",
          description: "Visual business model planning tool with collaborative features",
          icon: Target,
          href: "/tools/business-canvas",
          premium: false,
          rating: 4.8,
          users: "12k+"
        },
        {
          name: "SWOT Analysis Tool",
          description: "Analyze strengths, weaknesses, opportunities, and threats",
          icon: TrendingUp,
          href: "/tools/swot-analysis",
          premium: false,
          rating: 4.7,
          users: "8k+"
        },
        {
          name: "Market Research Toolkit",
          description: "Comprehensive market analysis and competitor research tools",
          icon: Search,
          href: "/tools/market-research",
          premium: true,
          rating: 4.9,
          users: "5k+"
        },
        {
          name: "Value Proposition Canvas",
          description: "Design compelling value propositions for your customers",
          icon: Lightbulb,
          href: "/tools/value-proposition",
          premium: true,
          rating: 4.6,
          users: "3k+"
        }
      ]
    },
    {
      title: "Financial Planning",
      description: "Calculate costs, revenue, and financial projections",
      tools: [
        {
          name: "Startup Cost Calculator",
          description: "Calculate initial investment and operational costs",
          icon: Calculator,
          href: "/tools/startup-calculator",
          premium: false,
          rating: 4.8,
          users: "15k+"
        },
        {
          name: "Revenue Projection Tool",
          description: "Create detailed revenue forecasts and growth models",
          icon: BarChart3,
          href: "/tools/revenue-projector",
          premium: true,
          rating: 4.7,
          users: "7k+"
        },
        {
          name: "Break-Even Analysis",
          description: "Calculate when your business will become profitable",
          icon: PieChart,
          href: "/tools/break-even",
          premium: false,
          rating: 4.6,
          users: "9k+"
        },
        {
          name: "Cash Flow Planner",
          description: "Plan and track your business cash flow",
          icon: DollarSign,
          href: "/tools/cash-flow",
          premium: true,
          rating: 4.8,
          users: "4k+"
        }
      ]
    },
    {
      title: "Legal & Compliance",
      description: "Ensure legal compliance and understand requirements",
      tools: [
        {
          name: "Legal Compliance Checker",
          description: "Check legal requirements for your business type and location",
          icon: Shield,
          href: "/tools/compliance-checker",
          premium: false,
          rating: 4.9,
          users: "6k+"
        },
        {
          name: "Business Structure Advisor",
          description: "Find the right business structure for your needs",
          icon: Building,
          href: "/tools/structure-advisor",
          premium: false,
          rating: 4.7,
          users: "8k+"
        },
        {
          name: "License & Permit Finder",
          description: "Discover required licenses and permits for your business",
          icon: FileCheck,
          href: "/tools/license-finder",
          premium: true,
          rating: 4.8,
          users: "3k+"
        }
      ]
    },
    {
      title: "Presentation & Pitch",
      description: "Create compelling presentations and pitches",
      tools: [
        {
          name: "Pitch Deck Builder",
          description: "Create investor-ready pitch decks with proven templates",
          icon: Award,
          href: "/tools/pitch-deck",
          premium: true,
          rating: 4.9,
          users: "4k+"
        },
        {
          name: "Business Plan Generator",
          description: "Generate comprehensive business plans with AI assistance",
          icon: FileCheck,
          href: "/tools/business-plan-generator",
          premium: true,
          rating: 4.8,
          users: "6k+"
        },
        {
          name: "Investor Readiness Score",
          description: "Assess how ready your business is for investment",
          icon: Star,
          href: "/tools/investor-readiness",
          premium: true,
          rating: 4.7,
          users: "2k+"
        }
      ]
    }
  ];

  const quickActions = [
    { name: "Calculate Startup Costs", href: "/tools/startup-calculator", icon: Calculator },
    { name: "Check Business Name", href: "/tools/name-checker", icon: Search },
    { name: "Find Licenses", href: "/tools/license-finder", icon: Shield },
    { name: "Create SWOT", href: "/tools/swot-analysis", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Business Tools</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools to plan, analyze, and grow your business. From financial calculators to 
            legal compliance checkers - everything you need in one place.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Link to={action.href}>
                    <Icon className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium text-center">{action.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tool Categories */}
        <div className="space-y-12">
          {toolCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.title}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool, toolIndex) => {
                  const Icon = tool.icon;
                  return (
                    <Card key={toolIndex} className="hover:shadow-lg transition-all duration-300 group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                              <Icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{tool.name}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={tool.premium ? "default" : "secondary"} className="text-xs">
                                  {tool.premium ? "Premium" : "Free"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="mt-3 leading-relaxed">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {tool.users} users
                          </span>
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                            {tool.rating}
                          </span>
                        </div>
                        <Button asChild className="w-full group-hover:bg-blue-700 transition-colors">
                          <Link to={tool.href}>
                            Launch Tool
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Tool?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find the right tool for your specific need? Let us know and we'll build it for you.
          </p>
          <Button variant="secondary" size="lg">
            Request Custom Tool
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tools;
