
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Edit, FileText, Shield, Building, Users, DollarSign, Bookmark, Filter } from "lucide-react";

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const documentCategories = [
    { id: "all", name: "All Documents", count: 500 },
    { id: "legal", name: "Legal & Compliance", count: 150, icon: Shield },
    { id: "business", name: "Business Registration", count: 80, icon: Building },
    { id: "financial", name: "Financial & Tax", count: 120, icon: DollarSign },
    { id: "hr", name: "HR & Employment", count: 90, icon: Users },
    { id: "contracts", name: "Contracts & Agreements", count: 60, icon: FileText },
  ];

  const featuredDocuments = [
    {
      id: 1,
      title: "GST Registration Application",
      description: "Complete form for Goods and Services Tax registration with step-by-step guide",
      category: "financial",
      type: "Form",
      premium: false,
      downloads: 2500,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Private Limited Company Incorporation Kit",
      description: "Complete set of documents for company incorporation including MOA, AOA, and forms",
      category: "business",
      type: "Bundle",
      premium: true,
      downloads: 1800,
      rating: 4.9,
    },
    {
      id: 3,
      title: "Employment Contract Template",
      description: "Comprehensive employment agreement template compliant with Indian labor laws",
      category: "hr",
      type: "Template",
      premium: true,
      downloads: 3200,
      rating: 4.7,
    },
    {
      id: 4,
      title: "FSSAI License Application",
      description: "Food Safety and Standards Authority license application with required documents checklist",
      category: "legal",
      type: "Form",
      premium: false,
      downloads: 1500,
      rating: 4.6,
    },
    {
      id: 5,
      title: "Non-Disclosure Agreement (NDA)",
      description: "Mutual and unilateral NDA templates for protecting confidential business information",
      category: "contracts",
      type: "Template",
      premium: true,
      downloads: 2100,
      rating: 4.8,
    },
    {
      id: 6,
      title: "Trademark Registration Guide",
      description: "Complete guide and forms for trademark registration in India with examples",
      category: "legal",
      type: "Guide",
      premium: false,
      downloads: 900,
      rating: 4.5,
    },
  ];

  const filteredDocuments = featuredDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (docId: number, isPremium: boolean) => {
    if (isPremium) {
      // Redirect to login or show premium modal
      alert("This is a premium document. Please upgrade your account to access.");
    } else {
      console.log(`Downloading document ${docId}`);
    }
  };

  const handleEdit = (docId: number, isPremium: boolean) => {
    if (isPremium) {
      alert("Premium feature: Edit documents online with our interactive editor.");
    } else {
      console.log(`Opening editor for document ${docId}`);
    }
  };

  const handleRequestDocument = () => {
    // Handle document request
    alert("Document request submitted! We'll add it to our library soon.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Document Library</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access 500+ legal templates, business forms, and compliance documents. 
            Download instantly or edit online with our interactive tools.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search documents, forms, templates..."
                className="pl-10 text-lg h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="px-4 py-2 border rounded-md bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {documentCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {searchQuery && filteredDocuments.length === 0 && (
            <div className="mt-6 text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any documents matching "{searchQuery}"
              </p>
              <Button onClick={handleRequestDocument} variant="outline">
                Request This Document
              </Button>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {documentCategories.slice(1).map(category => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCategory === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs text-gray-500">{category.count} docs</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Documents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">{doc.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={doc.premium ? "default" : "secondary"}>
                        {doc.premium ? "Premium" : "Free"}
                      </Badge>
                      <Badge variant="outline">{doc.type}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{doc.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{doc.downloads.toLocaleString()} downloads</span>
                  <span className="flex items-center">
                    ★ {doc.rating} rating
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload(doc.id, doc.premium)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEdit(doc.id, doc.premium)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Request Document Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our team is constantly adding new documents. Request any business document and we'll create it for you.
          </p>
          <Button onClick={handleRequestDocument} variant="secondary" size="lg">
            Request a Document
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Documents;
