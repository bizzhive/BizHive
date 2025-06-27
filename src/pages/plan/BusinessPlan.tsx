
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Target, DollarSign, Users, Megaphone, Calendar } from "lucide-react";
import { toast } from "sonner";

const BusinessPlan = () => {
  const [businessPlan, setBusinessPlan] = useState({
    executiveSummary: "",
    businessDescription: "",
    marketAnalysis: "",
    organizationManagement: "",
    serviceProduct: "",
    marketingPlan: "",
    fundingRequest: "",
    financialProjections: "",
    appendix: ""
  });

  const [goals, setGoals] = useState([
    { goal: "", specific: "", measurable: "", achievable: "", relevant: "", timeBound: "" }
  ]);

  const updatePlan = (field: string, value: string) => {
    setBusinessPlan({ ...businessPlan, [field]: value });
  };

  const addGoal = () => {
    setGoals([...goals, { goal: "", specific: "", measurable: "", achievable: "", relevant: "", timeBound: "" }]);
  };

  const updateGoal = (index: number, field: string, value: string) => {
    const updated = [...goals];
    updated[index] = { ...updated[index], [field]: value };
    setGoals(updated);
  };

  const generatePlan = () => {
    toast.success("Business Plan generated! Check your downloads.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Business Plan Creator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create a comprehensive business plan with our guided templates and frameworks
          </p>
        </div>

        <Tabs defaultValue="executive-summary" className="max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-4 w-full mb-8">
            <TabsTrigger value="executive-summary">Executive Summary</TabsTrigger>
            <TabsTrigger value="goals">Business Goals</TabsTrigger>
            <TabsTrigger value="financial">Financial Plan</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="executive-summary">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Executive Summary & Business Description
                </CardTitle>
                <CardDescription>
                  Provide a concise overview of your business and its key components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="executiveSummary">Executive Summary</Label>
                  <Textarea
                    id="executiveSummary"
                    placeholder="Brief overview of your business, mission statement, and key success factors..."
                    className="h-32"
                    value={businessPlan.executiveSummary}
                    onChange={(e) => updatePlan('executiveSummary', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="Detailed description of your business, products/services, and unique value proposition..."
                    className="h-32"
                    value={businessPlan.businessDescription}
                    onChange={(e) => updatePlan('businessDescription', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="marketAnalysis">Market Analysis</Label>
                  <Textarea
                    id="marketAnalysis"
                    placeholder="Target market, market size, competition analysis, and market trends..."
                    className="h-32"
                    value={businessPlan.marketAnalysis}
                    onChange={(e) => updatePlan('marketAnalysis', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="organizationManagement">Organization & Management</Label>
                  <Textarea
                    id="organizationManagement"
                    placeholder="Organizational structure, ownership information, and management team..."
                    className="h-32"
                    value={businessPlan.organizationManagement}
                    onChange={(e) => updatePlan('organizationManagement', e.target.value)}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Executive Summary Tips:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Keep it concise but comprehensive (1-2 pages)</li>
                    <li>• Include your mission statement and company overview</li>
                    <li>• Highlight your competitive advantages</li>
                    <li>• Summarize financial projections and funding needs</li>
                    <li>• Write this section last, even though it appears first</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-600" />
                  SMART Business Goals
                </CardTitle>
                <CardDescription>
                  Define Specific, Measurable, Achievable, Relevant, and Time-bound goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {goals.map((goal, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Goal {index + 1}</h3>
                      {goals.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGoals(goals.filter((_, i) => i !== index))}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div>
                      <Label>Goal Statement</Label>
                      <Input
                        placeholder="e.g., Increase monthly revenue to ₹5,00,000"
                        value={goal.goal}
                        onChange={(e) => updateGoal(index, 'goal', e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Specific</Label>
                        <Textarea
                          placeholder="What exactly will be accomplished?"
                          value={goal.specific}
                          onChange={(e) => updateGoal(index, 'specific', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Measurable</Label>
                        <Textarea
                          placeholder="How will progress be measured?"
                          value={goal.measurable}
                          onChange={(e) => updateGoal(index, 'measurable', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Achievable</Label>
                        <Textarea
                          placeholder="Is this goal realistic and attainable?"
                          value={goal.achievable}
                          onChange={(e) => updateGoal(index, 'achievable', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Relevant</Label>
                        <Textarea
                          placeholder="Why is this goal important to your business?"
                          value={goal.relevant}
                          onChange={(e) => updateGoal(index, 'relevant', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Time-bound</Label>
                      <Input
                        placeholder="When will this goal be achieved? (e.g., by December 2024)"
                        value={goal.timeBound}
                        onChange={(e) => updateGoal(index, 'timeBound', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                
                <Button onClick={addGoal} variant="outline" className="w-full">
                  Add Another Goal
                </Button>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Goal Setting Framework:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Short-term goals:</strong> 3-6 months (operational milestones)</li>
                    <li>• <strong>Medium-term goals:</strong> 1-2 years (growth targets)</li>
                    <li>• <strong>Long-term goals:</strong> 3-5 years (strategic vision)</li>
                    <li>• Align all goals with your overall business mission</li>
                    <li>• Review and adjust goals quarterly</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                  Financial Projections
                </CardTitle>
                <CardDescription>
                  Develop detailed financial forecasts and funding requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Revenue Projections (Monthly)</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="year1Revenue">Year 1 Average Monthly Revenue (₹)</Label>
                        <Input id="year1Revenue" type="number" placeholder="100000" />
                      </div>
                      <div>
                        <Label htmlFor="year2Revenue">Year 2 Average Monthly Revenue (₹)</Label>
                        <Input id="year2Revenue" type="number" placeholder="200000" />
                      </div>
                      <div>
                        <Label htmlFor="year3Revenue">Year 3 Average Monthly Revenue (₹)</Label>
                        <Input id="year3Revenue" type="number" placeholder="350000" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Expense Projections (Monthly)</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="operatingExpenses">Operating Expenses (₹)</Label>
                        <Input id="operatingExpenses" type="number" placeholder="50000" />
                      </div>
                      <div>
                        <Label htmlFor="salaryExpenses">Salary & Benefits (₹)</Label>
                        <Input id="salaryExpenses" type="number" placeholder="60000" />
                      </div>
                      <div>
                        <Label htmlFor="marketingExpenses">Marketing & Advertising (₹)</Label>
                        <Input id="marketingExpenses" type="number" placeholder="20000" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-purple-800">Year 1</h4>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm">Revenue: ₹12,00,000</div>
                      <div className="text-sm">Expenses: ₹15,60,000</div>
                      <div className="text-sm font-semibold text-red-600">Loss: ₹3,60,000</div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-purple-800">Year 2</h4>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm">Revenue: ₹24,00,000</div>
                      <div className="text-sm">Expenses: ₹18,00,000</div>
                      <div className="text-sm font-semibold text-green-600">Profit: ₹6,00,000</div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-purple-800">Year 3</h4>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm">Revenue: ₹42,00,000</div>
                      <div className="text-sm">Expenses: ₹25,00,000</div>
                      <div className="text-sm font-semibold text-green-600">Profit: ₹17,00,000</div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="fundingRequest">Funding Request</Label>
                  <Textarea
                    id="fundingRequest"
                    placeholder="Amount needed, how funds will be used, and expected return on investment..."
                    className="h-32"
                    value={businessPlan.fundingRequest}
                    onChange={(e) => updatePlan('fundingRequest', e.target.value)}
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Financial Planning Tools:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Use Excel or Google Sheets for detailed models</li>
                    <li>• Include best-case, worst-case, and realistic scenarios</li>
                    <li>• Research industry benchmarks for validation</li>
                    <li>• Include cash flow projections for first 12 months</li>
                    <li>• Plan for seasonal variations in business</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-6 w-6 text-orange-600" />
                  Marketing & Sales Strategy
                </CardTitle>
                <CardDescription>
                  Outline your marketing strategies and sales approach
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="marketingStrategy">Marketing Plan</Label>
                  <Textarea
                    id="marketingStrategy"
                    placeholder="Target audience, marketing channels, budget allocation, and campaign strategies..."
                    className="h-32"
                    value={businessPlan.marketingPlan}
                    onChange={(e) => updatePlan('marketingPlan', e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Digital Marketing Channels</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Social Media Marketing</span>
                        <input type="checkbox" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Search Engine Optimization</span>
                        <input type="checkbox" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Google Ads</span>
                        <input type="checkbox" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Email Marketing</span>
                        <input type="checkbox" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Content Marketing</span>
                        <input type="checkbox" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Traditional Marketing</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Print Advertising</span>
                        <input type="checkbox" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Radio/TV Advertising</span>
                        <input type="checkbox" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Outdoor Advertising</span>
                        <input type="checkbox" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Direct Mail</span>
                        <input type="checkbox" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span>Networking Events</span>
                        <input type="checkbox" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Sales Strategy</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salesChannels">Sales Channels</Label>
                      <Textarea
                        id="salesChannels"
                        placeholder="Direct sales, online store, retail partners, distributors..."
                        value=""
                      />
                    </div>
                    <div>
                      <Label htmlFor="salesProcess">Sales Process</Label>
                      <Textarea
                        id="salesProcess"
                        placeholder="Lead generation, qualification, conversion, retention..."
                        value=""
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Marketing Mix (4 P's):</h3>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>Product:</strong> Features, benefits, quality, branding
                    </div>
                    <div>
                      <strong>Price:</strong> Pricing strategy, payment terms, discounts
                    </div>
                    <div>
                      <strong>Place:</strong> Distribution channels, location, accessibility
                    </div>
                    <div>
                      <strong>Promotion:</strong> Advertising, PR, sales promotion, personal selling
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button onClick={generatePlan} size="lg" className="px-8">
            Generate Complete Business Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlan;
