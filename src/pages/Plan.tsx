
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Target, TrendingUp, DollarSign, FileCheck, CheckCircle, Lightbulb, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FAQSection from "@/components/FAQSection";

const planFAQs = [
  { question: "Why is business planning important?", answer: "A solid business plan helps you define your vision, understand your market, secure funding, and create a roadmap for growth. Studies show that entrepreneurs who plan are 16% more likely to achieve viability than those who don't." },
  { question: "What business structure should I choose in India?", answer: "It depends on your goals: Sole Proprietorship is simplest for freelancers. LLP is great for partnerships with limited liability. Pvt Ltd is ideal for startups seeking funding. OPC works for solo founders wanting corporate benefits. Consider factors like liability, taxation, compliance costs, and scalability." },
  { question: "How long does it take to register a business in India?", answer: "Sole Proprietorship: 1-2 days. LLP: 10-15 days. Pvt Ltd: 15-25 days (including DSC, DIN, name approval, and incorporation). The process has been significantly streamlined through the MCA portal." },
  { question: "Do I need a CA or lawyer to start a business?", answer: "Not strictly required for sole proprietorships, but highly recommended for LLP and Pvt Ltd registrations. A CA helps with tax planning, GST registration, and compliance. Legal counsel is advisable for partnership agreements and shareholder contracts." },
  { question: "How much does it cost to start a business in India?", answer: "Costs vary widely: Sole Proprietorship can start with ₹500-2,000. LLP registration costs ₹5,000-15,000. Pvt Ltd incorporation costs ₹10,000-25,000. Add GST registration (free), professional fees, and initial working capital. Use our Startup Calculator for detailed estimates." },
  { question: "What is the minimum capital required?", answer: "There's no minimum capital requirement for Pvt Ltd companies since 2015. For LLP, there's no minimum contribution required. However, having adequate capital (at least 6 months of operating expenses) is practically essential for survival." },
];

const Plan = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("Plan Your Business")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("Turn your business idea into a comprehensive plan with our step-by-step guides and interactive tools")}
          </p>
        </div>

        {/* Why Plan Section */}
        <div className="bg-muted/50 rounded-2xl p-8 mb-12 border">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl shrink-0">
              <Lightbulb className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("Why Planning Matters")}</h2>
              <p className="text-muted-foreground">{t("Planning isn't just paperwork - it's the foundation of every successful business. Here's why:")}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{t("Clarity & Direction")}</h3>
              <p className="text-sm text-muted-foreground">{t("A plan forces you to think through your business model, revenue streams, and competitive advantages before investing time and money.")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{t("Attract Investors")}</h3>
              <p className="text-sm text-muted-foreground">{t("No investor funds a pitch without a plan. Banks, VCs, and angel investors all require a well-structured business plan before committing capital.")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{t("Reduce Risk")}</h3>
              <p className="text-sm text-muted-foreground">{t("Market research and financial projections help you identify potential pitfalls early, saving you from costly mistakes down the road.")}</p>
            </div>
          </div>
        </div>

        {/* Main Planning Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Search, title: "Market Research", desc: "Identify your target market, analyze competitors, and understand market demand", items: ["Target market identification", "Competitor analysis tools", "Market demand assessment", "Economic viability check"], href: "/plan/market-research", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: FileCheck, title: "Business Plan", desc: "Create a comprehensive business plan with our guided templates", items: ["Business goals definition", "Financial projections", "Marketing strategies", "Operational planning"], href: "/plan/business-plan", color: "text-green-500", bg: "bg-green-500/10" },
            { icon: Target, title: "Business Registration", desc: "Choose the right business structure and complete registration", items: ["Business structure selection", "Name registration", "Digital signature setup", "Incorporation filing"], href: "/legal", color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((card, i) => (
            <Card key={i} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <div className={`p-3 rounded-xl ${card.bg} w-fit mb-2`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <CardTitle>{t(card.title)}</CardTitle>
                <CardDescription>{t(card.desc)}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1.5 mb-4">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />{t(item)}</li>
                  ))}
                </ul>
                <Button asChild className="w-full"><Link to={card.href}>{t("Get Started")}</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Planning Process */}
        <div className="bg-card rounded-2xl p-8 mb-12 border">
          <h2 className="text-2xl font-bold mb-6 text-foreground">{t("5-Step Planning Process")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { step: "1", title: "Research", desc: "Market & Competition", color: "bg-blue-500" },
              { step: "2", title: "Plan", desc: "Business Model", color: "bg-green-500" },
              { step: "3", title: "Structure", desc: "Legal Entity", color: "bg-purple-500" },
              { step: "4", title: "Register", desc: "Official Filing", color: "bg-orange-500" },
              { step: "5", title: "Prepare", desc: "Launch Ready", color: "bg-teal-500" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className={`w-10 h-10 ${s.color} rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm`}>{s.step}</div>
                <h3 className="font-semibold text-sm text-foreground">{t(s.title)}</h3>
                <p className="text-xs text-muted-foreground">{t(s.desc)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tools */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-4 border">
          <h2 className="text-2xl font-bold mb-6 text-foreground">{t("Quick Planning Tools")}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Target, label: "Business Canvas", href: "/tools/business-canvas" },
              { icon: TrendingUp, label: "SWOT Analysis", href: "/tools/swot-analysis" },
              { icon: DollarSign, label: "Financial Calculator", href: "/tools/financial-calculator" },
              { icon: CheckCircle, label: "Launch Checklist", href: "/launch" },
            ].map((t, i) => (
              <Button key={i} asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Link to={t.href}><t.icon className="h-5 w-5" /><span className="text-sm">{t(t.label)}</span></Link>
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <FAQSection items={planFAQs} />
      </div>
    </div>
  );
};

export default Plan;
