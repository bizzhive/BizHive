
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, BarChart, DollarSign, Scale } from "lucide-react";
import { toast } from "sonner";

const MarketResearch = () => {
  const [targetMarket, setTargetMarket] = useState({
    demographics: "",
    interests: "",
    behaviors: "",
    size: "",
    location: ""
  });

  const [competitors, setCompetitors] = useState([
    { name: "", strengths: "", weaknesses: "", pricing: "", positioning: "" }
  ]);

  const [marketDemand, setMarketDemand] = useState({
    keywords: "",
    trends: "",
    customerFeedback: "",
    demandLevel: ""
  });

  const addCompetitor = () => {
    setCompetitors([...competitors, { name: "", strengths: "", weaknesses: "", pricing: "", positioning: "" }]);
  };

  const updateCompetitor = (index: number, field: string, value: string) => {
    const updated = [...competitors];
    updated[index] = { ...updated[index], [field]: value };
    setCompetitors(updated);
  };

  const generateReport = () => {
    toast.success("Market research report generated! Check your downloads.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Market Research</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conduct comprehensive market research to validate your business idea and understand your market
          </p>
        </div>

        <Tabs defaultValue="target-market" className="max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="target-market">Target Market</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="demand">Market Demand</TabsTrigger>
            <TabsTrigger value="viability">Economic Viability</TabsTrigger>
            <TabsTrigger value="legal">Legal Research</TabsTrigger>
          </TabsList>

          <TabsContent value="target-market">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  Identify Your Target Market
                </CardTitle>
                <CardDescription>
                  Define your target audience based on demographics, interests, and behaviors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="demographics">Demographics</Label>
                    <Textarea
                      id="demographics"
                      placeholder="Age, gender, income level, education, occupation..."
                      value={targetMarket.demographics}
                      onChange={(e) => setTargetMarket({...targetMarket, demographics: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="interests">Interests & Preferences</Label>
                    <Textarea
                      id="interests"
                      placeholder="Hobbies, preferences, lifestyle choices..."
                      value={targetMarket.interests}
                      onChange={(e) => setTargetMarket({...targetMarket, interests: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="behaviors">Behaviors</Label>
                    <Textarea
                      id="behaviors"
                      placeholder="Shopping habits, media consumption, decision-making process..."
                      value={targetMarket.behaviors}
                      onChange={(e) => setTargetMarket({...targetMarket, behaviors: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Geographic Location</Label>
                    <Input
                      id="location"
                      placeholder="City, state, region, or nationwide..."
                      value={targetMarket.location}
                      onChange={(e) => setTargetMarket({...targetMarket, location: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="size">Estimated Market Size</Label>
                  <Input
                    id="size"
                    placeholder="Number of potential customers in your target market..."
                    value={targetMarket.size}
                    onChange={(e) => setTargetMarket({...targetMarket, size: e.target.value})}
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Research Tools & Methods:</h3>
                  <ul className="text-sm space-y-1">
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

          <TabsContent value="competitors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-green-600" />
                  Competitor Analysis
                </CardTitle>
                <CardDescription>
                  Analyze your competitors' strengths, weaknesses, and market positioning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {competitors.map((competitor, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Competitor {index + 1}</h3>
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
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Competitor Name</Label>
                        <Input
                          placeholder="Company/brand name"
                          value={competitor.name}
                          onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Pricing Strategy</Label>
                        <Input
                          placeholder="Premium, budget, competitive..."
                          value={competitor.pricing}
                          onChange={(e) => updateCompetitor(index, 'pricing', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Strengths</Label>
                        <Textarea
                          placeholder="What they do well..."
                          value={competitor.strengths}
                          onChange={(e) => updateCompetitor(index, 'strengths', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Weaknesses</Label>
                        <Textarea
                          placeholder="Areas for improvement..."
                          value={competitor.weaknesses}
                          onChange={(e) => updateCompetitor(index, 'weaknesses', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Market Positioning</Label>
                      <Textarea
                        placeholder="How they position themselves in the market..."
                        value={competitor.positioning}
                        onChange={(e) => updateCompetitor(index, 'positioning', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                
                <Button onClick={addCompetitor} variant="outline" className="w-full">
                  Add Another Competitor
                </Button>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Analysis Tools:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• SEMrush and Ahrefs for competitor website analysis</li>
                    <li>• Social media monitoring tools</li>
                    <li>• Customer review analysis</li>
                    <li>• Industry reports and publications</li>
                    <li>• Direct competitor website and product analysis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demand">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-6 w-6 text-purple-600" />
                  Market Demand Assessment
                </CardTitle>
                <CardDescription>
                  Evaluate the demand for your product or service in the market
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="keywords">Keyword Research</Label>
                    <Textarea
                      id="keywords"
                      placeholder="List keywords related to your product/service and their search volumes..."
                      value={marketDemand.keywords}
                      onChange={(e) => setMarketDemand({...marketDemand, keywords: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="trends">Market Trends</Label>
                    <Textarea
                      id="trends"
                      placeholder="Current trends affecting your industry..."
                      value={marketDemand.trends}
                      onChange={(e) => setMarketDemand({...marketDemand, trends: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerFeedback">Customer Feedback</Label>
                    <Textarea
                      id="customerFeedback"
                      placeholder="Feedback from surveys, focus groups, or direct interactions..."
                      value={marketDemand.customerFeedback}
                      onChange={(e) => setMarketDemand({...marketDemand, customerFeedback: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="demandLevel">Demand Level Assessment</Label>
                    <Textarea
                      id="demandLevel"
                      placeholder="High/Medium/Low demand with justification..."
                      value={marketDemand.demandLevel}
                      onChange={(e) => setMarketDemand({...marketDemand, demandLevel: e.target.value})}
                    />
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Research Methods:</h3>
                  <ul className="text-sm space-y-1">
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

          <TabsContent value="viability">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                  Economic Viability Assessment
                </CardTitle>
                <CardDescription>
                  Determine the economic feasibility of your business idea
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Initial Costs</h3>
                    <div>
                      <Label htmlFor="startupCosts">Startup Costs (₹)</Label>
                      <Input id="startupCosts" type="number" placeholder="100000" />
                    </div>
                    <div>
                      <Label htmlFor="equipmentCosts">Equipment & Technology (₹)</Label>
                      <Input id="equipmentCosts" type="number" placeholder="50000" />
                    </div>
                    <div>
                      <Label htmlFor="licenseCosts">Licenses & Permits (₹)</Label>
                      <Input id="licenseCosts" type="number" placeholder="25000" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Ongoing Expenses</h3>
                    <div>
                      <Label htmlFor="monthlyRent">Monthly Rent (₹)</Label>
                      <Input id="monthlyRent" type="number" placeholder="15000" />
                    </div>
                    <div>
                      <Label htmlFor="salaries">Monthly Salaries (₹)</Label>
                      <Input id="salaries" type="number" placeholder="50000" />
                    </div>
                    <div>
                      <Label htmlFor="otherExpenses">Other Monthly Expenses (₹)</Label>
                      <Input id="otherExpenses" type="number" placeholder="20000" />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Revenue Projections</h3>
                    <div>
                      <Label htmlFor="unitPrice">Price per Unit/Service (₹)</Label>
                      <Input id="unitPrice" type="number" placeholder="500" />
                    </div>
                    <div>
                      <Label htmlFor="unitsPerMonth">Units Sold per Month</Label>
                      <Input id="unitsPerMonth" type="number" placeholder="200" />
                    </div>
                    <div>
                      <Label htmlFor="monthlyRevenue">Projected Monthly Revenue (₹)</Label>
                      <Input id="monthlyRevenue" type="number" placeholder="100000" disabled />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Break-even Analysis</h3>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Total Initial Investment:</span>
                          <span className="font-semibold">₹ 1,75,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Expenses:</span>
                          <span className="font-semibold">₹ 85,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Profit:</span>
                          <span className="font-semibold">₹ 15,000</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span>Break-even Period:</span>
                          <span className="font-bold text-orange-600">12 months</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Analysis Tools:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Excel or Google Sheets for financial modeling</li>
                    <li>• Business plan financial templates</li>
                    <li>• Industry benchmark data</li>
                    <li>• Sensitivity analysis for different scenarios</li>
                    <li>• ROI and payback period calculations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-6 w-6 text-red-600" />
                  Legal & Regulatory Research
                </CardTitle>
                <CardDescription>
                  Understand legal requirements and regulations for your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Required Licenses & Permits</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="gst" />
                        <Label htmlFor="gst">GST Registration</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="trade" />
                        <Label htmlFor="trade">Trade License</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="fssai" />
                        <Label htmlFor="fssai">FSSAI License (Food Business)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="pollution" />
                        <Label htmlFor="pollution">Pollution Control Clearance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="fire" />
                        <Label htmlFor="fire">Fire Department NOC</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Industry-Specific Requirements</h3>
                    <Textarea
                      placeholder="List any specific regulations or requirements for your industry..."
                      className="h-32"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Compliance Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Business Registration</span>
                      <span className="text-sm text-gray-600">Week 1-2</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>GST Registration</span>
                      <span className="text-sm text-gray-600">Week 2-3</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Trade License</span>
                      <span className="text-sm text-gray-600">Week 3-4</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Industry-specific Permits</span>
                      <span className="text-sm text-gray-600">Week 4-6</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Research Resources:</h3>
                  <ul className="text-sm space-y-1">
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

        <div className="mt-8 text-center">
          <Button onClick={generateReport} size="lg" className="px-8">
            Generate Market Research Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarketResearch;
