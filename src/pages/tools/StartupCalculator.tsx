import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Save, ArrowLeft, Calculator, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSavedTool } from "@/hooks/use-saved-tool";
import { AIAssistButton } from "@/components/AIAssistButton";

const defaultCosts = {
  equipmentCosts: 0,
  licensingFees: 0,
  initialInventory: 0,
  marketingLaunch: 0,
  legalProfessional: 0,
  officeSetup: 0,
  technology: 0,
  deposits: 0,
  rent: 0,
  salaries: 0,
  utilities: 0,
  insurance: 0,
  marketing: 0,
  supplies: 0,
  loan: 0,
  other: 0,
  runway: 12,
};

const StartupCalculator = () => {
  const { data: savedData, isLoading, save, isSaving } = useSavedTool('startup_calculator', defaultCosts);

  const [costs, setCosts] = useState(defaultCosts);

  useEffect(() => {
    if (savedData) {
      const { runway: savedRunway, ...restCosts } = savedData as typeof defaultCosts;
      setCosts({ ...defaultCosts, ...restCosts, runway: savedRunway ?? 12 });
    }
  }, [savedData]);

  const handleInputChange = (field: string, value: string) => {
    setCosts(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const runway = costs.runway ?? 12;

  const calculateTotals = () => {
    const oneTimeCosts = costs.equipmentCosts + costs.licensingFees + costs.initialInventory +
      costs.marketingLaunch + costs.legalProfessional + costs.officeSetup +
      costs.technology + costs.deposits;
    const monthlyOperatingCosts = costs.rent + costs.salaries + costs.utilities +
      costs.insurance + costs.marketing + costs.supplies +
      costs.loan + costs.other;
    const totalRunwayNeeded = monthlyOperatingCosts * runway;
    const totalStartupCosts = oneTimeCosts + totalRunwayNeeded;
    return { oneTimeCosts, monthlyOperatingCosts, totalRunwayNeeded, totalStartupCosts };
  };

  const totals = calculateTotals();

  const handleSave = () => save(costs);

  const handleDownload = () => {
    const content = `Startup Cost Calculation Report
Generated on: ${new Date().toLocaleDateString()}

ONE-TIME STARTUP COSTS:
Equipment & Assets: ₹${costs.equipmentCosts.toLocaleString()}
Licensing & Permits: ₹${costs.licensingFees.toLocaleString()}
Initial Inventory: ₹${costs.initialInventory.toLocaleString()}
Marketing Launch: ₹${costs.marketingLaunch.toLocaleString()}
Legal & Professional: ₹${costs.legalProfessional.toLocaleString()}
Office Setup: ₹${costs.officeSetup.toLocaleString()}
Technology: ₹${costs.technology.toLocaleString()}
Deposits: ₹${costs.deposits.toLocaleString()}

Subtotal One-time Costs: ₹${totals.oneTimeCosts.toLocaleString()}

MONTHLY OPERATING COSTS:
Rent: ₹${costs.rent.toLocaleString()}
Salaries: ₹${costs.salaries.toLocaleString()}
Utilities: ₹${costs.utilities.toLocaleString()}
Insurance: ₹${costs.insurance.toLocaleString()}
Marketing: ₹${costs.marketing.toLocaleString()}
Supplies: ₹${costs.supplies.toLocaleString()}
Loan Payments: ₹${costs.loan.toLocaleString()}
Other: ₹${costs.other.toLocaleString()}

Subtotal Monthly Costs: ₹${totals.monthlyOperatingCosts.toLocaleString()}

FUNDING REQUIREMENTS:
Runway Period: ${runway} months
Total Runway Needed: ₹${totals.totalRunwayNeeded.toLocaleString()}

TOTAL STARTUP CAPITAL NEEDED: ₹${totals.totalStartupCosts.toLocaleString()}`;

    const dataBlob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'startup-cost-calculation.txt';
    link.click();
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/tools" className="flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Startup Cost Calculator</h1>
          <p className="text-muted-foreground mb-6">
            Calculate your initial investment and monthly costs to determine total startup capital needed.
          </p>
          <div className="flex gap-3 mb-8">
            <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Saving..." : "Save to Cloud"}
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* One-time Costs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">One-time Startup Costs</CardTitle>
                </div>
                <AIAssistButton
                  field="one-time startup costs"
                  context={{ currentCosts: costs }}
                  onSuggestion={(suggestion) => {
                    // Parse numbers from suggestion if possible
                    console.log("AI Suggestion:", suggestion);
                  }}
                />
              </div>
              <CardDescription>Initial investment required to start your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "equipmentCosts", label: "Equipment & Assets" },
                { id: "licensingFees", label: "Licensing & Permits" },
                { id: "initialInventory", label: "Initial Inventory" },
                { id: "marketingLaunch", label: "Marketing Launch" },
                { id: "legalProfessional", label: "Legal & Professional" },
                { id: "officeSetup", label: "Office Setup" },
                { id: "technology", label: "Technology" },
                { id: "deposits", label: "Deposits" },
              ].map(({ id, label }) => (
                <div key={id}>
                  <Label htmlFor={id}>{label} (₹)</Label>
                  <Input
                    id={id}
                    type="number"
                    placeholder="0"
                    value={costs[id as keyof typeof costs] || ''}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Monthly Operating Costs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Monthly Operating Costs</CardTitle>
                </div>
                <AIAssistButton
                  field="monthly operating costs"
                  context={{ currentCosts: costs }}
                  onSuggestion={(suggestion) => console.log("AI Suggestion:", suggestion)}
                />
              </div>
              <CardDescription>Recurring expenses for running your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "rent", label: "Rent" },
                { id: "salaries", label: "Salaries" },
                { id: "utilities", label: "Utilities" },
                { id: "insurance", label: "Insurance" },
                { id: "marketing", label: "Marketing" },
                { id: "supplies", label: "Supplies" },
                { id: "loan", label: "Loan Payments" },
                { id: "other", label: "Other Expenses" },
              ].map(({ id, label }) => (
                <div key={id}>
                  <Label htmlFor={id}>{label} (₹)</Label>
                  <Input
                    id={id}
                    type="number"
                    placeholder="0"
                    value={costs[id as keyof typeof costs] || ''}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                  />
                </div>
              ))}
              <div className="mt-4">
                <Label htmlFor="runway">Runway Period (months)</Label>
                <Input
                  id="runway"
                  type="number"
                  min="1"
                  max="60"
                  value={runway}
                  onChange={(e) => handleInputChange('runway', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Months of operating expenses to cover</p>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="lg:row-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Cost Summary</CardTitle>
              </div>
              <CardDescription>Your total startup capital requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold text-primary mb-1">One-time Costs</h4>
                <p className="text-2xl font-bold text-foreground">₹{totals.oneTimeCosts.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-1">Monthly Operating Costs</h4>
                <p className="text-2xl font-bold text-foreground">₹{totals.monthlyOperatingCosts.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-accent/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-1">{runway}-Month Runway</h4>
                <p className="text-2xl font-bold text-foreground">₹{totals.totalRunwayNeeded.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-primary/20 rounded-lg border-2 border-primary/30">
                <h4 className="font-semibold text-primary mb-1">Total Capital Needed</h4>
                <p className="text-3xl font-bold text-foreground">₹{totals.totalStartupCosts.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">Funding Options to Consider:</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Personal savings & bootstrapping</li>
                  <li>• Bank loans & credit lines</li>
                  <li>• Angel investors & VCs</li>
                  <li>• Government schemes & grants</li>
                  <li>• Crowdfunding platforms</li>
                  <li>• Friends & family funding</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartupCalculator;
