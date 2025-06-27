
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Complete Guide to Starting a Business in India 2024",
      excerpt: "Everything you need to know about business registration, compliance, and initial setup in India.",
      content: "Learn the step-by-step process of starting your business in India, from choosing the right business structure to obtaining necessary licenses and permits.",
      author: "Priya Sharma",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Business Setup",
      image: "/placeholder.svg",
      featured: true
    },
    {
      id: 2,
      title: "GST Registration: A Complete Walkthrough",
      excerpt: "Master GST registration process with our detailed guide covering all aspects of tax compliance.",
      content: "Understanding GST registration requirements, documents needed, and step-by-step process for different business types.",
      author: "Rajesh Kumar",
      date: "2024-01-12",
      readTime: "6 min read",
      category: "Taxation",
      image: "/placeholder.svg",
      featured: false
    },
    {
      id: 3,
      title: "Top 10 Government Schemes for Startups in 2024",
      excerpt: "Discover the latest government initiatives and funding opportunities for new businesses.",
      content: "Comprehensive overview of startup-friendly schemes including MUDRA loans, Stand-up India, and state-specific programs.",
      author: "Anita Verma",
      date: "2024-01-10",
      readTime: "10 min read",
      category: "Funding",
      image: "/placeholder.svg",
      featured: false
    },
    {
      id: 4,
      title: "Digital Marketing Strategies for Small Businesses",
      excerpt: "Boost your online presence with these proven digital marketing tactics for startups.",
      content: "Learn cost-effective digital marketing strategies including social media marketing, SEO, and content marketing for small businesses.",
      author: "Vikram Singh",
      date: "2024-01-08",
      readTime: "7 min read",
      category: "Marketing",
      image: "/placeholder.svg",
      featured: false
    },
    {
      id: 5,
      title: "Understanding Business Loans and Credit Options",
      excerpt: "Navigate the complex world of business financing with our comprehensive guide to loans and credit.",
      content: "Detailed comparison of different types of business loans, eligibility criteria, and tips for improving loan approval chances.",
      author: "Meera Patel",
      date: "2024-01-05",
      readTime: "9 min read",
      category: "Finance",
      image: "/placeholder.svg",
      featured: false
    },
    {
      id: 6,
      title: "Legal Compliance Checklist for New Businesses",
      excerpt: "Ensure your business stays compliant with this essential legal checklist.",
      content: "Complete checklist covering labor laws, environmental clearances, industry-specific regulations, and ongoing compliance requirements.",
      author: "Suresh Reddy",
      date: "2024-01-03",
      readTime: "5 min read",
      category: "Legal",
      image: "/placeholder.svg",
      featured: false
    }
  ];

  const categories = ["All", "Business Setup", "Taxation", "Funding", "Marketing", "Finance", "Legal"];
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Business Insights & Guides
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto animate-slide-up">
            Expert advice, industry insights, and practical guides to help you succeed in your business journey
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Article</h2>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 dark:bg-gray-800">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <Badge className="mb-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {featuredPost.category}
                  </Badge>
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl md:text-2xl dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {featuredPost.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {featuredPost.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    <Button asChild className="group">
                      <Link to={`/blog/${featuredPost.id}`}>
                        Read Full Article
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <Card 
                key={post.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 dark:bg-gray-800 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300 line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <Button asChild variant="ghost" size="sm" className="group">
                      <Link to={`/blog/${post.id}`}>
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="hover:bg-blue-50 dark:hover:bg-blue-900">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
