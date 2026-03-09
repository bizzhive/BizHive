import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, BarChart, DollarSign, Scale, Save, Loader2 } from "lucide-react";
import { useSavedTool } from "@/hooks/use-saved-tool";
import { AIAssistButton } from "@/components/AIAssistButton";

const defaultData = {
  targetMarket: {
    demographics: "",
    interests: "",
    behaviors: "",
    size: "",
    location: "",
  },
  competitors: [
    { name: "", strengths: "", weaknesses: "", pricing: "", positioning: "" },
  ],
  marketDemand: {
    keywords: "",
    trends: "",
    customerFeedback: "",
    demandLevel: "",
  },
  viability: {
    startupCosts: "",
    equipmentCosts: "",
    licenseCosts: "",
    monthlyRent: "",
    salaries: "",
    otherExpenses: "",
    unitPrice: "",
    unitsPerMonth: "",
  },
  legal: {
    gst: false,
    trade: false,
    fssai: false,
    pollution: false,
    fire: false,
    industryRequirements: "",
  },
};

type MarketData = typeof defaultData;

const MarketResearch = () => {
  const { data: savedData, isLoading, save, isSaving } = useSavedTool('market_research', defaultData);

  const [targetMarket, setTargetMarket] = useState(defaultData.targetMarket);
  const [competitors, setCompetitors] = useState(defaultData.competitors);
  const [marketDemand, setMarketDemand] = useState(defaultData.marketDemand);
  const [viability, setViability] = useState(defaultData.viability);
  const [legal, setLegal] = useState(defaultData.legal);

  useEffect(() => {
    if (savedData) {
      const d = savedData as MarketData;
      if (d.targetMarket) setTargetMarket(d.targetMarket);
      if (d.competitors?.length) setCompetitors(d.competitors);
      if (d.marketDemand) setMarketDemand(d.marketDemand);
      if (d.viability) setViability(d.viability);
      if (d.legal) setLegal(d.legal);
    }
  }, [savedData]);

  const handleSave = () => save({ targetMarket, competitors, marketDemand, viability, legal });

  const addCompetitor = () => {
    setCompetitors([...competitors, { name: "", strengths: "", weaknesses: "", pricing: "", positioning: "" }]);
  };

  const updateCompetitor = (index: number, field: string, value: string) => {
    const updated = [...competitors];
    updated[index] = { ...updated[index], [field]: value };
    setCompetitors(updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-4">Market Research</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conduct comprehensive market research to validate your business idea and understand your market
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save to Cloud"}
          </Button>
        </div>

        <Tabs defaultValue="target-market" className="max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="target-market">Target Market</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="demand">Market Demand</TabsTrigger>
            <TabsTrigger value="viability">Viability</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>

          {/* Target Market */}
          <TabsContent value="target-market">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    Identify Your Target Market
                  </CardTitle>
                  <AIAssistButton
                    field="target market demographics and profile"
                    context={{ targetMarket }}
                    onSuggestion={(s) => setTargetMarket(prev => ({ ...prev, demographics: prev.demographics ? `${prev.demographics}\n\n${s}` : s }))}
                  />
                </div>
                <CardDescription>Define your target audience based on demographics, interests, and behaviors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="demographics">Demographics</Label>
                      <AIAssistButton
                        field="demographics"
                        context={{ targetMarket }}
                        onSuggestion={(s) => setTargetMarket(prev => ({ ...prev, demographics: s }))}
                      />
                    </div>
                    <Textarea
                      id="demographics"
                      placeholder="Age, gender, income level, education, occupation..."
                      value={targetMarket.demographics}
                      onChange={(e) => setTargetMarket({ ...targetMarket, demographics: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="interests">Interests & Preferences</Label>
                      <AIAssistButton
                        field="interests and preferences"
                        context={{ targetMarket }}
                        onSuggestion={(s) => setTargetMarket(prev => ({ ...prev, interests: s }))}
                      />
                    </div>
                    <Textarea
                      id="interests"
                      placeholder="Hobbies, preferences, lifestyle choices..."
                      value={targetMarket.interests}
                      onChange={(e) => setTargetMarket({ ...targetMarket, interests: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="behaviors">Behaviors</Label>
                      <AIAssistButton
                        field="customer behaviors"
                        context={{ targetMarket }}
                        onSuggestion={(s) => setTargetMarket(prev => ({ ...prev, behaviors: s }))}
                      />
                    </div>
                    <Textarea
                      id="behaviors"
                      placeholder="Shopping habits, media consumption, decision-making process..."
                      value={targetMarket.behaviors}
                      onChange={(e) => setTargetMarket({ ...targetMarket, behaviors: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Geographic Location</Label>
                    <Input
                      id="location"
                      placeholder="City, state, region, or nationwide..."
                      value={targetMarket.location}
                      onChange={(e) => setTargetMarket({ ...targetMarket, location: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="size">Estimated Market Size</Label>
                  <Input
                    id="size"
                    placeholder="Number of potential customers in your target market..."
                    value={targetMarket.size}
                    onChange={(e) => setTargetMarket({ ...targetMarket, size: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h3 className="font-semibold mb-2 text-foreground">Research Tools & Methods:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Google Analytics for website audience insights</li>
                    <li>• Facebook Audience Insights for social media demographics</li>
                    <li>• Surveys and questionnaires for direct feedback</li>
                    <li>• Industry reports and market research studies</li>
                    <li>• Social media analysis for behavior patterns</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitors */}
          <TabsContent value="competitors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-primary" />
                  Competitor Analysis
                </CardTitle>
                <CardDescription>Analyze your competitors' strengths, weaknesses, and market positioning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {competitors.map((competitor, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">Competitor {index + 1}</h3>
                      <div className="flex items-center gap-2">
                        <AIAssistButton
                          field={`competitor ${index + 1} analysis`}
                          context={{ competitor, allCompetitors: competitors }}
                          onSuggestion={(s) => updateCompetitor(index, 'strengths', s)}
                        />
                        {competitors.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCompetitors(competitors.filter((_, i) => i !== index))}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Competitor Name</Label>
                        <Input
                          placeholder="Company/brand name"
                          value={competitor.name}
                          onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Pricing Strategy</Label>
                        <Input
                          placeholder="Premium, budget, competitive..."
                          value={competitor.pricing}
                          onChange={(e) => updateCompetitor(index, 'pricing', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Strengths</Label>
                        <Textarea
                          placeholder="What they do well..."
                          value={competitor.strengths}
                          onChange={(e) => updateCompetitor(index, 'strengths', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Weaknesses</Label>
                        <Textarea
                          placeholder="Areas for improvement..."
                          value={competitor.weaknesses}
                          onChange={(e) => updateCompetitor(index, 'weaknesses', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Market Positioning</Label>
                      <Textarea
                        placeholder="How they position themselves in the market..."
                        value={competitor.positioning}
                        onChange={(e) => updateCompetitor(index, 'positioning', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={addCompetitor} variant="outline" className="w-full">
                  + Add Another Competitor
                </Button>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h3 className="font-semibold mb-2 text-foreground">Analysis Tools:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• SEMrush and Ahrefs for competitor website analysis</li>
                    <li>• Social media monitoring tools</li>
                    <li>• Customer review analysis</li>
                    <li>• Industry reports and publications</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Demand */}
          <TabsContent value="demand">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-6 w-6 text-primary" />
                    Market Demand Assessment
                  </CardTitle>
                  <AIAssistButton
                    field="market demand and trends"
                    context={{ marketDemand }}
                    onSuggestion={(s) => setMarketDemand(prev => ({ ...prev, trends: s }))}
                  />
                </div>
                <CardDescription>Evaluate the demand for your product or service in the market</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="keywords">Keyword Research</Label>
                      <AIAssistButton
                        field="keyword research and search volumes"
                        context={{ marketDemand }}
                        onSuggestion={(s) => setMarketDemand(prev => ({ ...prev, keywords: s }))}
                      />
                    </div>
                    <Textarea
                      id="keywords"
                      placeholder="List keywords related to your product/service and their search volumes..."
                      value={marketDemand.keywords}
                      onChange={(e) => setMarketDemand({ ...marketDemand, keywords: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="trends">Market Trends</Label>
                      <AIAssistButton
                        field="current industry trends"
                        context={{ marketDemand }}
                        onSuggestion={(s) => setMarketDemand(prev => ({ ...prev, trends: s }))}
                      />
                    </div>
                    <Textarea
                      id="trends"
                      placeholder="Current trends affecting your industry..."
                      value={marketDemand.trends}
                      onChange={(e) => setMarketDemand({ ...marketDemand, trends: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="customerFeedback">Customer Feedback</Label>
                      <AIAssistButton
                        field="customer feedback insights"
                        context={{ marketDemand }}
                        onSuggestion={(s) => setMarketDemand(prev => ({ ...prev, customerFeedback: s }))}
                      />
                    </div>
                    <Textarea
                      id="customerFeedback"
                      placeholder="Feedback from surveys, focus groups, or direct interactions..."
                      value={marketDemand.customerFeedback}
                      onChange={(e) => setMarketDemand({ ...marketDemand, customerFeedback: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="demandLevel">Demand Level Assessment</Label>
                      <AIAssistButton
                        field="market demand level justification"
                        context={{ marketDemand }}
                        onSuggestion={(s) => setMarketDemand(prev => ({ ...prev, demandLevel: s }))}
                      />
                    </div>
                    <Textarea
                      id="demandLevel"
                      placeholder="High/Medium/Low demand with justification..."
                      value={marketDemand.demandLevel}
                      onChange={(e) => setMarketDemand({ ...marketDemand, demandLevel: e.target.value })}
                    />
                  </div>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h3 className="font-semibold mb-2 text-foreground">Research Methods:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Google Trends for search interest over time</li>
                    <li>• Keyword research tools (Google Keyword Planner, Ubersuggest)</li>
                    <li>• Industry market reports and forecasts</li>
                    <li>• Customer surveys and focus groups</li>
                    <li>• Social media sentiment analysis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Economic Viability */}
          <TabsContent value="viability">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-primary" />
                    Economic Viability Assessment
                  </CardTitle>
                  <AIAssistButton
                    field="economic viability and cost estimates"
                    context={{ viability }}
                    onSuggestion={(s) => console.log("AI Viability Suggestion:", s)}
                  />
                </div>
                <CardDescription>Determine the economic feasibility of your business idea</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Initial Costs</h3>
                    {[
                      { id: "startupCosts", label: "Startup Costs (₹)", placeholder: "100000" },
                      { id: "equipmentCosts", label: "Equipment & Technology (₹)", placeholder: "50000" },
                      { id: "licenseCosts", label: "Licenses & Permits (₹)", placeholder: "25000" },
                    ].map(({ id, label, placeholder }) => (
                      <div key={id}>
                        <Label htmlFor={id}>{label}</Label>
                        <Input
                          id={id}
                          type="number"
                          placeholder={placeholder}
                          value={viability[id as keyof typeof viability] as string}
                          onChange={(e) => setViability(prev => ({ ...prev, [id]: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Ongoing Expenses</h3>
                    {[
                      { id: "monthlyRent", label: "Monthly Rent (₹)", placeholder: "15000" },
                      { id: "salaries", label: "Monthly Salaries (₹)", placeholder: "50000" },
                      { id: "otherExpenses", label: "Other Monthly Expenses (₹)", placeholder: "20000" },
                    ].map(({ id, label, placeholder }) => (
                      <div key={id}>
                        <Label htmlFor={id}>{label}</Label>
                        <Input
                          id={id}
                          type="number"
                          placeholder={placeholder}
                          value={viability[id as keyof typeof viability] as string}
                          onChange={(e) => setViability(prev => ({ ...prev, [id]: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Revenue Projections</h3>
                    {[
                      { id: "unitPrice", label: "Price per Unit/Service (₹)", placeholder: "500" },
                      { id: "unitsPerMonth", label: "Units Sold per Month", placeholder: "200" },
                    ].map(({ id, label, placeholder }) => (
                      <div key={id}>
                        <Label htmlFor={id}>{label}</Label>
                        <Input
                          id={id}
                          type="number"
                          placeholder={placeholder}
                          value={viability[id as keyof typeof viability] as string}
                          onChange={(e) => setViability(prev => ({ ...prev, [id]: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    ))}
                    <div>
                      <Label>Projected Monthly Revenue (₹)</Label>
                      <Input
                        type="number"
                        value={(parseFloat(viability.unitPrice || '0') * parseFloat(viability.unitsPerMonth || '0')) || ''}
                        disabled
                        className="mt-1 bg-muted"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Break-even Analysis</h3>
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                      <div className="text-sm space-y-2">
                        {(() => {
                          const totalInitial = (parseFloat(viability.startupCosts || '0') + parseFloat(viability.equipmentCosts || '0') + parseFloat(viability.licenseCosts || '0'));
                          const monthlyExpenses = (parseFloat(viability.monthlyRent || '0') + parseFloat(viability.salaries || '0') + parseFloat(viability.otherExpenses || '0'));
                          const monthlyRevenue = parseFloat(viability.unitPrice || '0') * parseFloat(viability.unitsPerMonth || '0');
                          const monthlyProfit = monthlyRevenue - monthlyExpenses;
                          const breakEven = monthlyProfit > 0 ? Math.ceil(totalInitial / monthlyProfit) : 0;
                          return (
                            <>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Initial Investment:</span>
                                <span className="font-semibold">₹{totalInitial.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Monthly Expenses:</span>
                                <span className="font-semibold">₹{monthlyExpenses.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Monthly Profit:</span>
                                <span className={`font-semibold ${monthlyProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>₹{monthlyProfit.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-t pt-2 mt-2">
                                <span className="text-muted-foreground">Break-even Period:</span>
                                <span className="font-bold text-primary">{breakEven > 0 ? `${breakEven} months` : 'N/A'}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal */}
          <TabsContent value="legal">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-6 w-6 text-primary" />
                    Legal & Regulatory Research
                  </CardTitle>
                  <AIAssistButton
                    field="legal requirements and regulatory compliance"
                    context={{ legal }}
                    onSuggestion={(s) => setLegal(prev => ({ ...prev, industryRequirements: s }))}
                  />
                </div>
                <CardDescription>Understand legal requirements and regulations for your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Required Licenses & Permits</h3>
                    <div className="space-y-3">
                      {[
                        { id: "gst", label: "GST Registration" },
                        { id: "trade", label: "Trade License" },
                        { id: "fssai", label: "FSSAI License (Food Business)" },
                        { id: "pollution", label: "Pollution Control Clearance" },
                        { id: "fire", label: "Fire Department NOC" },
                      ].map(({ id, label }) => (
                        <div key={id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={id}
                            checked={legal[id as keyof typeof legal] as boolean}
                            onChange={(e) => setLegal(prev => ({ ...prev, [id]: e.target.checked }))}
                            className="rounded"
                          />
                          <Label htmlFor={id}>{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">Industry-Specific Requirements</h3>
                      <AIAssistButton
                        field="industry-specific legal requirements"
                        context={{ legal }}
                        onSuggestion={(s) => setLegal(prev => ({ ...prev, industryRequirements: s }))}
                      />
                    </div>
                    <Textarea
                      placeholder="List any specific regulations or requirements for your industry..."
                      className="h-32"
                      value={legal.industryRequirements}
                      onChange={(e) => setLegal(prev => ({ ...prev, industryRequirements: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Compliance Timeline</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Business Registration", period: "Week 1-2" },
                      { label: "GST Registration", period: "Week 2-3" },
                      { label: "Trade License", period: "Week 3-4" },
                      { label: "Industry-specific Permits", period: "Week 4-6" },
                    ].map(({ label, period }) => (
                      <div key={label} className="flex items-center justify-between p-3 bg-muted rounded">
                        <span className="text-foreground">{label}</span>
                        <span className="text-sm text-muted-foreground">{period}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h3 className="font-semibold mb-2 text-foreground">Research Resources:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Ministry of Corporate Affairs (MCA) website</li>
                    <li>• Invest India portal for business regulations</li>
                    <li>• State government websites for local requirements</li>
                    <li>• Industry association guidelines</li>
                    <li>• Legal consultation for complex requirements</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketResearch;
