
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ES</span>
              </div>
              <span className="font-bold text-lg">Entrepreneurship Support</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering Indian entrepreneurs with comprehensive resources, tools, and guidance for business success.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@example.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Business Journey</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/plan" className="hover:text-white transition-colors">Plan Your Business</Link></li>
              <li><Link to="/launch" className="hover:text-white transition-colors">Launch Your Business</Link></li>
              <li><Link to="/manage" className="hover:text-white transition-colors">Manage & Scale</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/legal" className="hover:text-white transition-colors">Legal Zone</Link></li>
              <li><Link to="/incubators" className="hover:text-white transition-colors">Incubators & Funding</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Entrepreneurship Support Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
