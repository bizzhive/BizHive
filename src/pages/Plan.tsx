
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Target, TrendingUp, DollarSign, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Plan = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plan Your Business
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Turn your business idea into a comprehensive plan with our step-by-step guides and interactive tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Search className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Market Research</CardTitle>
              <CardDescription>
                Identify your target market, analyze competitors, and understand market demand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2 mb-4">
                <li>• Target market identification</li>
                <li>• Competitor analysis tools</li>
                <li>• Market demand assessment</li>
                <li>• Economic viability check</li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/plan/market-research">Start Research</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileCheck className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Business Plan</CardTitle>
              <CardDescription>
                Create a comprehensive business plan with our guided templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2 mb-4">
                <li>• Business goals definition</li>
                <li>• Financial projections</li>
                <li>• Marketing strategies</li>
                <li>• Operational planning</li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/plan/business-plan">Create Plan</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Business Registration</CardTitle>
              <CardDescription>
                Choose the right business structure and complete registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2 mb-4">
                <li>• Business structure selection</li>
                <li>• Name registration</li>
                <li>• Digital signature setup</li>
                <li>• Incorporation filing</li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/plan/registration">Register Business</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Planning Steps */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Planning Process</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-sm mb-2">Research</h3>
              <p className="text-xs text-gray-600">Market & Competition Analysis</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-sm mb-2">Plan</h3>
              <p className="text-xs text-gray-600">Business Model & Strategy</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-sm mb-2">Structure</h3>
              <p className="text-xs text-gray-600">Legal Entity Selection</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold text-sm mb-2">Register</h3>
              <p className="text-xs text-gray-600">Official Registration</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 font-bold">5</span>
              </div>
              <h3 className="font-semibold text-sm mb-2">Prepare</h3>
              <p className="text-xs text-gray-600">Launch Preparation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
