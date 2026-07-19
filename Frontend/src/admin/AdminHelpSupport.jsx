import React, { useState } from "react";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Video,
  FileText,
  Shield,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminHelpSupport = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Admin-specific FAQs
  const faqs = [
    {
      id: 1,
      question: "How do I add a new food item?",
      answer:
        "Go to Food List → Click 'Add Food' → Fill in the details (name, category, price, image URL) and submit. The food item will appear in your menu instantly.",
    },
    {
      id: 2,
      question: "How can I manage customer orders?",
      answer:
        "Go to Orders → You can view all orders, update their status (Preparing, Accepted, Out for Delivery, Delivered, Cancelled), and generate invoices for each order.",
    },
    {
      id: 3,
      question: "How to view sales analytics?",
      answer:
        "Go to Sales → You'll see revenue overview, payment methods distribution, order statistics, and other analytics. You can filter by date range (7D, 30D, 90D, 1Y).",
    },
    {
      id: 4,
      question: "How to update user roles?",
      answer:
        "Go to Users → Find the user → Click Edit → Change the role from 'User' to 'Admin' or vice versa. Only Administrators can change user roles.",
    },
    {
      id: 5,
      question: "How to delete a food item?",
      answer:
        "Go to Food List → Click the Delete button (trash icon) next to the food item → Confirm deletion. This action cannot be undone.",
    },
    {
      id: 6,
      question: "How to generate an invoice for an order?",
      answer:
        "Go to Orders → Click the 'View' button on any order → In the order details modal, click 'Download Invoice PDF'. The invoice will be downloaded automatically.",
    },
    {
      id: 7,
      question: "How to manage admin settings?",
      answer:
        "Go to Settings → You can manage site name, tagline, currency, timezone, date format, notification settings, security settings, and change your password.",
    },
    {
      id: 8,
      question: "How to view dashboard stats?",
      answer:
        "Go to Dashboard → You'll see key metrics like Total Revenue, Total Orders, Delivered Orders, Cancelled Orders, and recent orders at a glance.",
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContact = (method) => {
    toast.success(`Admin support team will reach out via ${method}`);
  };

  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1.5 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Admin Help & Support
            </h1>
            <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
              Admin Only
            </span>
          </div>
          <p className="text-gray-500 mt-2 ml-4">
            Find answers to common questions and contact admin support team
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
            <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-700">8</p>
            <p className="text-xs text-gray-500">FAQ Articles</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-700">24/7</p>
            <p className="text-xs text-gray-500">Support Available</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
            <ShoppingBag className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700">100+</p>
            <p className="text-xs text-gray-500">Orders Managed</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200">
            <BarChart3 className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-700">Real-time</p>
            <p className="text-xs text-gray-500">Analytics</p>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <Mail size={24} />
            </div>
            <h3 className="font-semibold text-gray-800">Email Support</h3>
            <p className="text-sm text-gray-500 mt-1">admin@gofood.com</p>
            <button
              onClick={() => handleContact("email")}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Send Email →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 mx-auto flex items-center justify-center mb-3">
              <Phone size={24} />
            </div>
            <h3 className="font-semibold text-gray-800">Phone Support</h3>
            <p className="text-sm text-gray-500 mt-1">+91 1800-123-4567</p>
            <button
              onClick={() => handleContact("phone")}
              className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Call Now →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-3">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-semibold text-gray-800">Live Chat</h3>
            <p className="text-sm text-gray-500 mt-1">Available 24/7</p>
            <button
              onClick={() => handleContact("chat")}
              className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Start Chat →
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle size={20} className="text-purple-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Admin Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:border-purple-200 transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-medium text-gray-800">
                    {faq.question}
                  </span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp size={18} className="text-gray-400 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400 flex-shrink-0 ml-4" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-5 pb-4 text-gray-600 text-sm border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <BookOpen size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Admin Documentation</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed guides and API references for admins.
                </p>
                <button className="mt-2 text-purple-600 hover:text-purple-700 font-medium text-sm">
                  Read Docs →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Video size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Video Tutorials</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Watch step-by-step admin guides.
                </p>
                <button className="mt-2 text-green-600 hover:text-green-700 font-medium text-sm">
                  Watch Now →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Settings size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Admin Settings</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configure your admin panel settings.
                </p>
                <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Go to Settings →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHelpSupport;