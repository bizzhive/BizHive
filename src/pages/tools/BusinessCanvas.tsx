
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BusinessCanvas = () => {
  const [canvasData, setCanvasData] = useState({
    keyPartners: "",
    keyActivities: "",
    keyResources: "",
    valuePropositions: "",
    customerRelationships: "",
    channels: "",
    customerSegments: "",
    costStructure: "",
    revenueStreams: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('businessCanvas', JSON.stringify(canvasData));
    alert('Business Canvas saved locally!');
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(canvasData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'business-canvas.json';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Model Canvas</h1>
          <p className="text-gray-600 mb-6">
            Create a visual representation of your business model using the proven Business Model Canvas framework.
          </p>
          <div className="flex space-x-4 mb-8">
            <Button onClick={handleSave} className="flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Key Partners */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Key Partners</CardTitle>
              <CardDescription className="text-sm">Who are your key partners and suppliers?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List your key partners, suppliers, and strategic alliances..."
                value={canvasData.keyPartners}
                onChange={(e) => handleInputChange('keyPartners', e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>

          {/* Key Activities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Key Activities</CardTitle>
              <CardDescription className="text-sm">What key activities does your value proposition require?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe your most important activities..."
                value={canvasData.keyActivities}
                onChange={(e) => handleInputChange('keyActivities', e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>

          {/* Value Propositions */}
          <Card className="lg:row-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Value Propositions</CardTitle>
              <CardDescription className="text-sm">What value do you deliver to your customers?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe the unique value you provide to customers..."
                value={canvasData.valuePropositions}
                onChange={(e) => handleInputChange('valuePropositions', e.target.value)}
                className="min-h-48"
              />
            </CardContent>
          </Card>

          {/* Customer Relationships */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Customer Relationships</CardTitle>
              <CardDescription className="text-sm">What type of relationship do you establish with customers?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe your customer relationship strategy..."
                value={canvasData.customerRelationships}
                onChange={(e) => handleInputChange('customerRelationships', e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>

          {/* Customer Segments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Customer Segments</CardTitle>
              <CardDescription className="text-sm">Who are you creating value for?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Define your target customer segments..."
                value={canvasData.customerSegments}
                onChange={(e) => handleInputChange('customerSegments', e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>

          {/* Key Resources */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Key Resources</CardTitle>
              <CardDescription className="text-sm">What key resources does your value proposition require?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List your most important assets..."
                value={canvasData.keyResources}
                onChange={(e) => handleInputChange('keyResources', e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>

          {/* Channels */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Channels</CardTitle>
              <CardDescription className="text-sm">Through which channels do you reach your customers?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe your distribution and communication channels..."
                value={canvasData.channels}
                onChange={(e) => handleInputChange('channels', e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>

          {/* Cost Structure */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Cost Structure</CardTitle>
              <CardDescription className="text-sm">What are the most important costs in your business model?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List your major cost drivers..."
                value={canvasData.costStructure}
                onChange={(e) => handleInputChange('costStructure', e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>

          {/* Revenue Streams */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Revenue Streams</CardTitle>
              <CardDescription className="text-sm">What value are customers really willing to pay for?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe how you generate revenue..."
                value={canvasData.revenueStreams}
                onChange={(e) => handleInputChange('revenueStreams', e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessCanvas;
