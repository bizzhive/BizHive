
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign } from "lucide-react";

const Manage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Manage & Scale Your Business
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Grow your business with advanced management strategies and scaling techniques
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Scale Operations</CardTitle>
              <CardDescription>
                Expand your team, enhance efficiency, and diversify offerings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                Build loyalty programs and enhance customer engagement
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <DollarSign className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Financial Management</CardTitle>
              <CardDescription>
                Monitor performance, optimize costs, and plan for sustainability
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Manage;
