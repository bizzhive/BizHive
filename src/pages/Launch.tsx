
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Building, 
  FileText, 
  Users, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  Clock,
  DollarSign,
  Target,
  Settings,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const Launch = () => {
  const launchPhases = [
    {
      phase: "Pre-Launch",
      title: "Foundation Setup",
      description: "Complete legal formalities and operational setup",
      icon: Building,
      color: "blue",
      tasks: [
        "Business registration & incorporation",
        "Tax registrations (GST, PAN, etc.)",
        "Banking setup & accounts",
        "Insurance & legal compliance",
        "Workspace setup",
        "Technology infrastructure"
      ],
      timeframe: "4-8 weeks"
    },
    {
      phase: "Soft Launch",
      title: "Market Testing",
      description: "Test your product/service with limited audience",
      icon: Target,
      color: "green",
      tasks: [
        "Beta testing with select customers",
        "Feedback collection & analysis",
        "Product/service refinement",
        "Initial marketing campaigns",
        "Team hiring & training",
        "Operational process optimization"
      ],
      timeframe: "2-4 weeks"
    },
    {
      phase: "Official Launch",
      title: "Go-to-Market",
      description: "Full-scale market entry and promotion",
      icon: Rocket,
      color: "purple",
      tasks: [
        "Marketing campaign execution",
        "PR & media outreach",
        "Customer acquisition activities",
        "Sales process implementation",
        "Customer support setup",
        "Performance monitoring"
      ],
      timeframe: "2-3 weeks"
    },
    {
      phase: "Post-Launch",
      title: "Growth & Optimization",
      description: "Scale operations and optimize performance",
      icon: TrendingUp,
      color: "orange",
      tasks: [
        "Performance analysis & reporting",
        "Customer feedback implementation",
        "Process improvements",
        "Team expansion",
        "Market expansion planning",
        "Investor relations"
      ],
      timeframe: "Ongoing"
    }
  ];

  const essentialTools = [
    {
      category: "Legal & Compliance",
      tools: [
        { name: "MCA Portal", description: "Company registration & compliance", url: "https://mca.gov.in" },
        { name: "GST Portal", description: "GST registration & filing", url: "https://gst.gov.in" },
        { name: "EPFO Portal", description: "Employee provident fund", url: "https://epfo.gov.in" },
        { name: "Labour Dept", description: "Labour law compliance", url: "#" }
      ]
    },
    {
      category: "Banking & Finance",
      tools: [
        { name: "Current Account", description: "Business banking setup", url: "#" },
        { name: "Payment Gateway", description: "Online payment processing", url: "#" },
        { name: "Accounting Software", description: "Financial management", url: "#" },
        { name: "Invoice Generator", description: "Professional invoicing", url: "#" }
      ]
    },
    {
      category: "Marketing & Sales",
      tools: [
        { name: "Website Builder", description: "Professional website creation", url: "#" },
        { name: "Social Media", description: "Brand presence setup", url: "#" },
        { name: "Email Marketing", description: "Customer communication", url: "#" },
        { name: "CRM System", description: "Customer relationship management", url: "#" }
      ]
    }
  ];

  const launchChecklist = [
    "Business plan finalized and approved",
    "Legal structure established",
    "All licenses and permits obtained",
    "Tax registrations completed",
    "Business bank account opened",
    "Insurance policies in place",
    "Workspace/office setup completed",
    "Technology infrastructure ready",
    "Product/service development finished",
    "Quality testing completed",
    "Pricing strategy finalized",
    "Marketing materials prepared",
    "Website and online presence ready",
    "Team hired and trained",
    "Customer support system in place",
    "Launch marketing campaign planned",
    "Financial projections validated",
    "Risk management plan in place"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Launch Your Business
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Step-by-step guidance to successfully launch your business and enter the market with confidence
          </p>
        </div>

        {/* Launch Phases */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Launch Phases</h2>
          <div className="space-y-8">
            {launchPhases.map((phase, index) => {
              const Icon = phase.icon;
              const colors = {
                blue: "bg-blue-500 text-blue-50",
                green: "bg-green-500 text-green-50",
                purple: "bg-purple-500 text-purple-50",
                orange: "bg-orange-500 text-orange-50"
              };
              
              return (
                <Card key={index} className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${colors[phase.color as keyof typeof colors]}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">{phase.phase}</Badge>
                            <Badge variant="secondary" className="flex items-center dark:bg-gray-600 dark:text-gray-200">
                              <Clock className="h-3 w-3 mr-1" />
                              {phase.timeframe}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl dark:text-white">{phase.title}</CardTitle>
                          <CardDescription className="dark:text-gray-300">{phase.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {phase.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                          <span className="text-sm dark:text-gray-300">{task}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Essential Tools */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Essential Launch Tools</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {essentialTools.map((category, index) => (
              <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.tools.map((tool, toolIndex) => (
                      <div key={toolIndex} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <h4 className="font-medium text-sm dark:text-white">{tool.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{tool.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Launch Checklist */}
        <div className="mb-16">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-white">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                Pre-Launch Checklist
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                Ensure you've completed all essential tasks before launching your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {launchChecklist.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Launch Resources */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-l-4 border-l-blue-500 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg dark:text-white">Document Templates</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Download ready-to-use templates for your launch
              </p>
              <Button asChild className="w-full">
                <Link to="/documents">
                  Access Templates
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-lg dark:text-white">Legal Compliance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Ensure your business meets all legal requirements
              </p>
              <Button asChild className="w-full">
                <Link to="/legal">
                  Check Compliance
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <CardTitle className="text-lg dark:text-white">Funding Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Explore funding options and investor connections
              </p>
              <Button asChild className="w-full">
                <Link to="/incubators">
                  Find Funding
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Launch?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get personalized launch guidance and support from our experts to ensure your business launch is successful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Schedule Launch Consultation
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              Download Launch Guide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Launch;
