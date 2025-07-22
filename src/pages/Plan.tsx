
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Target, TrendingUp, DollarSign, FileCheck, Users, Building, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Plan = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Plan Your Business
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Turn your business idea into a comprehensive plan with our step-by-step guides and interactive tools
          </p>
        </div>

        {/* Main Planning Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <Search className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle className="dark:text-white">Market Research</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Identify your target market, analyze competitors, and understand market demand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
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

          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <FileCheck className="h-10 w-10 text-green-600 dark:text-green-400 mb-2" />
              <CardTitle className="dark:text-white">Business Plan</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Create a comprehensive business plan with our guided templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
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

          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <Target className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-2" />
              <CardTitle className="dark:text-white">Business Registration</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Choose the right business structure and complete registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
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

        {/* Planning Process */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-12 border dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Planning Process</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-sm mb-2 dark:text-white">Research</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">Market & Competition Analysis</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 dark:text-green-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-sm mb-2 dark:text-white">Plan</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">Business Model & Strategy</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-sm mb-2 dark:text-white">Structure</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">Legal Entity Selection</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 dark:text-orange-400 font-bold">4</span>
              </div>
              <h3 className="font-semibold text-sm mb-2 dark:text-white">Register</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">Official Registration</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 dark:text-teal-400 font-bold">5</span>
              </div>
              <h3 className="font-semibold text-sm mb-2 dark:text-white">Prepare</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">Launch Preparation</p>
            </div>
          </div>
        </div>

        {/* Quick Tools Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8 border dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Quick Planning Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 dark:bg-gray-800 dark:text-white dark:border-gray-600">
              <Link to="/plan/tools/business-canvas">
                <Target className="h-6 w-6" />
                <span>Business Canvas</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 dark:bg-gray-800 dark:text-white dark:border-gray-600">
              <Link to="/plan/tools/swot-analysis">
                <TrendingUp className="h-6 w-6" />
                <span>SWOT Analysis</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 dark:bg-gray-800 dark:text-white dark:border-gray-600">
              <Link to="/plan/tools/financial-calculator">
                <DollarSign className="h-6 w-6" />
                <span>Financial Calculator</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 dark:bg-gray-800 dark:text-white dark:border-gray-600">
              <Link to="/plan/tools/checklist">
                <CheckCircle className="h-6 w-6" />
                <span>Planning Checklist</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
