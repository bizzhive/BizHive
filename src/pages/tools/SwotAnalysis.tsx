
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Save, ArrowLeft, TrendingUp, AlertTriangle, Target, ShieldCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSavedTool } from "@/hooks/use-saved-tool";
import { AIAssistButton } from "@/components/AIAssistButton";

const defaultSwot = {
  strengths: "",
  weaknesses: "",
  opportunities: "",
  threats: ""
};

const SwotAnalysis = () => {
  const { data: savedData, isLoading, save, isSaving } = useSavedTool('swot_analysis', defaultSwot);
  const [swotData, setSwotData] = useState(defaultSwot);

  useEffect(() => {
    if (savedData) {
      setSwotData(savedData);
    }
  }, [savedData]);

  const handleInputChange = (field: string, value: string) => {
    setSwotData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAISuggestion = (field: string, suggestion: string) => {
    setSwotData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev] 
        ? `${prev[field as keyof typeof prev]}\n\n${suggestion}`
        : suggestion
    }));
  };

  const handleSave = () => save(swotData);

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SWOT Analysis Tool</h1>
              <p className="text-gray-600">
                Analyze your business's internal and external factors with AI assistance.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleSave} disabled={isSaving} className="flex items-center">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isSaving ? 'Saving...' : 'Save to Cloud'}
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-green-700">Strengths</CardTitle>
                    <CardDescription className="text-sm">Internal advantages</CardDescription>
                  </div>
                </div>
                <AIAssistButton field="Strengths (SWOT)" onSuggestion={(s) => handleAISuggestion('strengths', s)} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What does your business do well? What unique resources do you have?"
                value={swotData.strengths}
                onChange={(e) => handleInputChange('strengths', e.target.value)}
                className="min-h-[160px]"
              />
            </CardContent>
          </Card>

          {/* Weaknesses */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-red-700">Weaknesses</CardTitle>
                    <CardDescription className="text-sm">Internal disadvantages</CardDescription>
                  </div>
                </div>
                <AIAssistButton field="Weaknesses (SWOT)" onSuggestion={(s) => handleAISuggestion('weaknesses', s)} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What could you improve? What resources are you lacking?"
                value={swotData.weaknesses}
                onChange={(e) => handleInputChange('weaknesses', e.target.value)}
                className="min-h-[160px]"
              />
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-blue-700">Opportunities</CardTitle>
                    <CardDescription className="text-sm">External advantages</CardDescription>
                  </div>
                </div>
                <AIAssistButton field="Opportunities (SWOT)" onSuggestion={(s) => handleAISuggestion('opportunities', s)} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What trends could you take advantage of?"
                value={swotData.opportunities}
                onChange={(e) => handleInputChange('opportunities', e.target.value)}
                className="min-h-[160px]"
              />
            </CardContent>
          </Card>

          {/* Threats */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-orange-700">Threats</CardTitle>
                    <CardDescription className="text-sm">External troubles</CardDescription>
                  </div>
                </div>
                <AIAssistButton field="Threats (SWOT)" onSuggestion={(s) => handleAISuggestion('threats', s)} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What obstacles do you face? What is your competition doing?"
                value={swotData.threats}
                onChange={(e) => handleInputChange('threats', e.target.value)}
                className="min-h-[160px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SwotAnalysis;
