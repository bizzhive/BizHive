import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", message: "", category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        category: formData.category,
      });
      if (error) throw error;
      toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
      setFormData({ name: "", email: "", subject: "", message: "", category: "general" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send message", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, title: "Email Support", details: "bizzhive.support@gmail.com", description: "We respond within 24 hours" },
    { icon: Phone, title: "Phone Support", details: "+91 XXXXX XXXXX", description: "Mon-Fri, 9 AM - 6 PM IST" },
    { icon: Clock, title: "Business Hours", details: "Monday - Friday", description: "9:00 AM - 6:00 PM IST" },
  ];

  const faqItems = [
    { question: "How can I access premium features?", answer: "You can upgrade to premium by creating an account and choosing a subscription plan." },
    { question: "Is BizHive suitable for all business types?", answer: "Yes, BizHive supports all types of businesses across various industries." },
    { question: "Do you provide legal advice?", answer: "We provide legal information and guidance, but not personalized legal advice." },
    { question: "How accurate is the business planning information?", answer: "Our information is regularly updated and reviewed by business experts." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about starting your business? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                  Send us a Message
                </CardTitle>
                <CardDescription>Fill out the form and we'll get back to you.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" placeholder="Your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select id="category" className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="business">Business Consultation</option>
                      <option value="premium">Premium Features</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" placeholder="Brief description" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" placeholder="Please provide detailed information..." rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Multiple ways to reach us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg"><Icon className="h-5 w-5 text-primary" /></div>
                      <div>
                        <h3 className="font-semibold text-foreground">{info.title}</h3>
                        <p className="text-sm text-foreground">{info.details}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Answers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.map((faq, i) => (
                  <div key={i} className="border-b border-border pb-4 last:border-b-0">
                    <h4 className="font-medium text-foreground mb-2">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
