
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Target, BarChart3, Cog, Rocket, Shield, Award, ArrowRight, CheckCircle } from "lucide-react";

const Manage = () => {
  const managementAreas = [
    {
      icon: TrendingUp,
      title: "Scale Operations",
      description: "Expand your team, enhance efficiency, and diversify offerings",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      features: ["Team Expansion", "Process Optimization", "Service Diversification", "Quality Control"]
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Build loyalty programs and enhance customer engagement",
      color: "text-green-600 dark:text-green-400", 
      bgColor: "bg-green-50 dark:bg-green-900/20",
      features: ["CRM Integration", "Loyalty Programs", "Feedback Systems", "Support Optimization"]
    },
    {
      icon: DollarSign,
      title: "Financial Management",
      description: "Monitor performance, optimize costs, and plan for sustainability",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      features: ["Cash Flow Analysis", "Cost Optimization", "Investment Planning", "Risk Management"]
    }
  ];

  const scalingStrategies = [
    { icon: Target, title: "Market Expansion", description: "Enter new markets and demographics" },
    { icon: BarChart3, title: "Performance Analytics", description: "Track KPIs and optimize operations" },
    { icon: Cog, title: "Automation", description: "Streamline processes with technology" },
    { icon: Rocket, title: "Growth Hacking", description: "Rapid experimentation for growth" },
    { icon: Shield, title: "Risk Management", description: "Identify and mitigate business risks" },
    { icon: Award, title: "Quality Assurance", description: "Maintain excellence while scaling" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 animate-bounce-in">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Manage & Scale Your Business
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-up">
            Grow your business with advanced management strategies, data-driven insights, and proven scaling techniques
          </p>
        </div>

        {/* Main Management Areas */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16 stagger-animation">
          {managementAreas.map((area, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 relative overflow-hidden">
              <div className={`absolute inset-0 ${area.bgColor} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 ${area.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <area.icon className={`h-7 w-7 ${area.color}`} />
                </div>
                <CardTitle className="text-xl dark:text-white">{area.title}</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  {area.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  {area.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full group/btn" variant="outline">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scaling Strategies */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced Scaling Strategies
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Proven methodologies to accelerate your business growth
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
            {scalingStrategies.map((strategy, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <strategy.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg dark:text-white">{strategy.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="dark:text-gray-300">
                    {strategy.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Growth Metrics */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-center text-2xl dark:text-white">Key Growth Metrics to Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">85%</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Customer Retention Rate</p>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">3.2x</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Revenue Growth</p>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">45%</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Cost Reduction</p>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">92%</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Process Efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Manage;
