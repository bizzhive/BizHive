
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Save, ArrowLeft, TrendingUp, AlertTriangle, Target, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const SwotAnalysis = () => {
  const [swotData, setSwotData] = useState({
    strengths: "",
    weaknesses: "",
    opportunities: "",
    threats: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setSwotData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('swotAnalysis', JSON.stringify(swotData));
    alert('SWOT Analysis saved locally!');
  };

  const handleDownload = () => {
    const content = `SWOT Analysis Report
Generated on: ${new Date().toLocaleDateString()}

STRENGTHS:
${swotData.strengths}

WEAKNESSES:
${swotData.weaknesses}

OPPORTUNITIES:
${swotData.opportunities}

THREATS:
${swotData.threats}`;

    const dataBlob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'swot-analysis.txt';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/tools" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">SWOT Analysis Tool</h1>
          <p className="text-gray-600 mb-6">
            Analyze your business's Strengths, Weaknesses, Opportunities, and Threats to make informed strategic decisions.
          </p>
          <div className="flex space-x-4 mb-8">
            <Button onClick={handleSave} className="flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Save Analysis
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-green-700">Strengths</CardTitle>
                  <CardDescription className="text-sm">Internal factors that give you an advantage</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What does your business do well? What unique resources do you have? What do others see as your strengths?"
                value={swotData.strengths}
                onChange={(e) => handleInputChange('strengths', e.target.value)}
                className="min-h-48"
              />
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium mb-2">Consider:</p>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• Unique selling propositions</li>
                  <li>• Strong brand reputation</li>
                  <li>• Skilled team members</li>
                  <li>• Financial resources</li>
                  <li>• Technology advantages</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Weaknesses */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-red-700">Weaknesses</CardTitle>
                  <CardDescription className="text-sm">Internal factors that put you at a disadvantage</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What could you improve? What resources are you lacking? What do others see as your weaknesses?"
                value={swotData.weaknesses}
                onChange={(e) => handleInputChange('weaknesses', e.target.value)}
                className="min-h-48"
              />
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700 font-medium mb-2">Consider:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  <li>• Limited resources or capabilities</li>
                  <li>• Poor location or facilities</li>
                  <li>• Lack of expertise in certain areas</li>
                  <li>• Weak brand recognition</li>
                  <li>• High operational costs</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-700">Opportunities</CardTitle>
                  <CardDescription className="text-sm">External factors that could provide advantages</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What trends could you take advantage of? How can you turn your strengths into opportunities?"
                value={swotData.opportunities}
                onChange={(e) => handleInputChange('opportunities', e.target.value)}
                className="min-h-48"
              />
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-medium mb-2">Consider:</p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Market growth trends</li>
                  <li>• Emerging technologies</li>
                  <li>• Changes in customer behavior</li>
                  <li>• New market segments</li>
                  <li>• Partnership opportunities</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Threats */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-orange-700">Threats</CardTitle>
                  <CardDescription className="text-sm">External factors that could cause trouble</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What obstacles do you face? What is your competition doing? What threats do your weaknesses expose you to?"
                value={swotData.threats}
                onChange={(e) => handleInputChange('threats', e.target.value)}
                className="min-h-48"
              />
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-700 font-medium mb-2">Consider:</p>
                <ul className="text-xs text-orange-600 space-y-1">
                  <li>• Strong competition</li>
                  <li>• Economic downturns</li>
                  <li>• Regulatory changes</li>
                  <li>• Changing customer preferences</li>
                  <li>• Supply chain disruptions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Strategic Action Items</CardTitle>
            <CardDescription>Based on your SWOT analysis, consider these strategic approaches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Strengths + Opportunities (SO)</h4>
                <p className="text-sm text-green-600">Use your strengths to take advantage of opportunities</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">Weaknesses + Opportunities (WO)</h4>
                <p className="text-sm text-blue-600">Overcome weaknesses by taking advantage of opportunities</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2">Strengths + Threats (ST)</h4>
                <p className="text-sm text-orange-600">Use your strengths to avoid threats</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-700 mb-2">Weaknesses + Threats (WT)</h4>
                <p className="text-sm text-red-600">Minimize weaknesses and avoid threats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SwotAnalysis;
