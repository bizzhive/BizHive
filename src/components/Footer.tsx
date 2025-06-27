
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-8 h-8">
                <svg viewBox="0 0 32 32" className="w-8 h-8">
                  <defs>
                    <pattern id="honeycombFooter" x="0" y="0" width="8" height="7" patternUnits="userSpaceOnUse">
                      <polygon points="4,0 8,2.3 8,4.7 4,7 0,4.7 0,2.3" fill="#3B82F6" stroke="#60A5FA" strokeWidth="0.3"/>
                    </pattern>
                  </defs>
                  <circle cx="16" cy="16" r="14" fill="url(#honeycombFooter)"/>
                </svg>
              </div>
              <div>
                <span className="font-bold text-lg">BizHive</span>
                <p className="text-xs text-blue-400">Business Growth Platform</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Empowering Indian entrepreneurs with comprehensive resources, tools, and guidance for business success. From planning to scaling, we're your trusted partner in the entrepreneurial journey.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@bizhive.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 XXXXX XXXXX</span>
              </div>
            </div>
          </div>

          {/* Business Journey */}
          <div>
            <h3 className="font-semibold mb-4 text-blue-400">Business Journey</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/plan" className="hover:text-white transition-colors">Plan Your Business</Link></li>
              <li><Link to="/launch" className="hover:text-white transition-colors">Launch Your Business</Link></li>
              <li><Link to="/manage" className="hover:text-white transition-colors">Manage & Scale</Link></li>
              <li><Link to="/tools" className="hover:text-white transition-colors">Business Tools</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-blue-400">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/legal" className="hover:text-white transition-colors">Legal Zone</Link></li>
              <li><Link to="/documents" className="hover:text-white transition-colors">Document Library</Link></li>
              <li><Link to="/incubators" className="hover:text-white transition-colors">Incubators & Funding</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-blue-400">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest business insights and updates.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </form>
            <div className="mt-4">
              <Link to="/contact" className="text-sm text-blue-400 hover:text-blue-300">Contact Us →</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p>© 2024 BizHive - Business Growth Platform. All rights reserved.</p>
            <p>Designed by <span className="text-blue-400">Tushar Gehlot</span></p>
          </div>
          <div className="mt-4 flex flex-wrap justify-center space-x-4 text-xs">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/refund" className="hover:text-white">Refund Policy</Link>
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
