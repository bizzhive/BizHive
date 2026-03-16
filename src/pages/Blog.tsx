import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  { id: 1, title: "Complete Guide to Starting a Business in India 2024", excerpt: "Everything you need to know about business registration, compliance, and initial setup in India.", author: "Priya Sharma", date: "2024-01-15", readTime: "8 min read", category: "Business Setup", featured: true },
  { id: 2, title: "GST Registration: A Complete Walkthrough", excerpt: "Master GST registration process with our detailed guide covering all aspects of tax compliance.", author: "Rajesh Kumar", date: "2024-01-12", readTime: "6 min read", category: "Taxation", featured: false },
  { id: 3, title: "Top 10 Government Schemes for Startups in 2024", excerpt: "Discover the latest government initiatives and funding opportunities for new businesses.", author: "Anita Verma", date: "2024-01-10", readTime: "10 min read", category: "Funding", featured: false },
  { id: 4, title: "Digital Marketing Strategies for Small Businesses", excerpt: "Boost your online presence with these proven digital marketing tactics for startups.", author: "Vikram Singh", date: "2024-01-08", readTime: "7 min read", category: "Marketing", featured: false },
  { id: 5, title: "Understanding Business Loans and Credit Options", excerpt: "Navigate the complex world of business financing with our comprehensive guide to loans and credit.", author: "Meera Patel", date: "2024-01-05", readTime: "9 min read", category: "Finance", featured: false },
  { id: 6, title: "Legal Compliance Checklist for New Businesses", excerpt: "Ensure your business stays compliant with this essential legal checklist.", author: "Suresh Reddy", date: "2024-01-03", readTime: "5 min read", category: "Legal", featured: false },
];

const categories = ["All", "Business Setup", "Taxation", "Funding", "Marketing", "Finance", "Legal"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  const featuredPost = filtered.find((p) => p.featured) || (activeCategory === "All" ? blogPosts[0] : null);
  const regularPosts = filtered.filter((p) => p !== featuredPost);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Business Insights & Guides</h1>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Expert advice, industry insights, and practical guides to help you succeed
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {featuredPost && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured Article</h2>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center p-12">
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
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
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
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 h-48 flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                    <Badge className="absolute top-3 left-3">{post.category}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center"><User className="h-4 w-4 mr-1" />{post.author}</div>
                      <div className="flex items-center"><Clock className="h-4 w-4 mr-1" />{post.readTime}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{new Date(post.date).toLocaleDateString()}</span>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/blog/${post.id}`}>Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                      </Button>
                    </div>
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
