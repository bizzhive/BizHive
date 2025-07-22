
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, BookOpen } from "lucide-react";

const Community = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 animate-bounce-in">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Community & Learning
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-up">
            Connect with fellow entrepreneurs, find co-founders, and access comprehensive learning resources
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle className="dark:text-white">Discussion Forums</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Connect with entrepreneurs and get expert advice
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <Users className="h-10 w-10 text-green-600 dark:text-green-400 mb-2" />
              <CardTitle className="dark:text-white">Find Co-founders</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Match with potential business partners and team members
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-2" />
              <CardTitle className="dark:text-white">Learning Resources</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Access courses, workshops, and educational content
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;
