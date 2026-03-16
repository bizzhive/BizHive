import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, BookOpen, ExternalLink, Lightbulb, GraduationCap, Handshake, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Community = () => {
  const forumTopics = [
    { title: "How to choose the right business structure?", replies: 24, category: "Business Setup", hot: true },
    { title: "Best accounting software for small businesses", replies: 18, category: "Tools", hot: false },
    { title: "GST filing tips for first-time filers", replies: 31, category: "Taxation", hot: true },
    { title: "Marketing on a shoestring budget", replies: 15, category: "Marketing", hot: false },
    { title: "Finding angel investors in India", replies: 22, category: "Funding", hot: true },
  ];

  const learningResources = [
    { title: "Business Planning 101", platform: "YouTube", duration: "45 min", url: "https://youtube.com", level: "Beginner", icon: "🎥" },
    { title: "Financial Management for Startups", platform: "NPTEL", duration: "12 weeks", url: "https://nptel.ac.in", level: "Intermediate", icon: "📚" },
    { title: "Digital Marketing Masterclass", platform: "YouTube", duration: "2 hours", url: "https://youtube.com", level: "Beginner", icon: "🎥" },
    { title: "Indian Tax System Overview", platform: "SWAYAM", duration: "8 weeks", url: "https://swayam.gov.in", level: "Beginner", icon: "📖" },
    { title: "Startup Legal Essentials", platform: "YouTube", duration: "1 hour", url: "https://youtube.com", level: "Beginner", icon: "🎥" },
    { title: "Advanced Business Strategy", platform: "NPTEL", duration: "8 weeks", url: "https://nptel.ac.in", level: "Advanced", icon: "📚" },
  ];

  const cofounderProfiles = [
    { role: "Technical Co-founder", skills: ["Full Stack Dev", "AI/ML", "Cloud"], industry: "SaaS", location: "Bangalore" },
    { role: "Marketing Co-founder", skills: ["Growth Hacking", "SEO", "Content"], industry: "D2C", location: "Mumbai" },
    { role: "Operations Co-founder", skills: ["Supply Chain", "Logistics", "Finance"], industry: "E-commerce", location: "Delhi" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">Community & Learning</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow entrepreneurs, find co-founders, and access comprehensive learning resources
          </p>
        </div>

        {/* Discussion Forums */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" /> Discussion Forums
            </h2>
          </div>
          <div className="space-y-3">
            {forumTopics.map((topic, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-foreground">{topic.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{topic.category}</Badge>
                        {topic.hot && <Badge className="text-xs bg-orange-500">🔥 Hot</Badge>}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{topic.replies} replies</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Full forum features coming soon! Join the conversation and share your entrepreneurial journey.
          </p>
        </section>

        {/* Find Co-founders */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Handshake className="h-6 w-6 text-primary" /> Find Co-founders
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {cofounderProfiles.map((profile, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{profile.role}</CardTitle>
                  <CardDescription>Looking in {profile.industry} · {profile.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    Connect (Coming Soon)
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Learning Resources */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" /> Free Learning Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningResources.map((resource, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{resource.icon}</span>
                    <Badge variant="outline">{resource.level}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                  <CardDescription>{resource.platform} · {resource.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      Start Learning <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Want Personalized Guidance?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our AI assistant can help you with specific business questions and provide tailored advice.
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link to="/ai-assistant">
              Talk to AI Assistant <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Community;
