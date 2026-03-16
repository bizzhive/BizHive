import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Complete Guide to Starting a Business in India 2024",
    excerpt: "Everything you need to know about business registration, compliance, and initial setup in India.",
    content: `Starting a business in India involves several key steps that every entrepreneur must follow. This comprehensive guide walks you through the entire process.

**Step 1: Choose Your Business Structure**
The first decision is selecting the right legal structure - Sole Proprietorship, Partnership, LLP, Private Limited Company, or One Person Company. Each has different compliance requirements, liability protection, and tax implications.

**Step 2: Register Your Business Name**
Once you've chosen a structure, register your business name with the appropriate authority. For companies, this is done through the MCA portal.

**Step 3: Obtain Required Licenses**
Depending on your industry, you may need FSSAI license (food), drug license (pharma), MSME registration, or state-specific permits.

**Step 4: Tax Registration**
Register for GST if your turnover exceeds ₹20 lakhs (₹10 lakhs for special category states). Also obtain PAN and TAN for tax compliance.

**Step 5: Open a Business Bank Account**
Separate your personal and business finances by opening a current account in your business name.

**Step 6: Set Up Compliance Systems**
Establish systems for regular GST filing, income tax returns, and any industry-specific compliance requirements.`,
    author: "Priya Sharma",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Business Setup",
  },
  {
    id: 2,
    title: "GST Registration: A Complete Walkthrough",
    excerpt: "Master GST registration process with our detailed guide.",
    content: `GST registration is mandatory for businesses with turnover exceeding the threshold limit. Here's everything you need to know.

**Who Needs GST Registration?**
- Businesses with annual turnover exceeding ₹20 lakhs (₹10 lakhs for special category states)
- Inter-state suppliers regardless of turnover
- E-commerce operators and sellers
- Casual taxable persons

**Documents Required**
- PAN card of the business/proprietor
- Aadhaar card
- Business registration proof
- Bank account details
- Address proof of business premises
- Photographs of promoters

**Registration Process**
1. Visit the GST portal (gst.gov.in)
2. Fill out Part A with PAN, email, and mobile
3. Complete Part B with business details
4. Upload required documents
5. Submit and await verification
6. Receive GSTIN within 3-7 working days`,
    author: "Rajesh Kumar",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "Taxation",
  },
  {
    id: 3,
    title: "Top 10 Government Schemes for Startups in 2024",
    excerpt: "Discover the latest government initiatives and funding opportunities.",
    content: `The Indian government offers numerous schemes to support startups. Here are the top 10 you should know about.

**1. Startup India Scheme**
Tax exemptions, self-certification, and easy winding up for DPIIT-recognized startups.

**2. MUDRA Loans**
Loans up to ₹10 lakhs under Shishu, Kishore, and Tarun categories without collateral.

**3. Stand-Up India**
Loans from ₹10 lakhs to ₹1 crore for SC/ST and women entrepreneurs.

**4. PMEGP**
Subsidy up to 35% for manufacturing units and 25% for service enterprises.

**5. SIDBI Fund of Funds**
₹10,000 crore fund to support startups through SEBI-registered AIFs.

**6. Atal Innovation Mission**
Incubation support and mentorship through Atal Incubation Centres.

**7. MSME Samadhaan**
Portal for delayed payment monitoring for MSMEs.

**8. Digital India**
Support for IT and technology startups with digital infrastructure.

**9. Make in India**
Incentives for manufacturing startups in key sectors.

**10. Credit Guarantee Fund (CGTMSE)**
Collateral-free loans up to ₹2 crore for micro and small enterprises.`,
    author: "Anita Verma",
    date: "2024-01-10",
    readTime: "10 min read",
    category: "Funding",
  },
  {
    id: 4,
    title: "Digital Marketing Strategies for Small Businesses",
    excerpt: "Boost your online presence with proven digital marketing tactics.",
    content: `Digital marketing is essential for small businesses in today's competitive landscape. Here are cost-effective strategies that work.

**Social Media Marketing**
Focus on 2-3 platforms where your audience is most active. Create consistent, valuable content and engage with your community.

**Search Engine Optimization (SEO)**
Optimize your website for local search terms. Claim your Google Business Profile and encourage customer reviews.

**Content Marketing**
Start a blog, create how-to videos, or share industry insights. Quality content builds trust and attracts organic traffic.

**Email Marketing**
Build an email list and send regular newsletters with valuable content, offers, and updates.

**Paid Advertising**
Start with small budgets on Google Ads or Facebook Ads. Target specific demographics and track ROI carefully.`,
    author: "Vikram Singh",
    date: "2024-01-08",
    readTime: "7 min read",
    category: "Marketing",
  },
  {
    id: 5,
    title: "Understanding Business Loans and Credit Options",
    excerpt: "Navigate business financing with our comprehensive guide.",
    content: `Access to capital is crucial for business growth. Here's a breakdown of financing options available in India.

**Term Loans**
Traditional bank loans with fixed repayment schedules. Best for large capital expenditures.

**Working Capital Loans**
Short-term financing to manage day-to-day operations and cash flow gaps.

**MUDRA Loans**
Government-backed loans up to ₹10 lakhs without collateral for micro enterprises.

**Venture Capital**
Equity funding from VC firms for high-growth startups with scalable business models.

**Angel Investment**
Early-stage funding from individual investors, typically ₹25 lakhs to ₹5 crores.

**Tips for Loan Approval**
- Maintain a good credit score (750+)
- Prepare a solid business plan
- Show consistent revenue or strong projections
- Keep financial records organized
- Offer collateral when possible`,
    author: "Meera Patel",
    date: "2024-01-05",
    readTime: "9 min read",
    category: "Finance",
  },
  {
    id: 6,
    title: "Legal Compliance Checklist for New Businesses",
    excerpt: "Ensure your business stays compliant with this essential checklist.",
    content: `Legal compliance is non-negotiable for any business. This checklist covers the key requirements.

**Business Registration**
- Register with appropriate authority (ROC, MSME, etc.)
- Obtain PAN and TAN
- Register for GST if applicable

**Labor Laws**
- Register under Shop & Establishment Act
- Comply with PF and ESI requirements
- Maintain proper employment contracts

**Industry-Specific**
- FSSAI for food businesses
- Drug license for pharma
- Environmental clearances where applicable

**Ongoing Compliance**
- File annual returns (ROC, Income Tax, GST)
- Conduct annual general meetings (companies)
- Maintain statutory registers and books
- Renew licenses and registrations on time`,
    author: "Suresh Reddy",
    date: "2024-01-03",
    readTime: "5 min read",
    category: "Legal",
  },
];

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Article Not Found</h1>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <Badge className="mb-4">{post.category}</Badge>
        <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>

        <div className="flex items-center text-sm text-muted-foreground mb-8 space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {post.author}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(post.date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readTime}
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          {post.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return (
                <h3 key={i} className="text-xl font-semibold text-foreground mt-6 mb-3">
                  {paragraph.replace(/\*\*/g, "")}
                </h3>
              );
            }
            if (paragraph.startsWith("**")) {
              const parts = paragraph.split("**");
              return (
                <div key={i} className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{parts[1]}</h3>
                  <p className="text-muted-foreground">{parts[2]}</p>
                </div>
              );
            }
            if (paragraph.startsWith("- ")) {
              return (
                <ul key={i} className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
                  {paragraph.split("\n").map((item, j) => (
                    <li key={j}>{item.replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-muted-foreground mb-4 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
