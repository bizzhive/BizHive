
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText, Building, Users, TrendingUp, Scale, Search, Target, DollarSign, Shield, Lightbulb, Award, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    templates: 0,
    schemes: 0,
    incubators: 0,
    stories: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Counter animation
    const animateCounters = () => {
      const targets = { templates: 500, schemes: 200, incubators: 100, stories: 10000 };
      const duration = 2000; // 2 seconds
      const steps = 50;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setCounters({
          templates: Math.floor(targets.templates * easeOutQuart),
          schemes: Math.floor(targets.schemes * easeOutQuart),
          incubators: Math.floor(targets.incubators * easeOutQuart),
          stories: Math.floor(targets.stories * easeOutQuart)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setCounters(targets);
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id === 'stats-section') {
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => {
      if (statsSection) observer.unobserve(statsSection);
    };
  }, []);

  const quickTools = [
    { name: "Business Canvas", href: "/tools/business-canvas", icon: Target, description: "Visual business model" },
    { name: "SWOT Analysis", href: "/tools/swot-analysis", icon: TrendingUp, description: "Strengths & weaknesses" },
    { name: "Financial Calculator", href: "/tools/financial-calculator", icon: DollarSign, description: "Cost & revenue planning" },
    { name: "Legal Checklist", href: "/legal", icon: Shield, description: "Compliance requirements" },
    { name: "Market Research", href: "/plan/market-research", icon: Search, description: "Industry insights" },
    { name: "Taxation Guide", href: "/taxation", icon: Award, description: "Tax planning & compliance" },
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
    <div className="min-h-screen dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className={`max-w-4xl mx-auto transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mb-6 md:mb-8">
              <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 md:px-4 py-2 rounded-full text-sm font-medium mb-4 animate-pulse">
                <Lightbulb className="h-4 w-4 mr-2 animate-bounce" />
                India's #1 Business Growth Platform
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
              Turn Your <span className="text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">Business Ideas</span> Into Reality
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto px-4">
              Complete ecosystem for Indian entrepreneurs - from business planning and legal compliance to funding and growth. 
              Start, launch, and scale your business with expert guidance and AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 md:mb-8 px-4">
              <Button asChild size="lg" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Link to="/plan">
                  <BookOpen className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                  Start Planning Free
                  <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto dark:bg-gray-800 dark:text-white dark:border-gray-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Link to="/tools">
                  <Search className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                  Explore Business Tools
                </Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center animate-fade-in">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                <span>Trusted by 10,000+ Entrepreneurs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tools Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Quick Business Tools</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Access powerful tools instantly to validate ideas, plan strategies, and make informed decisions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {quickTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 dark:bg-gray-700 dark:border-gray-600 transform hover:scale-105 hover:-translate-y-1 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base md:text-lg dark:text-white">{tool.name}</CardTitle>
                        <CardDescription className="text-sm dark:text-gray-300">{tool.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button asChild variant="ghost" className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group">
                      <Link to={tool.href} className="flex items-center">
                        Launch Tool <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Business Success
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Comprehensive platform covering every aspect of your entrepreneurial journey - from idea validation to business scaling
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                <Card 
                  key={index} 
                  className="hover:shadow-xl transition-all duration-500 group dark:bg-gray-800 dark:border-gray-700 transform hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${colors[feature.color as keyof typeof colors]} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg md:text-xl dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="p-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group">
                      <Link to={feature.href} className="flex items-center font-medium">
                        Explore {feature.title.split(' ')[0]} <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
      <section id="stats-section" className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="transform hover:scale-110 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {counters.templates.toLocaleString()}+
              </div>
              <div className="text-blue-100 text-sm md:text-base">Legal Templates</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {counters.schemes.toLocaleString()}+
              </div>
              <div className="text-blue-100 text-sm md:text-base">Government Schemes</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {counters.incubators.toLocaleString()}+
              </div>
              <div className="text-blue-100 text-sm md:text-base">Incubators Listed</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300" style={{ animationDelay: '0.6s' }}>
              <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {counters.stories.toLocaleString()}+
              </div>
              <div className="text-blue-100 text-sm md:text-base">Success Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Business Journey?</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 text-blue-100 max-w-2xl mx-auto px-4">
            Join thousands of successful entrepreneurs who started their journey with BizHive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Link to="/register">
                Create Free Account
                <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
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
