import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  { id: 1, title: "Complete Guide to Starting a Business in India 2024", excerpt: "Everything you need to know about business registration, compliance, and initial setup in India.", author: "Priya Sharma", date: "2024-01-15", readTime: "8 min", category: "Business Setup", featured: true },
  { id: 2, title: "GST Registration: A Complete Walkthrough", excerpt: "Master GST registration process with our detailed guide covering all aspects of tax compliance.", author: "Rajesh Kumar", date: "2024-01-12", readTime: "6 min", category: "Taxation" },
  { id: 3, title: "Top 10 Government Schemes for Startups in 2024", excerpt: "Discover the latest government initiatives and funding opportunities for new businesses.", author: "Anita Verma", date: "2024-01-10", readTime: "10 min", category: "Funding" },
  { id: 4, title: "Digital Marketing Strategies for Small Businesses", excerpt: "Boost your online presence with these proven digital marketing tactics for startups.", author: "Vikram Singh", date: "2024-01-08", readTime: "7 min", category: "Marketing" },
  { id: 5, title: "Understanding Business Loans and Credit Options", excerpt: "Navigate the complex world of business financing with our comprehensive guide.", author: "Meera Patel", date: "2024-01-05", readTime: "9 min", category: "Finance" },
  { id: 6, title: "Legal Compliance Checklist for New Businesses", excerpt: "Ensure your business stays compliant with this essential legal checklist.", author: "Suresh Reddy", date: "2024-01-03", readTime: "5 min", category: "Legal" },
  { id: 7, title: "How to Write a Pitch Deck That Wins Investors", excerpt: "Learn the art of crafting compelling pitch decks that attract funding from VCs and angels.", author: "Kavita Nair", date: "2024-02-01", readTime: "8 min", category: "Funding" },
  { id: 8, title: "Sole Proprietorship vs Pvt Ltd: Which to Choose?", excerpt: "Compare business structures in India — costs, liability, taxation, and compliance differences.", author: "Amit Joshi", date: "2024-02-05", readTime: "7 min", category: "Business Setup" },
  { id: 9, title: "Instagram Marketing for D2C Brands in India", excerpt: "Step-by-step guide to building a D2C brand on Instagram with organic and paid strategies.", author: "Sneha Gupta", date: "2024-02-10", readTime: "6 min", category: "Marketing" },
  { id: 10, title: "Understanding TDS: A Freelancer's Guide", excerpt: "Everything freelancers and consultants need to know about TDS deduction and filing.", author: "Rajesh Kumar", date: "2024-02-15", readTime: "5 min", category: "Taxation" },
  { id: 11, title: "Top Incubators in India: How to Get In", excerpt: "A curated list of the best startup incubators and accelerators with application tips.", author: "Priya Sharma", date: "2024-02-20", readTime: "9 min", category: "Funding" },
  { id: 12, title: "Cash Flow Management for Early-Stage Startups", excerpt: "Master the art of cash flow management to ensure your startup survives and thrives.", author: "Meera Patel", date: "2024-03-01", readTime: "7 min", category: "Finance" },
  { id: 13, title: "Building a Remote Team: Legal & Practical Guide", excerpt: "Navigate hiring, contracts, and compliance when building a distributed team in India.", author: "Suresh Reddy", date: "2024-03-05", readTime: "8 min", category: "Legal" },
  { id: 14, title: "SEO Basics for Startup Websites", excerpt: "Learn foundational SEO techniques to drive organic traffic to your startup website.", author: "Vikram Singh", date: "2024-03-10", readTime: "6 min", category: "Marketing" },
  { id: 15, title: "Startup India Registration: Benefits & Process", excerpt: "How to register under Startup India and avail tax benefits, funding, and mentorship.", author: "Anita Verma", date: "2024-03-15", readTime: "7 min", category: "Business Setup" },
];

const categories = ["All", "Business Setup", "Taxation", "Funding", "Marketing", "Finance", "Legal"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? blogPosts : blogPosts.filter((p) => p.category === activeCategory);
  const featuredPost = filtered.find((p) => p.featured) || (activeCategory === "All" ? blogPosts[0] : null);
  const regularPosts = filtered.filter((p) => p !== featuredPost);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Business Insights & Guides</h1>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">Expert advice, industry insights, and practical guides to help you succeed</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {featuredPost && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured Article</h2>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center p-12">
                  <span className="text-6xl">📋</span>
                </div>
                <div className="md:w-1/2 p-6">
                  <Badge className="mb-3">{featuredPost.category}</Badge>
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl md:text-2xl">{featuredPost.title}</CardTitle>
                    <CardDescription>{featuredPost.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4">
                      <div className="flex items-center"><User className="h-4 w-4 mr-1" />{featuredPost.author}</div>
                      <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{new Date(featuredPost.date).toLocaleDateString()}</div>
                      <div className="flex items-center"><Clock className="h-4 w-4 mr-1" />{featuredPost.readTime}</div>
                    </div>
                    <Button asChild><Link to={`/blog/${featuredPost.id}`}>Read Full Article <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          </section>
        )}

        <section className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((c) => (
              <Button key={c} variant={activeCategory === c ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(c)}>{c}</Button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {activeCategory === "All" ? "Latest Articles" : `${activeCategory} Articles`}
          </h2>
          {regularPosts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No articles in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 h-44 flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                    <Badge className="absolute top-3 left-3">{post.category}</Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="w-full">
                      <Link to={`/blog/${post.id}`}>Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Blog;