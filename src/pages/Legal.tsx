
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, CheckSquare, Scale, Shield, Users, Building, AlertTriangle, BookOpen, ArrowRight } from "lucide-react";

const Legal = () => {
  const legalServices = [
    {
      icon: FileText,
      title: "Legal Documentation",
      description: "Access comprehensive legal guides and regulatory requirements",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      documents: ["Partnership Agreements", "Terms of Service", "Privacy Policies", "Employment Contracts"]
    },
    {
      icon: Download,
      title: "Document Templates",
      description: "Downloadable forms, templates, and legal documents",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20", 
      documents: ["Contract Templates", "Legal Forms", "Compliance Checklists", "Registration Forms"]
    },
    {
      icon: CheckSquare,
      title: "Compliance Monitoring",
      description: "Interactive checklists and compliance monitoring tools",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      documents: ["Regulatory Compliance", "Tax Obligations", "Labor Laws", "Industry Standards"]
    }
  ];

  const legalTopics = [
    { icon: Building, title: "Business Structure", items: ["Sole Proprietorship", "Partnership", "LLC", "Corporation"] },
    { icon: Shield, title: "Intellectual Property", items: ["Trademarks", "Copyrights", "Patents", "Trade Secrets"] },
    { icon: Users, title: "Employment Law", items: ["Hiring Process", "Employee Rights", "Workplace Safety", "Termination"] },
    { icon: Scale, title: "Contract Law", items: ["Contract Types", "Terms & Conditions", "Breach of Contract", "Dispute Resolution"] }
  ];

  const complianceChecklist = [
    { task: "Business Registration", status: "completed", priority: "high" },
    { task: "Tax Registration (GST/PAN)", status: "completed", priority: "high" },
    { task: "Employee Provident Fund", status: "pending", priority: "medium" },
    { task: "Professional Tax Registration", status: "pending", priority: "medium" },
    { task: "Shop & Establishment License", status: "not-started", priority: "low" },
    { task: "Trade License", status: "not-started", priority: "low" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 animate-bounce-in">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Legal Zone
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-up">
            Navigate legal requirements with comprehensive guides, document templates, and compliance tools
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="mr-2 dark:border-gray-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Legal Guidance
            </Badge>
            <Badge variant="outline" className="mr-2 dark:border-gray-600">
              <BookOpen className="h-3 w-3 mr-1" />
              Document Library
            </Badge>
            <Badge variant="outline" className="dark:border-gray-600">
              <Shield className="h-3 w-3 mr-1" />
              Compliance Tools
            </Badge>
          </div>
        </div>

        {/* Main Services */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16 stagger-animation">
          {legalServices.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 relative overflow-hidden">
              <div className={`absolute inset-0 ${service.bgColor} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 ${service.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`h-7 w-7 ${service.color}`} />
                </div>
                <CardTitle className="text-xl dark:text-white">{service.title}</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  {service.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{doc}</span>
                      <Download className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
                <Button className="w-full group/btn" variant="outline">
                  Access Documents
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legal Topics & Compliance */}
        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
            <TabsTrigger value="topics" className="dark:data-[state=active]:bg-gray-700">Legal Topics</TabsTrigger>
            <TabsTrigger value="compliance" className="dark:data-[state=active]:bg-gray-700">Compliance Tracker</TabsTrigger>
          </TabsList>
          
          <TabsContent value="topics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
              {legalTopics.map((topic, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <topic.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg dark:text-white">{topic.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {topic.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <CheckSquare className="h-4 w-4 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Business Compliance Checklist</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Track your legal compliance requirements and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceChecklist.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <CheckSquare className={`h-5 w-5 ${
                          item.status === 'completed' ? 'text-green-500' : 
                          item.status === 'pending' ? 'text-yellow-500' : 'text-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium dark:text-white">{item.task}</p>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(item.status)}`}>
                            {item.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                        {item.priority.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Legal;
