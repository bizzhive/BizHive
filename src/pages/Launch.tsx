
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Monitor, Settings, Megaphone, BarChart } from "lucide-react";

const Launch = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Launch Your Business
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Execute your business plan with operational setup, marketing launch, and performance monitoring
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Operational Setup</CardTitle>
              <CardDescription>
                Set up your business location, hire staff, and establish processes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Megaphone className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Marketing & Sales</CardTitle>
              <CardDescription>
                Launch your marketing campaigns and start building customer relationships
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Performance Monitoring</CardTitle>
              <CardDescription>
                Track KPIs, optimize operations, and plan for growth
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Launch;
