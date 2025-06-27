
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, DollarSign, FileText } from "lucide-react";

const Incubators = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Incubators & Funding
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with government incubators, explore funding opportunities, and prepare for investor meetings
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Building className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Incubator Directory</CardTitle>
              <CardDescription>
                Find government-backed incubators and accelerators
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <DollarSign className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Funding Opportunities</CardTitle>
              <CardDescription>
                Explore government schemes and investor networks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Pitch Preparation</CardTitle>
              <CardDescription>
                Tools and guides for investor presentations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Incubators;
