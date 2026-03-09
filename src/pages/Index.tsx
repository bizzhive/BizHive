import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText, Building, Users, TrendingUp, Scale, Search, Target, DollarSign, Shield, Lightbulb, Award, CheckCircle, Star, Rocket, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    templates: 0,
    schemes: 0,
    incubators: 0,
    stories: 0
  });

  const toolsRef = useScrollReveal();
  const featuresRef = useScrollReveal();

  useEffect(() => {
    setIsVisible(true);
    
    // Counter animation
    const animateCounters = () => {
      const targets = { templates: 500, schemes: 200, incubators: 100, stories: 10000 };
      const duration = 2000;
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
            observer.unobserve(entry.target);
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
    { name: "Business Canvas", href: "/tools/business-canvas", icon: Target, description: "Visual business model", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "SWOT Analysis", href: "/tools/swot-analysis", icon: TrendingUp, description: "Strengths & weaknesses", color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Financial Calculator", href: "/tools/financial-calculator", icon: DollarSign, description: "Cost & revenue planning", color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Legal Checklist", href: "/legal", icon: Shield, description: "Compliance requirements", color: "text-red-500", bg: "bg-red-500/10" },
    { name: "Market Research", href: "/plan/market-research", icon: Search, description: "Industry insights", color: "text-orange-500", bg: "bg-orange-500/10" },
    { name: "Taxation Guide", href: "/taxation", icon: Award, description: "Tax planning & compliance", color: "text-teal-500", bg: "bg-teal-500/10" },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Smart Business Planning",
      description: "AI-powered tools to create comprehensive business plans with market research and strategic planning.",
      gradient: "from-blue-400 to-blue-600",
      href: "/plan",
      colSpan: "col-span-1 md:col-span-2 lg:col-span-2"
    },
    {
      icon: Rocket,
      title: "Launch Guidance",
      description: "Step-by-step roadmap to launch with operational setup and tracking.",
      gradient: "from-purple-400 to-pink-600",
      href: "/launch",
      colSpan: "col-span-1"
    },
    {
      icon: Scale,
      title: "Growth & Management",
      description: "Scale your operations with team management tools and financial optimization.",
      gradient: "from-green-400 to-emerald-600",
      href: "/manage",
      colSpan: "col-span-1"
    },
    {
      icon: FileText,
      title: "Legal & Compliance",
      description: "Complete legal guidance with document templates and compliance.",
      gradient: "from-red-400 to-orange-500",
      href: "/legal",
      colSpan: "col-span-1 md:col-span-2 lg:col-span-1"
    },
    {
      icon: Building,
      title: "Funding & Incubators",
      description: "Connect with government schemes, incubators, and investors.",
      gradient: "from-amber-400 to-orange-600",
      href: "/incubators",
      colSpan: "col-span-1"
    },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Tech Founder", text: "BizHive helped me validate my startup idea in days!" },
    { name: "Rahul Verma", role: "E-commerce Owner", text: "The legal templates saved me thousands of rupees." },
    { name: "Anita Desai", role: "SaaS Creator", text: "Found my incubator match through the platform." },
    { name: "Vikram Singh", role: "Agency Owner", text: "SWOT analysis tool is incredibly intuitive and helpful." },
    { name: "Neha Gupta", role: "D2C Brand", text: "Taxation guide is a lifesaver for new businesses." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section with Glassmorphism and Blobs */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob dark:opacity-20"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000 dark:opacity-20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000 dark:opacity-20"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`max-w-4xl mx-auto transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mb-6 md:mb-8 flex justify-center">
              <div className="glass px-4 py-2 rounded-full text-sm font-medium mb-4 flex items-center shadow-sm">
                <span className="animate-pulse mr-2">🚀</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">India's #1 Business Growth Platform</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              Turn Your <br className="hidden md:block" />
              <span className="gradient-text-animated">Business Ideas 💡</span> <br className="hidden md:block" />
              Into Reality
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
              The ultimate toolkit for Gen Z entrepreneurs. Launch, scale, and crush your goals with AI-powered guidance and a vibrant community. 🔥
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Button asChild size="lg" className="btn-enhanced bg-blue-600 hover:bg-blue-700 text-white border-0 text-lg px-8 py-6 rounded-2xl shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                <Link to="/plan">
                  Start Planning Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass dark:text-white text-lg px-8 py-6 rounded-2xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                <Link to="/tools">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  Explore Tools
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Testimonials / Social Proof */}
      <section className="py-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-y border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">Trusted by 10,000+ Creators & Founders</p>
        <div className="flex overflow-hidden relative group">
          <div className="flex space-x-6 animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap px-4">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="glass-card px-6 py-4 rounded-2xl min-w-[300px] flex flex-col justify-center shadow-sm">
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">"{t.text}"</p>
                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mr-3 flex items-center justify-center text-white font-bold">{t.name.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Tools Section */}
      <section className="py-20 relative bg-grid-pattern">
        <div className="container mx-auto px-4" ref={toolsRef}>
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Supercharge Your Workflow ⚡️
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Everything you need to build faster, smarter, and better.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card 
                  key={index} 
                  className="glass-card neon-glow border-0 shadow-lg reveal-on-scroll group cursor-pointer"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-2xl ${tool.bg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <Icon className={`h-6 w-6 ${tool.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl dark:text-white group-hover:text-blue-500 transition-colors">{tool.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4 dark:text-gray-300">{tool.description}</CardDescription>
                    <Button asChild variant="ghost" className="w-full justify-between p-0 h-auto font-semibold hover:bg-transparent group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      <Link to={tool.href}>
                        Launch Tool <ArrowRight className="h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 relative">
        <div className="container mx-auto px-4" ref={featuresRef}>
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Your Complete Playbook 🎯
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link 
                  key={index}
                  to={feature.href}
                  className={`reveal-on-scroll group relative overflow-hidden rounded-3xl p-8 flex flex-col justify-end transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl ${feature.colSpan}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}></div>
                  {/* Subtle noise overlay */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                  
                  <div className="relative z-10 text-white">
                    <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 flex items-center">
                      {feature.title}
                      <ArrowRight className="ml-2 h-5 w-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                    <p className="text-white/80 line-clamp-2">{feature.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section with Neon Effects */}
      <section id="stats-section" className="py-20 bg-gray-900 dark:bg-black relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-blue-500/20 blur-[120px] rounded-full"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Templates", count: counters.templates, icon: FileText },
              { label: "Schemes", count: counters.schemes, icon: Building },
              { label: "Incubators", count: counters.incubators, icon: Rocket },
              { label: "Success Stories", count: counters.stories, icon: Heart }
            ].map((stat, i) => (
              <div key={i} className="p-6 glass-card rounded-3xl border border-white/10 hover:border-white/30 transition-colors">
                <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                  {stat.count.toLocaleString()}+
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10 glass-card mx-4 max-w-4xl py-16 rounded-3xl border-white/20 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
            Stop Dreaming, Start Building 🚀
          </h2>
          <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto font-medium">
            Join the community of makers and founders shaping the future of India's startup ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-50 text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <Link to="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
