
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Save, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSavedTool } from "@/hooks/use-saved-tool";
import { AIAssistButton } from "@/components/AIAssistButton";

const defaultCanvas = {
  keyPartners: "",
  keyActivities: "",
  keyResources: "",
  valuePropositions: "",
  customerRelationships: "",
  channels: "",
  customerSegments: "",
  costStructure: "",
  revenueStreams: ""
};

const BusinessCanvas = () => {
  const { data: savedData, isLoading, save, isSaving } = useSavedTool('business_canvas', defaultCanvas);
  const [canvasData, setCanvasData] = useState(defaultCanvas);

  useEffect(() => {
    if (savedData) {
      setCanvasData(savedData);
    }
  }, [savedData]);

  const handleInputChange = (field: string, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAISuggestion = (field: string, suggestion: string) => {
    setCanvasData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev] 
        ? `${prev[field as keyof typeof prev]}\n\n${suggestion}`
        : suggestion
    }));
  };

  const handleSave = () => {
    save(canvasData);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/tools" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Model Canvas</h1>
              <p className="text-gray-600">
                Create a visual representation of your business model. Uses AI to suggest based on your profile.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleSave} disabled={isSaving} className="flex items-center">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isSaving ? 'Saving...' : 'Save to Cloud'}
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Key Partners */}
          <Card>
            <CardHeader className="pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Key Partners</CardTitle>
                <AIAssistButton field="Key Partners" onSuggestion={(s) => handleAISuggestion('keyPartners', s)} />
              </div>
              <CardDescription className="text-sm">Who are your key partners and suppliers?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List your key partners, suppliers..."
                value={canvasData.keyPartners}
                onChange={(e) => handleInputChange('keyPartners', e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Key Activities */}
          <Card>
            <CardHeader className="pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Key Activities</CardTitle>
                <AIAssistButton field="Key Activities" onSuggestion={(s) => handleAISuggestion('keyActivities', s)} />
              </div>
              <CardDescription className="text-sm">What activities does your value proposition require?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe your most important activities..."
                value={canvasData.keyActivities}
                onChange={(e) => handleInputChange('keyActivities', e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Value Propositions */}
          <Card className="lg:row-span-2">
            <CardHeader className="pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Value Propositions</CardTitle>
                <AIAssistButton field="Value Propositions" onSuggestion={(s) => handleAISuggestion('valuePropositions', s)} />
              </div>
              <CardDescription className="text-sm">What value do you deliver to your customers?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe the unique value you provide..."
                value={canvasData.valuePropositions}
                onChange={(e) => handleInputChange('valuePropositions', e.target.value)}
                className="min-h-[250px]"
              />
            </CardContent>
          </Card>

          {/* Customer Relationships */}
          <Card>
            <CardHeader className="pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Customer Relationships</CardTitle>
                <AIAssistButton field="Customer Relationships" onSuggestion={(s) => handleAISuggestion('customerRelationships', s)} />
              </div>
              <CardDescription className="text-sm">What relationships do you establish?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe your customer relationship strategy..."
                value={canvasData.customerRelationships}
                onChange={(e) => handleInputChange('customerRelationships', e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Customer Segments */}
          <Card>
            <CardHeader className="pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Customer Segments</CardTitle>
                <AIAssistButton field="Customer Segments" onSuggestion={(s) => handleAISuggestion('customerSegments', s)} />
              </div>
              <CardDescription className="text-sm">Who are you creating value for?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Define your target customer segments..."
                value={canvasData.customerSegments}
                onChange={(e) => handleInputChange('customerSegments', e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Key Resources */}
          <Card>
            <CardHeader className="pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Key Resources</CardTitle>
                <AIAssistButton field="Key Resources" onSuggestion={(s) => handleAISuggestion('keyResources', s)} />
              </div>
              <CardDescription className="text-sm">What key resources are required?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List your most important assets..."
                value={canvasData.keyResources}
                onChange={(e) => handleInputChange('keyResources', e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Channels */}
          <Card>
            <CardHeader className="pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Channels</CardTitle>
                <AIAssistButton field="Channels" onSuggestion={(s) => handleAISuggestion('channels', s)} />
              </div>
              <CardDescription className="text-sm">Through which channels do you reach customers?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe your distribution channels..."
                value={canvasData.channels}
                onChange={(e) => handleInputChange('channels', e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Cost Structure */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Cost Structure</CardTitle>
                <AIAssistButton field="Cost Structure" onSuggestion={(s) => handleAISuggestion('costStructure', s)} />
              </div>
              <CardDescription className="text-sm">What are the most important costs?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="List your major cost drivers..."
                value={canvasData.costStructure}
                onChange={(e) => handleInputChange('costStructure', e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Revenue Streams */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-3 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Revenue Streams</CardTitle>
                <AIAssistButton field="Revenue Streams" onSuggestion={(s) => handleAISuggestion('revenueStreams', s)} />
              </div>
              <CardDescription className="text-sm">What value are customers willing to pay for?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe how you generate revenue..."
                value={canvasData.revenueStreams}
                onChange={(e) => handleInputChange('revenueStreams', e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessCanvas;

