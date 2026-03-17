
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, DollarSign, FileText, Rocket, Users, Star, MapPin, Calendar, ArrowRight, TrendingUp, Target, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import FAQSection from "@/components/FAQSection";

import incubatorsDataFallback from "@/data/incubators.json";

const incubatorFAQs = [
  { question: "What is a startup incubator?", answer: "A startup incubator is an organization that helps early-stage companies grow by providing mentorship, resources, workspace, and sometimes funding. In India, many are supported by the government under programs like Atal Innovation Mission and Startup India." },
  { question: "How is an incubator different from an accelerator?", answer: "Incubators nurture early-stage startups over a longer period (6-24 months) with flexible structure. Accelerators are more intense, time-bound programs (3-6 months) focused on rapid growth, usually ending with a demo day for investors." },
  { question: "Do I need to give equity to join an incubator?", answer: "Not always. Government-backed incubators (IIT incubators, NASSCOM, etc.) often don't take equity. Private accelerators like Y Combinator or Techstars typically take 5-10% equity. Always read the terms carefully before joining." },
  { question: "What should I look for in an incubator?", answer: "Key factors: 1) Industry alignment with your startup, 2) Quality of mentors and network, 3) Track record of portfolio companies, 4) Funding connections, 5) Location and facilities, 6) Terms and equity requirements, 7) Alumni network strength." },
  { question: "How do I apply to an incubator?", answer: "Most accept applications online. Prepare: a clear problem statement, your solution, market size, team background, traction/progress, and what you need from the incubator. Apply to 5-10 relevant incubators simultaneously for best chances." },
];

const Incubators = () => {
  const [incubators, setIncubators] = useState(incubatorsDataFallback.incubators);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");

  useEffect(() => {
    // Simulate fetching from an external JSON endpoint
    const fetchIncubators = async () => {
      try {
        setLoading(true);
        // In a real app, this would be: await fetch('https://api.github.com/gists/...')
        // We simulate network delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 800));
        setIncubators(incubatorsDataFallback.incubators);
      } catch (error) {
        console.error("Failed to fetch incubators data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncubators();
  }, []);

  // Get unique values for filters
  const allStates = ["All", ...new Set(incubatorsDataFallback.incubators.map(i => i.state))];
  const allIndustries = ["All", ...new Set(incubatorsDataFallback.incubators.flatMap(i => i.industry))];
  const allStages = ["All", ...new Set(incubatorsDataFallback.incubators.flatMap(i => i.stage))];

  // Apply filters
  const filteredIncubators = incubators.filter(incubator => {
    const matchesSearch = incubator.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          incubator.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === "All" || incubator.state === selectedState;
    const matchesIndustry = selectedIndustry === "All" || incubator.industry.includes(selectedIndustry);
    const matchesStage = selectedStage === "All" || incubator.stage.includes(selectedStage);
    
    return matchesSearch && matchesState && matchesIndustry && matchesStage;
  });

  const fundingTypes = [
    {
      icon: Building,
      title: "Government Incubators",
      description: "Find government-backed incubators and accelerators",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      programs: ["Startup India", "MSME Schemes", "State Incubators", "Industry Specific"]
    },
    {
      icon: DollarSign,
      title: "Funding Opportunities", 
      description: "Explore government schemes and investor networks",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      programs: ["Seed Funding", "Series A/B", "Government Grants", "Angel Networks"]
    },
    {
      icon: FileText,
      title: "Pitch Preparation",
      description: "Tools and guides for investor presentations",
      color: "text-purple-600 dark:text-purple-400", 
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      programs: ["Pitch Decks", "Financial Models", "Demo Videos", "Business Plans"]
    }
  ];

  const fundingStages = [
    { stage: "Pre-Seed", range: "₹5L - ₹25L", focus: "Idea to MVP", investors: "Friends, Family, Angels" },
    { stage: "Seed", range: "₹25L - ₹2Cr", focus: "Product-Market Fit", investors: "Angel Networks, Micro VCs" },
    { stage: "Series A", range: "₹2Cr - ₹10Cr", focus: "Scale & Growth", investors: "VCs, Corporate VCs" },
    { stage: "Series B+", range: "₹10Cr+", focus: "Market Leadership", investors: "Large VCs, PE Firms" }
  ];

  const pitchTips = [
    "Start with a compelling problem statement",
    "Show market size and opportunity clearly", 
    "Demonstrate traction with real metrics",
    "Present a clear business model",
    "Showcase your team's expertise",
    "Include realistic financial projections"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-6 animate-bounce-in">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
            Incubators & Funding
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-up">
            Connect with top incubators, explore funding opportunities, and prepare winning pitches
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="mr-2 dark:border-gray-600">
              <Building className="h-3 w-3 mr-1" />
              500+ Incubators
            </Badge>
            <Badge variant="outline" className="mr-2 dark:border-gray-600">
              <DollarSign className="h-3 w-3 mr-1" />
              ₹100Cr+ Funding
            </Badge>
            <Badge variant="outline" className="dark:border-gray-600">
              <Users className="h-3 w-3 mr-1" />
              1000+ Startups
            </Badge>
          </div>
        </div>

        {/* Main Services */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16 stagger-animation">
          {fundingTypes.map((type, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 relative overflow-hidden">
              <div className={`absolute inset-0 ${type.bgColor} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 ${type.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <type.icon className={`h-7 w-7 ${type.color}`} />
                </div>
                <CardTitle className="text-xl dark:text-white">{type.title}</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  {type.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  {type.programs.map((program, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{program}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full group/btn" variant="outline">
                  Explore Options
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="incubators" className="w-full">
          <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800">
            <TabsTrigger value="incubators" className="dark:data-[state=active]:bg-gray-700">Top Incubators</TabsTrigger>
            <TabsTrigger value="funding" className="dark:data-[state=active]:bg-gray-700">Funding Stages</TabsTrigger>
            <TabsTrigger value="pitch" className="dark:data-[state=active]:bg-gray-700">Pitch Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="incubators" className="space-y-6">
            {/* Filters Section */}
            <Card className="dark:bg-gray-800 dark:border-gray-700 mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search incubators..." 
                      className="pl-9 dark:bg-gray-700 dark:border-gray-600"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {allStates.map(state => (
                        <SelectItem key={state} value={state}>{state === "All" ? "All States" : state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {allIndustries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry === "All" ? "All Industries" : industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStage} onValueChange={setSelectedStage}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {allStages.map(stage => (
                        <SelectItem key={stage} value={stage}>{stage === "All" ? "All Stages" : stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 stagger-animation">
              {loading ? (
                // Loading Skeletons
                Array(4).fill(0).map((_, i) => (
                  <Card key={i} className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 w-full">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full mt-4" />
                    </CardContent>
                  </Card>
                ))
              ) : filteredIncubators.length > 0 ? (
                filteredIncubators.map((incubator, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl dark:text-white mb-2">{incubator.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {incubator.location}
                            </span>
                            <Badge variant="outline" className="text-xs">{incubator.type}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium dark:text-yellow-500">{incubator.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-1">{incubator.description}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Focus Areas:</span>
                          <div className="flex flex-wrap gap-1">
                            {incubator.industry.slice(0, 3).map((ind, i) => (
                              <Badge key={i} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">{ind}</Badge>
                            ))}
                            {incubator.industry.length > 3 && (
                              <Badge variant="secondary" className="text-xs dark:bg-gray-700">+{incubator.industry.length - 3}</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 block">Stages</span>
                            <span className="text-sm font-medium dark:text-gray-200">{incubator.stage.join(", ")}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500 dark:text-gray-400 block">Funding</span>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">{incubator.funding}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-auto" variant="outline" onClick={() => window.open(incubator.website, '_blank')}>
                        Visit Website
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium dark:text-white">No incubators found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search query.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedState("All");
                      setSelectedIndustry("All");
                      setSelectedStage("All");
                    }}
                    className="mt-2"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="funding" className="space-y-6">
            <div className="grid gap-4">
              {fundingStages.map((stage, index) => (
                <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-4 items-center">
                      <div>
                        <h3 className="font-bold text-lg dark:text-white">{stage.stage}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{stage.focus}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stage.range}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Typical Range</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium dark:text-white">{stage.investors}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Investor Types</p>
                      </div>
                      <div className="text-center">
                        <Button variant="outline" size="sm">
                          Find Investors
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pitch" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Pitch Deck Essentials</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Key elements every successful pitch deck should include
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pitchTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{index + 1}</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Success Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">78%</div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Success Rate with Proper Preparation</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">₹2.5Cr</div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Average Funding Amount</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">45 Days</div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Average Time to Close</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Incubators;
