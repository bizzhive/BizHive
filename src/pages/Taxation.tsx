
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FileText, AlertCircle, Download, Search } from "lucide-react";
import { useState } from "react";

const Taxation = () => {
  const [gstCalculator, setGstCalculator] = useState({
    amount: 0,
    gstRate: 18
  });

  const [incomeCalculator, setIncomeCalculator] = useState({
    income: 0,
    deductions: 0
  });

  const calculateGST = () => {
    const gstAmount = (gstCalculator.amount * gstCalculator.gstRate) / 100;
    const totalAmount = gstCalculator.amount + gstAmount;
    return { gstAmount, totalAmount };
  };

  const calculateIncomeTax = () => {
    const taxableIncome = incomeCalculator.income - incomeCalculator.deductions;
    let tax = 0;
    
    if (taxableIncome <= 250000) tax = 0;
    else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.20;
    else tax = 112500 + (taxableIncome - 1000000) * 0.30;
    
    return { taxableIncome, tax };
  };

  const gstResult = calculateGST();
  const incomeResult = calculateIncomeTax();

  const businessStructures = [
    {
      name: "Sole Proprietorship",
      taxation: "Income Tax as per individual slab rates",
      gstThreshold: "₹20 Lakhs (₹10 Lakhs for NE states)",
      pros: ["Simple setup", "Direct control", "Tax benefits"],
      cons: ["Unlimited liability", "Limited growth potential"]
    },
    {
      name: "Partnership Firm",
      taxation: "No tax on firm, partners taxed individually",
      gstThreshold: "₹20 Lakhs aggregate turnover",
      pros: ["Shared responsibility", "Easy formation", "Tax pass-through"],
      cons: ["Joint liability", "Profit sharing conflicts"]
    },
    {
      name: "LLP",
      taxation: "30% flat rate on profits",
      gstThreshold: "₹20 Lakhs aggregate turnover",
      pros: ["Limited liability", "Flexible structure", "Separate legal entity"],
      cons: ["Compliance requirements", "Audit mandatory"]
    },
    {
      name: "Private Limited Company",
      taxation: "25% for turnover < ₹400 Cr, 30% above",
      gstThreshold: "₹20 Lakhs aggregate turnover",
      pros: ["Limited liability", "Easy funding", "Credibility"],
      cons: ["Complex compliance", "Double taxation", "Higher costs"]
    }
  ];

  const gstRates = [
    { rate: "0%", items: "Essential items like food grains, milk" },
    { rate: "5%", items: "Household necessities, branded food items" },
    { rate: "12%", items: "Processed food, mobile phones" },
    { rate: "18%", items: "Most services, IT services, restaurants" },
    { rate: "28%", items: "Luxury items, automobiles, tobacco" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Taxation Information</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Complete guide to business taxation in India - GST, Income Tax, and compliance requirements
          </p>
        </div>

        <Tabs defaultValue="calculators" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculators">Tax Calculators</TabsTrigger>
            <TabsTrigger value="structures">Business Structures</TabsTrigger>
            <TabsTrigger value="gst">GST Guide</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="calculators" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <CardTitle className="dark:text-white">GST Calculator</CardTitle>
                  </div>
                  <CardDescription className="dark:text-gray-300">Calculate GST amount for your transactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Amount (₹)</label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={gstCalculator.amount || ''}
                      onChange={(e) => setGstCalculator(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      className="dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">GST Rate (%)</label>
                    <Input
                      type="number"
                      placeholder="18"
                      value={gstCalculator.gstRate}
                      onChange={(e) => setGstCalculator(prev => ({ ...prev, gstRate: parseFloat(e.target.value) || 18 }))}
                      className="dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between">
                      <span className="dark:text-gray-300">Base Amount:</span>
                      <span className="font-semibold dark:text-white">₹{gstCalculator.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dark:text-gray-300">GST Amount:</span>
                      <span className="font-semibold text-blue-600">₹{gstResult.gstAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="dark:text-gray-200">Total Amount:</span>
                      <span className="text-green-600">₹{gstResult.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <CardTitle className="dark:text-white">Income Tax Calculator</CardTitle>
                  </div>
                  <CardDescription className="dark:text-gray-300">Calculate your annual income tax liability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Annual Income (₹)</label>
                    <Input
                      type="number"
                      placeholder="Enter annual income"
                      value={incomeCalculator.income || ''}
                      onChange={(e) => setIncomeCalculator(prev => ({ ...prev, income: parseFloat(e.target.value) || 0 }))}
                      className="dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Deductions (₹)</label>
                    <Input
                      type="number"
                      placeholder="80C, HRA, etc."
                      value={incomeCalculator.deductions || ''}
                      onChange={(e) => setIncomeCalculator(prev => ({ ...prev, deductions: parseFloat(e.target.value) || 0 }))}
                      className="dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between">
                      <span className="dark:text-gray-300">Taxable Income:</span>
                      <span className="font-semibold dark:text-white">₹{incomeResult.taxableIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="dark:text-gray-200">Income Tax:</span>
                      <span className="text-red-600">₹{Math.round(incomeResult.tax).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="structures">
            <div className="grid gap-6">
              {businessStructures.map((structure, idx) => (
                <Card key={idx} className="dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="dark:text-white">{structure.name}</CardTitle>
                    <CardDescription className="dark:text-gray-300">{structure.taxation}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Advantages</h4>
                        <ul className="text-sm space-y-1">
                          {structure.pros.map((pro, i) => (
                            <li key={i} className="text-gray-600 dark:text-gray-300">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Disadvantages</h4>
                        <ul className="text-sm space-y-1">
                          {structure.cons.map((con, i) => (
                            <li key={i} className="text-gray-600 dark:text-gray-300">• {con}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">GST Threshold</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{structure.gstThreshold}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gst">
            <div className="space-y-6">
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">GST Rate Structure</CardTitle>
                  <CardDescription className="dark:text-gray-300">Current GST rates for different categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {gstRates.map((rate, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <Badge variant="outline" className="text-lg font-bold">{rate.rate}</Badge>
                        </div>
                        <div className="flex-1 ml-4">
                          <p className="text-gray-700 dark:text-gray-300">{rate.items}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <CardTitle className="dark:text-white">Monthly Compliance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="dark:text-gray-300">GST Return Filing (GSTR-1, GSTR-3B)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="dark:text-gray-300">TDS Return Filing (if applicable)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="dark:text-gray-300">ESI/PF Contributions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="dark:text-gray-300">Professional Tax Payment</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <CardTitle className="dark:text-white">Annual Compliance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="dark:text-gray-300">Income Tax Return Filing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="dark:text-gray-300">Annual GST Return (GSTR-9)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="dark:text-gray-300">Audit (if turnover {">"} threshold)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="dark:text-gray-300">MCA Annual Filing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Taxation;
