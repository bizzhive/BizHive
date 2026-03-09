import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Activity, FileText, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your business overview.</p>
        </div>
        <Button onClick={() => navigate("/plan")} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Business Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              Idea Phase
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Saved Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FileText className="mr-2 h-5 w-5 text-green-500" />
              0
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              20%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Market Research", path: "/plan/market-research", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
          { title: "Business Canvas", path: "/tools/business-canvas", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
          { title: "Financial Calc", path: "/tools/financial-calculator", color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
          { title: "AI Assistant", path: "/ai-assistant", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" }
        ].map((action, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700" onClick={() => navigate(action.path)}>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-4 ${action.color}`}>
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h3>
              <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                Start <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;