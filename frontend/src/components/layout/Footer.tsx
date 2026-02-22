import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zed-green-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-zed-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="text-xl font-bold">
                Zed<span className="text-zed-orange">Flip</span>
              </span>
            </Link>
            <p className="text-gray-300 text-sm mb-4">
              Zambia's trusted marketplace for buying and selling second-hand items.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-zed-orange transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-zed-orange transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-zed-orange transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-gray-300 hover:text-zed-orange transition-colors">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-300 hover:text-zed-orange transition-colors">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link to="/search?category=electronics" className="text-gray-300 hover:text-zed-orange transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/search?category=vehicles" className="text-gray-300 hover:text-zed-orange transition-colors">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link to="/search?category=fashion" className="text-gray-300 hover:text-zed-orange transition-colors">
                  Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-zed-orange transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-zed-orange transition-colors">
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-zed-orange transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-zed-orange transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-zed-orange transition-colors">
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-zed-orange" />
                <span>Lusaka, Zambia</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-zed-orange" />
                <span>+260 97 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-zed-orange" />
                <span>support@zedflip.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} ZedFlip. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ in Zambia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
