
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Save, ArrowLeft, Calculator, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const FinancialCalculator = () => {
  const [revenue, setRevenue] = useState({
    monthly: 0,
    growth: 0,
    customers: 0,
    pricePerCustomer: 0
  });

  const [expenses, setExpenses] = useState({
    fixedCosts: 0,
    variableCosts: 0,
    marketing: 0,
    salaries: 0
  });

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
      breakEvenPoint: Math.ceil(breakEvenPoint)
    };
  };

  const projections = calculateProjections();

  const handleSave = () => {
    const data = { revenue, expenses, projections };
    localStorage.setItem('financialCalculator', JSON.stringify(data));
    alert('Financial calculations saved locally!');
  };

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/tools" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Financial Calculator</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Calculate revenue projections, expenses, and profitability for your business.
          </p>
          <div className="flex space-x-4 mb-8">
            <Button onClick={handleSave} className="flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Save Calculations
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg dark:text-white">Revenue Inputs</CardTitle>
              </div>
              <CardDescription className="dark:text-gray-300">Enter your revenue parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monthlyRevenue" className="dark:text-gray-200">Monthly Revenue (₹)</Label>
                <Input
                  id="monthlyRevenue"
                  type="number"
                  placeholder="50000"
                  value={revenue.monthly || ''}
                  onChange={(e) => setRevenue(prev => ({ ...prev, monthly: parseFloat(e.target.value) || 0 }))}
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="text-center text-gray-500 dark:text-gray-400">OR</div>
              <div>
                <Label htmlFor="customers" className="dark:text-gray-200">Number of Customers</Label>
                <Input
                  id="customers"
                  type="number"
                  placeholder="100"
                  value={revenue.customers || ''}
                  onChange={(e) => setRevenue(prev => ({ ...prev, customers: parseFloat(e.target.value) || 0 }))}
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="pricePerCustomer" className="dark:text-gray-200">Price per Customer (₹)</Label>
                <Input
                  id="pricePerCustomer"
                  type="number"
                  placeholder="500"
                  value={revenue.pricePerCustomer || ''}
                  onChange={(e) => setRevenue(prev => ({ ...prev, pricePerCustomer: parseFloat(e.target.value) || 0 }))}
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-red-600" />
                <CardTitle className="text-lg dark:text-white">Monthly Expenses</CardTitle>
              </div>
              <CardDescription className="dark:text-gray-300">Enter your business expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fixedCosts" className="dark:text-gray-200">Fixed Costs (₹)</Label>
                <Input
                  id="fixedCosts"
                  type="number"
                  placeholder="10000"
                  value={expenses.fixedCosts || ''}
                  onChange={(e) => setExpenses(prev => ({ ...prev, fixedCosts: parseFloat(e.target.value) || 0 }))}
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="variableCosts" className="dark:text-gray-200">Variable Costs (₹)</Label>
                <Input
                  id="variableCosts"
                  type="number"
                  placeholder="15000"
                  value={expenses.variableCosts || ''}
                  onChange={(e) => setExpenses(prev => ({ ...prev, variableCosts: parseFloat(e.target.value) || 0 }))}
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="marketing" className="dark:text-gray-200">Marketing (₹)</Label>
                <Input
                  id="marketing"
                  type="number"
                  placeholder="5000"
                  value={expenses.marketing || ''}
                  onChange={(e) => setExpenses(prev => ({ ...prev, marketing: parseFloat(e.target.value) || 0 }))}
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="salaries" className="dark:text-gray-200">Salaries (₹)</Label>
                <Input
                  id="salaries"
                  type="number"
                  placeholder="20000"
                  value={expenses.salaries || ''}
                  onChange={(e) => setExpenses(prev => ({ ...prev, salaries: parseFloat(e.target.value) || 0 }))}
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg dark:text-white">Financial Projections</CardTitle>
              </div>
              <CardDescription className="dark:text-gray-300">Your calculated results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Monthly Revenue</h4>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">₹{projections.monthlyRevenue.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Monthly Expenses</h4>
                <p className="text-2xl font-bold text-red-900 dark:text-red-300">₹{projections.monthlyExpenses.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Monthly Profit</h4>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">₹{projections.monthlyProfit.toLocaleString()}</p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Break-even Point</h4>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-300">{projections.breakEvenPoint} months</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialCalculator;
