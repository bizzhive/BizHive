
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, CheckSquare } from "lucide-react";

const Legal = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Legal Zone
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate legal requirements with comprehensive guides, document templates, and compliance tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Legal Information</CardTitle>
              <CardDescription>
                Comprehensive legal guides and regulatory requirements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Download className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Document Center</CardTitle>
              <CardDescription>
                Downloadable forms, templates, and legal documents
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CheckSquare className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Compliance Tracker</CardTitle>
              <CardDescription>
                Interactive checklists and compliance monitoring tools
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Legal;
