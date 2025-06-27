
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText, Building, Users, TrendingUp, Scale } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Complete Entrepreneurship Journey Starts Here
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Navigate every stage of your business journey in India - from planning and legal compliance to funding and growth. 
            Access comprehensive guides, tools, and resources designed specifically for Indian entrepreneurs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link to="/plan">Start Planning <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link to="/legal">Legal Guide</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Everything You Need to Build Your Business
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Plan Your Business</CardTitle>
              <CardDescription>
                Market research tools, business plan templates, and strategic planning guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0">
                <Link to="/plan" className="text-blue-600 hover:text-blue-800">
                  Explore Planning Tools <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Launch Your Business</CardTitle>
              <CardDescription>
                Step-by-step launch guides, operational setup, and marketing strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0">
                <Link to="/launch" className="text-green-600 hover:text-green-800">
                  Launch Guide <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Scale className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Manage & Scale</CardTitle>
              <CardDescription>
                Growth strategies, team management, and business optimization tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0">
                <Link to="/manage" className="text-purple-600 hover:text-purple-800">
                  Management Tools <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Legal Zone</CardTitle>
              <CardDescription>
                Legal compliance, document templates, and regulatory guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0">
                <Link to="/legal" className="text-red-600 hover:text-red-800">
                  Legal Resources <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Building className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Incubators & Funding</CardTitle>
              <CardDescription>
                Government schemes, incubator directory, and investor connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0">
                <Link to="/incubators" className="text-orange-600 hover:text-orange-800">
                  Find Funding <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-10 w-10 text-teal-600 mb-2" />
              <CardTitle>Community & Learning</CardTitle>
              <CardDescription>
                Connect with entrepreneurs, find co-founders, and access learning resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="p-0">
                <Link to="/community" className="text-teal-600 hover:text-teal-800">
                  Join Community <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Legal Documents</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-gray-600">Government Schemes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600">Incubators Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Interactive Tools</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
