import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BeeIcon from "./BeeIcon";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already subscribed!", description: "This email is already on our list." });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Subscribed!", description: "You'll receive our latest updates." });
      }
      setEmail("");
    } catch (error: unknown) {
      toast({ title: "Error", description: (error as Error).message || "Failed to subscribe", variant: "destructive" });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="relative bg-foreground/95 dark:bg-card text-background dark:text-foreground overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BeeIcon className="w-9 h-9" />
              <div>
                <span className="font-bold text-lg">BizHive</span>
                <p className="text-xs text-primary">Business Growth Platform</p>
              </div>
            </div>
            <p className="text-background/70 dark:text-muted-foreground mb-4 text-sm">
              Empowering Indian entrepreneurs with comprehensive resources, tools, and guidance for business success.
            </p>
            <div className="space-y-2 text-sm text-background/70 dark:text-muted-foreground">
              <div className="flex items-center space-x-2"><Mail className="h-4 w-4" /><span>bizzhive.support@gmail.com</span></div>
              <div className="flex items-center space-x-2"><Phone className="h-4 w-4" /><span>+91 XXXXX XXXXX</span></div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary">Business Journey</h3>
            <ul className="space-y-2 text-sm text-background/70 dark:text-muted-foreground">
              <li><Link to="/plan" className="hover:text-background dark:hover:text-foreground transition-colors">Plan Your Business</Link></li>
              <li><Link to="/launch" className="hover:text-background dark:hover:text-foreground transition-colors">Launch Your Business</Link></li>
              <li><Link to="/manage" className="hover:text-background dark:hover:text-foreground transition-colors">Manage & Scale</Link></li>
              <li><Link to="/tools" className="hover:text-background dark:hover:text-foreground transition-colors">Business Tools</Link></li>
              <li><Link to="/taxation" className="hover:text-background dark:hover:text-foreground transition-colors">Taxation Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary">Resources</h3>
            <ul className="space-y-2 text-sm text-background/70 dark:text-muted-foreground">
              <li><Link to="/legal" className="hover:text-background dark:hover:text-foreground transition-colors">Legal Zone</Link></li>
              <li><Link to="/documents" className="hover:text-background dark:hover:text-foreground transition-colors">Document Library</Link></li>
              <li><Link to="/incubators" className="hover:text-background dark:hover:text-foreground transition-colors">Incubators & Funding</Link></li>
              <li><Link to="/community" className="hover:text-background dark:hover:text-foreground transition-colors">Community</Link></li>
              <li><Link to="/blog" className="hover:text-background dark:hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary">Stay Updated</h3>
            <p className="text-sm text-background/70 dark:text-muted-foreground mb-4">Subscribe for the latest business insights.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50 dark:bg-muted dark:border-border dark:text-foreground"
                required
              />
              <Button type="submit" className="w-full" disabled={subscribing}>
                {subscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <div className="mt-4">
              <Link to="/contact" className="text-sm text-primary hover:text-primary/80">Contact Us →</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 dark:border-border mt-8 pt-8 text-center text-sm text-background/60 dark:text-muted-foreground">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p>&copy; 2026 BizHive. All rights reserved.</p>
            <p>Designed & Developed by <a href="mailto:ghttushar2002@gmail.com" className="text-primary hover:text-primary/80 transition-colors">Tushar Gehlot</a></p>
          </div>
          <div className="mt-4 flex flex-wrap justify-center space-x-4 text-xs">
            <Link to="/privacy" className="hover:text-background dark:hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-background dark:hover:text-foreground">Terms of Service</Link>
            <Link to="/contact" className="hover:text-background dark:hover:text-foreground">Contact</Link>
            <Link to="/admin" className="hover:text-background dark:hover:text-foreground">Admin Panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
