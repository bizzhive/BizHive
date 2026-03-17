
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText, Building, Users, TrendingUp, Scale, Search, Target, DollarSign, Shield, Award, CheckCircle, Rocket, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import BeeIcon from "@/components/BeeIcon";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ templates: 0, schemes: 0, incubators: 0, stories: 0 });
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Reveal on scroll
          if (entry.target.classList.contains("reveal-on-scroll") && entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
          // Stats counter
          if (entry.target.id === "stats-section" && entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    const stats = document.getElementById("stats-section");
    if (stats) observer.observe(stats);

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const targets = { templates: 500, schemes: 200, incubators: 100, stories: 10000 };
    const duration = 2000;
    const steps = 50;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const p = 1 - Math.pow(1 - step / steps, 4);
      setCounters({
        templates: Math.floor(targets.templates * p),
        schemes: Math.floor(targets.schemes * p),
        incubators: Math.floor(targets.incubators * p),
        stories: Math.floor(targets.stories * p),
      });
      if (step >= steps) { clearInterval(timer); setCounters(targets); }
    }, duration / steps);
  };

  const quickTools = [
    { name: "Business Canvas", href: "/tools/business-canvas", icon: Target, description: "Visual business model", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "SWOT Analysis", href: "/tools/swot-analysis", icon: TrendingUp, description: "Strengths & weaknesses", color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Financial Calculator", href: "/tools/financial-calculator", icon: DollarSign, description: "Cost & revenue planning", color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Legal Checklist", href: "/legal", icon: Shield, description: "Compliance requirements", color: "text-red-500", bg: "bg-red-500/10" },
    { name: "Market Research", href: "/plan/market-research", icon: Search, description: "Industry insights", color: "text-orange-500", bg: "bg-orange-500/10" },
    { name: "Taxation Guide", href: "/taxation", icon: Award, description: "Tax planning & compliance", color: "text-teal-500", bg: "bg-teal-500/10" },
  ];

  const features = [
    { icon: BookOpen, title: "Smart Business Planning", description: "AI-powered tools to create comprehensive business plans with market research and strategic planning.", gradient: "from-blue-500 to-cyan-500", href: "/plan", colSpan: "col-span-1 md:col-span-2 lg:col-span-2" },
    { icon: Rocket, title: "Launch Guidance", description: "Step-by-step roadmap to launch with operational setup and tracking.", gradient: "from-violet-500 to-purple-600", href: "/launch", colSpan: "col-span-1" },
    { icon: Scale, title: "Growth & Management", description: "Scale your operations with team management tools and financial optimization.", gradient: "from-emerald-500 to-green-600", href: "/manage", colSpan: "col-span-1" },
    { icon: FileText, title: "Legal & Compliance", description: "Complete legal guidance with document templates and compliance.", gradient: "from-rose-500 to-orange-500", href: "/legal", colSpan: "col-span-1 md:col-span-2 lg:col-span-1" },
    { icon: Building, title: "Funding & Incubators", description: "Connect with government schemes, incubators, and investors.", gradient: "from-amber-500 to-orange-600", href: "/incubators", colSpan: "col-span-1" },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Tech Founder", text: "BizHive helped me validate my startup idea in days!" },
    { name: "Rahul Verma", role: "E-commerce Owner", text: "The legal templates saved me thousands of rupees." },
    { name: "Anita Desai", role: "SaaS Creator", text: "Found my incubator match through the platform." },
    { name: "Vikram Singh", role: "Agency Owner", text: "SWOT analysis tool is incredibly intuitive and helpful." },
    { name: "Neha Gupta", role: "D2C Brand", text: "Taxation guide is a lifesaver for new businesses." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 overflow-hidden">
        {/* Animated honeycomb background */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="honeycomb-hero" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="currentColor" strokeWidth="1"/>
                <path d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb-hero)" className="text-foreground"/>
          </svg>
        </div>

        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/10 dark:bg-purple-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`max-w-4xl mx-auto transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            {/* Badge */}
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/60 backdrop-blur-sm shadow-sm">
                <BeeIcon className="w-5 h-5" />
                <span className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">India's #1 Business Growth Platform</span>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground mb-6 leading-[0.95] tracking-tight">
              Build Your
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                Business Empire
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              The ultimate toolkit for ambitious entrepreneurs. Plan, launch, and scale your startup with AI-powered guidance and a thriving community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                <Link to="/plan">
                  Start Planning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl hover:-translate-y-0.5 transition-all duration-300">
                <Link to="/tools">
                  <Zap className="mr-2 h-5 w-5 text-amber-500" />
                  Explore Tools
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating bee decoration */}
        <div className="absolute bottom-10 right-[15%] hidden lg:block animate-float" style={{ animationDelay: "1.5s" }}>
          <BeeIcon className="w-16 h-16 opacity-20" />
        </div>
      </section>

      {/* Social Proof Marquee */}
      <section className="py-10 bg-muted/50 border-y overflow-hidden">
        <p className="text-center text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Trusted by 10,000+ Creators & Founders</p>
        <div className="flex overflow-hidden relative group">
          <div className="flex space-x-6 animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap px-4">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="px-6 py-4 rounded-2xl min-w-[300px] bg-background border shadow-sm">
                <p className="text-foreground font-medium mb-2">"{t.text}"</p>
                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mr-3 flex items-center justify-center text-white font-bold text-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Tools */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Supercharge Your Workflow
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to build faster, smarter, and better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link key={index} to={tool.href} className="reveal-on-scroll group" style={{ transitionDelay: `${index * 80}ms` }}>
                  <Card className="h-full border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-background">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${tool.bg} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-5 w-5 ${tool.color}`} />
                        </div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm mb-3">{tool.description}</CardDescription>
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Launch Tool <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bento Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Your Complete Playbook</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[240px]">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.href}
                  className={`reveal-on-scroll group relative overflow-hidden rounded-2xl p-7 flex flex-col justify-end transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${feature.colSpan}`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative z-10 text-white">
                    <div className="bg-white/20 backdrop-blur w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-1.5 flex items-center gap-2">
                      {feature.title}
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats-section" ref={statsRef} className="py-20 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-orange-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Templates", count: counters.templates, icon: FileText },
              { label: "Schemes", count: counters.schemes, icon: Building },
              { label: "Incubators", count: counters.incubators, icon: Rocket },
              { label: "Success Stories", count: counters.stories, icon: Heart },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl border border-background/10 hover:border-background/25 transition-colors bg-background/5 backdrop-blur">
                <stat.icon className="h-7 w-7 text-amber-400 mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-black mb-1">{stat.count.toLocaleString()}+</div>
                <div className="text-background/60 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">
              Stop Dreaming, Start Building
            </h2>
            <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
              Join the community of makers and founders shaping the future of India's startup ecosystem.
            </p>
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-white/90 text-lg px-10 py-6 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
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
