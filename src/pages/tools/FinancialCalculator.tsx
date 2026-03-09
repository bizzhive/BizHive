import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Save, ArrowLeft, Calculator, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSavedTool } from "@/hooks/use-saved-tool";
import { AIAssistButton } from "@/components/AIAssistButton";

const defaultData = {
  revenue: { monthly: 0, growth: 0, customers: 0, pricePerCustomer: 0 },
  expenses: { fixedCosts: 0, variableCosts: 0, marketing: 0, salaries: 0 },
};

const FinancialCalculator = () => {
  const { data: savedData, isLoading, save, isSaving } = useSavedTool('financial_calculator', defaultData);

  const [revenue, setRevenue] = useState(defaultData.revenue);
  const [expenses, setExpenses] = useState(defaultData.expenses);

  useEffect(() => {
    if (savedData) {
      const d = savedData as typeof defaultData;
      if (d.revenue) setRevenue(d.revenue);
      if (d.expenses) setExpenses(d.expenses);
    }
  }, [savedData]);

  const calculateProjections = () => {
    const monthlyRevenue = revenue.monthly || (revenue.customers * revenue.pricePerCustomer);
    const monthlyExpenses = expenses.fixedCosts + expenses.variableCosts + expenses.marketing + expenses.salaries;
    const monthlyProfit = monthlyRevenue - monthlyExpenses;
    const breakEvenPoint = expenses.fixedCosts / (monthlyRevenue - expenses.variableCosts) || 0;
    return {
      monthlyRevenue,
      monthlyExpenses,
      monthlyProfit,
      yearlyRevenue: monthlyRevenue * 12,
      yearlyProfit: monthlyProfit * 12,
      breakEvenPoint: Math.ceil(breakEvenPoint),
    };
  };

  const projections = calculateProjections();

  const handleSave = () => save({ revenue, expenses });

  const handleDownload = () => {
    const content = `Financial Projections Report
Generated on: ${new Date().toLocaleDateString()}

REVENUE PROJECTIONS:
Monthly Revenue: ₹${projections.monthlyRevenue.toLocaleString()}
Yearly Revenue: ₹${projections.yearlyRevenue.toLocaleString()}

EXPENSE BREAKDOWN:
Fixed Costs: ₹${expenses.fixedCosts.toLocaleString()}
Variable Costs: ₹${expenses.variableCosts.toLocaleString()}
Marketing: ₹${expenses.marketing.toLocaleString()}
Salaries: ₹${expenses.salaries.toLocaleString()}
Total Monthly Expenses: ₹${projections.monthlyExpenses.toLocaleString()}

PROFITABILITY:
Monthly Profit: ₹${projections.monthlyProfit.toLocaleString()}
Yearly Profit: ₹${projections.yearlyProfit.toLocaleString()}
Break-even Point: ${projections.breakEvenPoint} months`;

    const dataBlob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financial-projections.txt';
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Financial Calculator</h1>
          <p className="text-muted-foreground mb-6">
            Calculate revenue projections, expenses, and profitability for your business.
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Revenue Inputs</CardTitle>
                </div>
                <AIAssistButton
                  field="monthly revenue projection"
                  context={{ revenue, expenses }}
                  onSuggestion={(suggestion) => console.log("AI Revenue Suggestion:", suggestion)}
                />
              </div>
              <CardDescription>Enter your revenue parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monthlyRevenue">Monthly Revenue (₹)</Label>
                <Input
                  id="monthlyRevenue"
                  type="number"
                  placeholder="50000"
                  value={revenue.monthly || ''}
                  onChange={(e) => setRevenue(prev => ({ ...prev, monthly: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="text-center text-muted-foreground text-sm font-medium">— OR —</div>
              <div>
                <Label htmlFor="customers">Number of Customers</Label>
                <Input
                  id="customers"
                  type="number"
                  placeholder="100"
                  value={revenue.customers || ''}
                  onChange={(e) => setRevenue(prev => ({ ...prev, customers: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="pricePerCustomer">Price per Customer (₹)</Label>
                <Input
                  id="pricePerCustomer"
                  type="number"
                  placeholder="500"
                  value={revenue.pricePerCustomer || ''}
                  onChange={(e) => setRevenue(prev => ({ ...prev, pricePerCustomer: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-lg">Monthly Expenses</CardTitle>
                </div>
                <AIAssistButton
                  field="monthly business expenses"
                  context={{ revenue, expenses }}
                  onSuggestion={(suggestion) => console.log("AI Expenses Suggestion:", suggestion)}
                />
              </div>
              <CardDescription>Enter your business expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "fixedCosts", label: "Fixed Costs (₹)", placeholder: "10000" },
                { id: "variableCosts", label: "Variable Costs (₹)", placeholder: "15000" },
                { id: "marketing", label: "Marketing (₹)", placeholder: "5000" },
                { id: "salaries", label: "Salaries (₹)", placeholder: "20000" },
              ].map(({ id, label, placeholder }) => (
                <div key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    type="number"
                    placeholder={placeholder}
                    value={expenses[id as keyof typeof expenses] || ''}
                    onChange={(e) => setExpenses(prev => ({ ...prev, [id]: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Financial Projections</CardTitle>
              </div>
              <CardDescription>Your calculated results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold text-primary mb-1">Monthly Revenue</h4>
                <p className="text-2xl font-bold text-foreground">₹{projections.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Yearly: ₹{projections.yearlyRevenue.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-destructive/10 rounded-lg">
                <h4 className="font-semibold text-destructive mb-1">Monthly Expenses</h4>
                <p className="text-2xl font-bold text-foreground">₹{projections.monthlyExpenses.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-lg ${projections.monthlyProfit >= 0 ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                <h4 className={`font-semibold mb-1 ${projections.monthlyProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  Monthly Profit
                </h4>
                <p className="text-2xl font-bold text-foreground">₹{projections.monthlyProfit.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Yearly: ₹{projections.yearlyProfit.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-1">Break-even Point</h4>
                <p className="text-xl font-bold text-foreground">{projections.breakEvenPoint} months</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialCalculator;
