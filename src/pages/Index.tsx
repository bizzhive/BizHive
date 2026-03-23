import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText, Building, Users, TrendingUp, Scale, Search, Target, DollarSign, Shield, Award, CheckCircle, Rocket, Zap, Heart, Globe, Lightbulb, BarChart3, GraduationCap, Store, Smartphone, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import BeeIcon from "@/components/BeeIcon";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ templates: 0, schemes: 0, incubators: 0, stories: 0 });
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.classList.contains("reveal-on-scroll") && entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
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

  const journeySteps = [
    { step: "01", title: "Plan", desc: "Validate your idea with market research, create a solid business plan, and map your business model on canvas.", icon: Lightbulb, color: "from-amber-500 to-orange-500" },
    { step: "02", title: "Launch", desc: "Register your business, get licenses, set up compliance, understand taxation, and prepare for day one.", icon: Rocket, color: "from-blue-500 to-cyan-500" },
    { step: "03", title: "Grow", desc: "Analyze strengths with SWOT, find incubators and funding, optimize financials, and scale operations.", icon: TrendingUp, color: "from-emerald-500 to-green-500" },
    { step: "04", title: "Scale", desc: "Access advanced tools, connect with the community, get AI-powered advice, and take your business national.", icon: BarChart3, color: "from-violet-500 to-purple-500" },
  ];

  const useCases = [
    { icon: Store, title: "Opening a Retail Store", desc: "From FSSAI licenses to GST registration, get every document and checklist you need." },
    { icon: Smartphone, title: "Launching a Tech Startup", desc: "Business canvas, pitch decks, incubator matching, and incorporation guidance." },
    { icon: GraduationCap, title: "Freelancer Going Pro", desc: "Understand taxation, create invoices, and register as a sole proprietor or LLP." },
    { icon: Globe, title: "E-commerce Business", desc: "Market research tools, financial calculators, and legal compliance for online selling." },
    { icon: Landmark, title: "Social Enterprise / NGO", desc: "Registration guides, compliance checklists, and funding scheme directories." },
    { icon: Users, title: "Agency or Consultancy", desc: "Business planning tools, client management frameworks, and growth strategies." },
  ];

  const sources = [
    "Ministry of Corporate Affairs (MCA)",
    "DPIIT & Startup India",
    "GST Portal & CBDT",
    "Reserve Bank of India (RBI)",
    "SEBI & FEMA Guidelines",
    "NPTEL & Skill India",
    "State MSME Portals",
    "FSSAI & Labour Dept.",
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 overflow-hidden">
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

        <div className="absolute top-20 left-[10%] w-64 h-64 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`max-w-4xl mx-auto transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/60 backdrop-blur-sm shadow-sm">
                <BeeIcon className="w-5 h-5" />
                <span className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">{t("India's Business Growth Platform")}</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground mb-6 leading-[0.95] tracking-tight">
              {t("Build Your")}
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                {t("Business Empire")}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              {t("India is a land of business. Here, no idea is small and no business is unscalable. From a general store to a global app - we are here for all.")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild className="h-11 px-8 text-lg py-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                <Link to="/plan">
                  {t("Start Planning Free")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild className="h-11 px-8 text-lg py-6 rounded-xl hover:-translate-y-0.5 transition-all duration-300 border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                <Link to="/tools">
                  <Zap className="mr-2 h-5 w-5 text-amber-500" />
                  {t("Explore Tools")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is BizHive */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center reveal-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              {t("What is BizHive?")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t("BizHive is India's comprehensive business growth platform - a single destination where entrepreneurs, freelancers, and small business owners find everything they need to start, run, and scale a business. Whether you're filing your first GST return, writing a pitch deck for investors, or figuring out FSSAI licensing for your cloud kitchen, BizHive has you covered with step-by-step guides, interactive tools, legal templates, and an AI assistant that understands Indian business regulations.")}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {useCases.map((uc, i) => {
                const Icon = uc.icon;
                return (
                  <div key={i} className="p-4 rounded-xl bg-background border hover:shadow-md transition-shadow text-left">
                    <Icon className="h-6 w-6 text-primary mb-2" />
                    <h4 className="font-semibold text-foreground text-sm mb-1">{t(uc.title)}</h4>
                    <p className="text-xs text-muted-foreground">{t(uc.desc)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How We Help — Journey Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("How We Help You Succeed")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("Your four-stage journey from idea to empire.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeySteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="reveal-on-scroll relative group" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="p-6 rounded-2xl border bg-background hover:shadow-xl transition-all duration-300 h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("Step")} {s.step}</span>
                    <h3 className="text-xl font-bold text-foreground mt-1 mb-2">{t(s.title)}</h3>
                    <p className="text-sm text-muted-foreground">{t(s.desc)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Marquee */}
      <section className="py-10 bg-muted/50 border-y overflow-hidden">
        <p className="text-center text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">{t("Trusted by 10,000+ Creators & Founders")}</p>
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
              {t("Supercharge Your Workflow")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("Everything you need to build faster, smarter, and better.")}
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
                        <CardTitle className="text-lg">{t(tool.name)}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm mb-3">{t(tool.description)}</CardDescription>
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t("Launch Tool")} <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why BizHive */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("Why BizHive?")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: DollarSign, title: "100% Free Tools", desc: "No paywalls, no trials. Every calculator, canvas, and template is free." },
              { icon: Globe, title: "India-Focused", desc: "Built for Indian regulations — GST, MCA, FSSAI, Startup India, and more." },
              { icon: BeeIcon, title: "AI-Powered Advisor", desc: "Bee AI understands your business context and gives tailored advice." },
              { icon: Users, title: "Active Community", desc: "Connect with founders, mentors, and experts across industries." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="reveal-on-scroll text-center p-6 rounded-2xl bg-background border hover:shadow-lg transition-all" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{t(item.title)}</h3>
                  <p className="text-sm text-muted-foreground">{t(item.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bento Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("Your Complete Playbook")}</h2>
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
                      {t(feature.title)}
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                    <p className="text-white/80 text-sm">{t(feature.description)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bee AI Capabilities Section */}
      <section className="py-24 bg-gradient-to-b from-amber-50/50 to-white dark:from-background dark:to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-orange-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 reveal-on-scroll">
            <div className="inline-flex items-center justify-center p-3 mb-6 bg-amber-100 dark:bg-amber-900/30 rounded-2xl animate-bounce">
              <BeeIcon className="w-10 h-10" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t("Meet")} <span className="text-amber-600">{t("Bee AI")}</span>, {t("Your Co-Founder")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("Smart, context-aware, and built for Indian business.")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual Demo of Selection Feature */}
            <div className="reveal-on-scroll order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-20 animate-pulse"></div>
                <Card className="relative bg-background/80 backdrop-blur-sm border-amber-200/50 dark:border-amber-800/50 shadow-2xl overflow-hidden">
                  <CardHeader className="bg-muted/50 border-b border-border/50 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                      <div className="w-3 h-3 rounded-full bg-green-400/80" />
                      <span className="ml-2 text-xs text-muted-foreground font-mono">{t("Select any text to ask Bee")}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <p className="text-xl text-foreground/80 leading-relaxed font-serif">
                        "Starting a business involves choosing between a Sole Proprietorship, LLP, or a <span className="bg-amber-200/50 dark:bg-amber-500/30 px-1 rounded relative cursor-text selection:bg-amber-300 selection:text-amber-900">Private Limited Company<div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20"><div className="bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"><BeeIcon className="w-3 h-3" /> Ask Bee</div></div></span>."
                      </p>
                      
                      <div className="relative pl-4 border-l-2 border-amber-400">
                        <div className="flex gap-3">
                          <div className="p-1.5 bg-amber-100 rounded-lg h-fit">
                            <BeeIcon className="w-4 h-4 text-amber-600" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">Bee AI Explanation:</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              A <strong>Private Limited Company</strong> is a separate legal entity from its owners. It protects your personal assets (house, car) if the business faces losses. In India, it's the preferred structure for startups raising funding.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Features List */}
            <div className="reveal-on-scroll order-1 lg:order-2 space-y-8">
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{t("Instant Contextual Help")}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("Stuck on a confusing term while reading a guide? Just highlight it. Bee pops up instantly to explain jargon, legal terms, or financial concepts in simple language.")}
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{t("Draft Contracts & Plans")}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("Need an employment offer letter or a co-founder agreement? Bee can draft legally-sound templates tailored to your specific needs in seconds.")}
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{t("Strategic Advice")}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("Not sure which government scheme applies to you? Ask Bee. It knows about Startup India, MSME benefits, and local subsidies.")}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button asChild className="h-11 px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90">
                  <Link to="/ai-assistant">
                    {t("Try Bee AI Now")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
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
                <div className="text-background/60 text-sm font-medium">{t(stat.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Sources */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 reveal-on-scroll">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("Our Sources")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">{t("All information is sourced from official Indian government portals and regulatory bodies.")}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto reveal-on-scroll">
            {sources.map((s, i) => (
              <span key={i} className="px-4 py-2 rounded-full border bg-background text-sm font-medium text-foreground hover:bg-accent transition-colors">
                {s}
              </span>
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
              {t("Stop Dreaming, Start Building")}
            </h2>
            <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
              {t("Join the community of makers and founders shaping the future of India's startup ecosystem.")}
            </p>
            <Button asChild className="h-11 px-10 bg-white text-orange-600 hover:bg-white/90 text-lg py-6 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
              <Link to="/login">
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
