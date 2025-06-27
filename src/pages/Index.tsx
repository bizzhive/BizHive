
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText, Building, Users, TrendingUp, Scale, Search, Target, DollarSign, Shield, Lightbulb, Award, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const quickTools = [
    { name: "Business Canvas", href: "/tools/business-canvas", icon: Target, description: "Visual business model" },
    { name: "SWOT Analysis", href: "/tools/swot-analysis", icon: TrendingUp, description: "Strengths & weaknesses" },
    { name: "Financial Calculator", href: "/tools/financial-calculator", icon: DollarSign, description: "Cost & revenue planning" },
    { name: "Legal Checklist", href: "/tools/legal-checklist", icon: Shield, description: "Compliance requirements" },
    { name: "Market Research", href: "/tools/market-research", icon: Search, description: "Industry insights" },
    { name: "Pitch Deck Builder", href: "/tools/pitch-deck", icon: Award, description: "Investor presentations" },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Smart Business Planning",
      description: "AI-powered tools to create comprehensive business plans with market research, financial projections, and strategic planning.",
      color: "blue",
      href: "/plan"
    },
    {
      icon: TrendingUp,
      title: "Launch Guidance",
      description: "Step-by-step roadmap to launch your business with operational setup, marketing strategies, and performance tracking.",
      color: "green",
      href: "/launch"
    },
    {
      icon: Scale,
      title: "Growth & Management",
      description: "Scale your operations with team management tools, customer engagement strategies, and financial optimization.",
      color: "purple",
      href: "/manage"
    },
    {
      icon: FileText,
      title: "Legal & Compliance",
      description: "Complete legal guidance with document templates, compliance tracking, and industry-specific requirements.",
      color: "red",
      href: "/legal"
    },
    {
      icon: Building,
      title: "Funding & Incubators",
      description: "Connect with government schemes, incubators, and investors. Prepare compelling pitches and secure funding.",
      color: "orange",
      href: "/incubators"
    },
    {
      icon: Users,
      title: "Community & Learning",
      description: "Join entrepreneur networks, find co-founders, access courses, and learn from industry experts.",
      color: "teal",
      href: "/community"
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Lightbulb className="h-4 w-4 mr-2" />
                India's #1 Business Growth Platform
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Your <span className="text-blue-600">Business Ideas</span> Into Reality
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Complete ecosystem for Indian entrepreneurs - from business planning and legal compliance to funding and growth. 
              Start, launch, and scale your business with expert guidance and AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="text-lg px-8 py-4 h-auto">
                <Link to="/plan">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Planning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                <Link to="/tools">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Business Tools
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                <span>Trusted by 10,000+ Entrepreneurs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tools Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Business Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access powerful tools instantly to validate ideas, plan strategies, and make informed decisions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <CardDescription className="text-sm">{tool.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button asChild variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      <Link to={tool.href} className="flex items-center">
                        Launch Tool <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Business Success
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Comprehensive platform covering every aspect of your entrepreneurial journey - from idea validation to business scaling
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = {
                blue: "bg-blue-500 text-blue-50",
                green: "bg-green-500 text-green-50",
                purple: "bg-purple-500 text-purple-50",
                red: "bg-red-500 text-red-50",
                orange: "bg-orange-500 text-orange-50",
                teal: "bg-teal-500 text-teal-50"
              };
              
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${colors[feature.color as keyof typeof colors]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="p-0 text-blue-600 hover:text-blue-800">
                      <Link to={feature.href} className="flex items-center font-medium">
                        Explore {feature.title.split(' ')[0]} <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Legal Templates</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-blue-100">Government Schemes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Incubators Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Success Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Business Journey?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of successful entrepreneurs who started their journey with BizHive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4 h-auto">
              <Link to="/register">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4 h-auto border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/contact">
                Get Expert Consultation
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
