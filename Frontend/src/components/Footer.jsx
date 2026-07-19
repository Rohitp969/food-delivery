import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍔</span>
              <span className="text-2xl font-bold text-white">GoFood</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Delivering happiness, one meal at a time. Fresh, delicious, and
              made just for you.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 text-gray-400 hover:text-white flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 text-gray-400 hover:text-white flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 text-gray-400 hover:text-white flex items-center justify-center transition"
                aria-label="Twitter"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 text-gray-400 hover:text-white flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <FaYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-green-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-green-400 transition">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-green-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-green-400 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-green-400 mt-0.5" />
                <span>123 Food Street, Mumbai, India</span>
              </li>
              <li className="flex items-start gap-3">
                <FaPhone className="text-green-400 mt-0.5" />
                <a href="tel:+919876543210" className="hover:text-green-400 transition">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-green-400 mt-0.5" />
                <a href="mailto:support@gofood.com" className="hover:text-green-400 transition">
                  support@gofood.com
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Working Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Mon – Fri</span>
                <span className="text-gray-400">10:00 AM – 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sat – Sun</span>
                <span className="text-gray-400">11:00 AM – 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Holidays</span>
                <span className="text-gray-400">Closed</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                📞 Order Now:{" "}
                <a href="tel:+919876543210" className="text-white hover:text-green-400 transition">
                  +91 98765 43210
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <span>
            &copy; {new Date().getFullYear()} GoFood. All rights reserved.
          </span>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link to="/privacy" className="hover:text-gray-300 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-300 transition">
              Terms of Service
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition cursor-pointer"
              aria-label="Scroll to top"
            >
              <FaArrowUp size={12} /> Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;