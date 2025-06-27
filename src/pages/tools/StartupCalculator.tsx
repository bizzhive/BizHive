
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Save, ArrowLeft, Calculator, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const StartupCalculator = () => {
  const [costs, setCosts] = useState({
    // One-time costs
    equipmentCosts: 0,
    licensingFees: 0,
    initialInventory: 0,
    marketingLaunch: 0,
    legalProfessional: 0,
    officeSetup: 0,
    technology: 0,
    deposits: 0,
    
    // Monthly costs
    rent: 0,
    salaries: 0,
    utilities: 0,
    insurance: 0,
    marketing: 0,
    supplies: 0,
    loan: 0,
    other: 0
  });

  const [runway, setRunway] = useState(12);

  const handleInputChange = (field: string, value: string) => {
    setCosts(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateTotals = () => {
    const oneTimeCosts = costs.equipmentCosts + costs.licensingFees + costs.initialInventory + 
                        costs.marketingLaunch + costs.legalProfessional + costs.officeSetup + 
                        costs.technology + costs.deposits;
    
    const monthlyOperatingCosts = costs.rent + costs.salaries + costs.utilities + 
                                 costs.insurance + costs.marketing + costs.supplies + 
                                 costs.loan + costs.other;
    
    const totalRunwayNeeded = monthlyOperatingCosts * runway;
    const totalStartupCosts = oneTimeCosts + totalRunwayNeeded;
    
    return {
      oneTimeCosts,
      monthlyOperatingCosts,
      totalRunwayNeeded,
      totalStartupCosts
    };
  };

  const totals = calculateTotals();

  const handleSave = () => {
    const data = { costs, runway, totals };
    localStorage.setItem('startupCalculator', JSON.stringify(data));
    alert('Startup cost calculation saved locally!');
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/tools" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Startup Cost Calculator</h1>
          <p className="text-gray-600 mb-6">
            Calculate your initial investment requirements and monthly operating costs to determine total startup capital needed.
          </p>
          <div className="flex space-x-4 mb-8">
            <Button onClick={handleSave} className="flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Save Calculation
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* One-time Costs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">One-time Startup Costs</CardTitle>
              </div>
              <CardDescription>Initial investment required to start your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="equipment">Equipment & Assets</Label>
                <Input
                  id="equipment"
                  type="number"
                  placeholder="₹0"
                  value={costs.equipmentCosts || ''}
                  onChange={(e) => handleInputChange('equipmentCosts', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="licensing">Licensing & Permits</Label>
                <Input
                  id="licensing"
                  type="number"
                  placeholder="₹0"
                  value={costs.licensingFees || ''}
                  onChange={(e) => handleInputChange('licensingFees', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="inventory">Initial Inventory</Label>
                <Input
                  id="inventory"
                  type="number"
                  placeholder="₹0"
                  value={costs.initialInventory || ''}
                  onChange={(e) => handleInputChange('initialInventory', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="marketingLaunch">Marketing Launch</Label>
                <Input
                  id="marketingLaunch"
                  type="number"
                  placeholder="₹0"
                  value={costs.marketingLaunch || ''}
                  onChange={(e) => handleInputChange('marketingLaunch', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="legal">Legal & Professional</Label>
                <Input
                  id="legal"
                  type="number"
                  placeholder="₹0"
                  value={costs.legalProfessional || ''}
                  onChange={(e) => handleInputChange('legalProfessional', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="office">Office Setup</Label>
                <Input
                  id="office"
                  type="number"
                  placeholder="₹0"
                  value={costs.officeSetup || ''}
                  onChange={(e) => handleInputChange('officeSetup', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="technology">Technology</Label>
                <Input
                  id="technology"
                  type="number"
                  placeholder="₹0"
                  value={costs.technology || ''}
                  onChange={(e) => handleInputChange('technology', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="deposits">Deposits</Label>
                <Input
                  id="deposits"
                  type="number"
                  placeholder="₹0"
                  value={costs.deposits || ''}
                  onChange={(e) => handleInputChange('deposits', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Monthly Operating Costs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Monthly Operating Costs</CardTitle>
              </div>
              <CardDescription>Recurring expenses for running your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rent">Rent</Label>
                <Input
                  id="rent"
                  type="number"
                  placeholder="₹0"
                  value={costs.rent || ''}
                  onChange={(e) => handleInputChange('rent', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="salaries">Salaries</Label>
                <Input
                  id="salaries"
                  type="number"
                  placeholder="₹0"
                  value={costs.salaries || ''}
                  onChange={(e) => handleInputChange('salaries', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="utilities">Utilities</Label>
                <Input
                  id="utilities"
                  type="number"
                  placeholder="₹0"
                  value={costs.utilities || ''}
                  onChange={(e) => handleInputChange('utilities', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="insurance">Insurance</Label>
                <Input
                  id="insurance"
                  type="number"
                  placeholder="₹0"
                  value={costs.insurance || ''}
                  onChange={(e) => handleInputChange('insurance', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="marketing">Marketing</Label>
                <Input
                  id="marketing"
                  type="number"
                  placeholder="₹0"
                  value={costs.marketing || ''}
                  onChange={(e) => handleInputChange('marketing', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="supplies">Supplies</Label>
                <Input
                  id="supplies"
                  type="number"
                  placeholder="₹0"
                  value={costs.supplies || ''}
                  onChange={(e) => handleInputChange('supplies', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="loan">Loan Payments</Label>
                <Input
                  id="loan"
                  type="number"
                  placeholder="₹0"
                  value={costs.loan || ''}
                  onChange={(e) => handleInputChange('loan', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="other">Other Expenses</Label>
                <Input
                  id="other"
                  type="number"
                  placeholder="₹0"
                  value={costs.other || ''}
                  onChange={(e) => handleInputChange('other', e.target.value)}
                />
              </div>
              <div className="mt-6">
                <Label htmlFor="runway">Runway Period (months)</Label>
                <Input
                  id="runway"
                  type="number"
                  min="1"
                  max="60"
                  value={runway}
                  onChange={(e) => setRunway(parseInt(e.target.value) || 12)}
                />
                <p className="text-xs text-gray-500 mt-1">How many months of operating expenses to cover</p>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="lg:row-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Cost Summary</CardTitle>
              </div>
              <CardDescription>Your total startup capital requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">One-time Costs</h4>
                <p className="text-2xl font-bold text-blue-900">₹{totals.oneTimeCosts.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Monthly Operating Costs</h4>
                <p className="text-2xl font-bold text-green-900">₹{totals.monthlyOperatingCosts.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2">{runway}-Month Runway</h4>
                <p className="text-2xl font-bold text-orange-900">₹{totals.totalRunwayNeeded.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <h4 className="font-semibold text-purple-700 mb-2">Total Capital Needed</h4>
                <p className="text-3xl font-bold text-purple-900">₹{totals.totalStartupCosts.toLocaleString()}</p>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Funding Options to Consider:</h4>
                <ul className="text-sm space-y-2 text-gray-600">
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
