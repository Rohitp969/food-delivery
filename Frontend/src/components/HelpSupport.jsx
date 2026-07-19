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
  ShoppingBag,
  Truck,
  CreditCard,
  Gift,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const HelpSupport = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  // User-specific FAQs
  const faqs = [
    {
      id: 1,
      question: "How do I place an order?",
      answer:
        "Browse the menu → Select your food items → Choose size and quantity → Add to cart → Proceed to checkout → Enter delivery address → Select payment method → Place order. You'll receive a confirmation notification.",
    },
    {
      id: 2,
      question: "How can I track my order?",
      answer:
        "Go to 'My Orders' from the navbar → Click on your order → You'll see real-time status updates: Placed → Preparing → Cooking → Out for Delivery → Delivered.",
    },
    {
      id: 3,
      question: "What payment methods are available?",
      answer:
        "We accept Cash on Delivery (COD) and Online Payments via Razorpay (Credit/Debit Cards, UPI, Net Banking, and Wallet).",
    },
    {
      id: 4,
      question: "How to apply a coupon or promo code?",
      answer:
        "During checkout, you'll find a 'Enter Coupon' field. Enter your promo code and click 'Apply' to get discounts on your order.",
    },
    {
      id: 5,
      question: "How to cancel an order?",
      answer:
        "Go to 'My Orders' → Find the order you want to cancel → Click 'Cancel' (if available). Orders can only be cancelled before they are 'Out for Delivery'.",
    },
    {
      id: 6,
      question: "How to contact customer support?",
      answer:
        "You can reach us via Email (support@gofood.com), Phone (+91 1800-123-4567), or Live Chat (available 24/7) from this page.",
    },
    {
      id: 7,
      question: "How to update my profile information?",
      answer:
        "Go to 'My Profile' from the navbar or dropdown → Click 'Edit Profile' → Update your name, email, phone, location, or bio → Save changes.",
    },
    {
      id: 8,
      question: "What is the delivery charge?",
      answer:
        "Delivery is free for orders above ₹499. For orders below ₹499, a delivery fee of ₹40 is charged. GST (5%) is applicable on all orders.",
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContact = (method) => {
    toast.success(`Our support team will reach out via ${method}`);
  };

  return (
    <>
    <Navbar />
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1.5 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Help & Support
            </h1>
            <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
              Users
            </span>
          </div>
          <p className="text-gray-500 mt-2 ml-4">
            Find answers to common questions and contact our support team
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
            <ShoppingBag className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-700">8</p>
            <p className="text-xs text-gray-500">FAQ Articles</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
            <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-700">24/7</p>
            <p className="text-xs text-gray-500">Delivery Support</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
            <CreditCard className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700">6+</p>
            <p className="text-xs text-gray-500">Payment Methods</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200">
            <Gift className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-700">50+</p>
            <p className="text-xs text-gray-500">Offers Available</p>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <Mail size={24} />
            </div>
            <h3 className="font-semibold text-gray-800">Email Support</h3>
            <p className="text-sm text-gray-500 mt-1">support@gofood.com</p>
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
              Frequently Asked Questions
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
                <h3 className="font-bold text-gray-800">User Guide</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed guides on how to use GoFood.
                </p>
                <button className="mt-2 text-purple-600 hover:text-purple-700 font-medium text-sm">
                  Read Guide →
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
                  Watch step-by-step guides.
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
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Release Notes</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Latest updates and features.
                </p>
                <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  See Updates →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default HelpSupport;