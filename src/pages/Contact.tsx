
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "", category: "general" });
  };

  const contactInfo = [
    { icon: Mail, title: "Email Support", details: "support@bizhive.com", description: "We respond within 24 hours" },
    { icon: Phone, title: "Phone Support", details: "+91 XXXXX XXXXX", description: "Mon-Fri, 9 AM - 6 PM IST" },
    { icon: MapPin, title: "Office Address", details: "Mumbai, Maharashtra, India", description: "By appointment only" },
    { icon: Clock, title: "Business Hours", details: "Monday - Friday", description: "9:00 AM - 6:00 PM IST" }
  ];

  const faqItems = [
    { question: "How can I access premium features?", answer: "You can upgrade to premium by creating an account and choosing a subscription plan. Premium features include document templates, community access, and incubator matching." },
    { question: "Is BizHive suitable for all business types?", answer: "Yes, BizHive supports all types of businesses - from sole proprietorships to private limited companies across various industries." },
    { question: "Do you provide legal advice?", answer: "We provide legal information and guidance, but not personalized legal advice. For specific legal matters, we recommend consulting with a qualified lawyer." },
    { question: "How accurate is the business planning information?", answer: "Our information is regularly updated and reviewed by business experts. However, regulations can change, so we recommend verifying current requirements with official sources." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions about starting your business? Need help with our platform? 
            We're here to support your entrepreneurial journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-white">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Send us a Message
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="dark:text-gray-200">Full Name *</Label>
                      <Input id="name" type="text" placeholder="Your full name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="dark:text-gray-200">Email Address *</Label>
                      <Input id="email" type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="dark:text-gray-200">Category</Label>
                    <select id="category" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background dark:bg-gray-700 dark:text-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="business">Business Consultation</option>
                      <option value="premium">Premium Features</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="dark:text-gray-200">Subject *</Label>
                    <Input id="subject" type="text" placeholder="Brief description of your inquiry" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="dark:text-gray-200">Message *</Label>
                    <Textarea id="message" placeholder="Please provide detailed information about your inquiry..." rows={6} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400" />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Get in Touch</CardTitle>
                <CardDescription className="dark:text-gray-300">Multiple ways to reach our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{info.title}</h3>
                        <p className="text-sm text-gray-900 dark:text-gray-200">{info.details}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Quick Answers</CardTitle>
                <CardDescription className="dark:text-gray-300">Common questions from entrepreneurs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">Response Time</h2>
          <p className="text-blue-700 dark:text-blue-300">
            We typically respond to all inquiries within 24 hours during business days. 
            For urgent matters, please call our support line.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
