import React from "react";
import { Link } from "react-router-dom";
import { getSession } from "../lib/session";

const Footer = () => {
  const loggedIn = Boolean(getSession().token);

  const columns = [
    {
      title: "Order",
      links: [
        { to: "/", label: "Restaurants" },
        { to: "/cart", label: "Cart" },
        { to: "/wishlist", label: "Saved dishes" },
      ],
    },
    {
      title: "Account",
      links: loggedIn
        ? [
            { to: "/profile", label: "Your account" },
            { to: "/myorder", label: "My orders" },
            { to: "/settings", label: "Settings" },
          ]
        : [
            { to: "/login", label: "Log in" },
            { to: "/signup", label: "Create an account" },
            { to: "/forgot-password", label: "Reset password" },
          ],
    },
    {
      title: "Support",
      links: [{ to: "/help", label: "Help and FAQs" }],
    },
  ];

  return (
    <footer className="bg-ink text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)] lg:px-8">
        <div className="col-span-2 max-w-xs md:col-span-1">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <span className="text-2xl" aria-hidden="true">
              🍔
            </span>
            <span className="font-display text-xl font-bold text-saffron">GoFood</span>
          </Link>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-400">
            Food from your favourite local restaurants, delivered hot. Pay online or with cash at the door.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-semibold text-white">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[15px] text-slate-400 no-underline hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-sm text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} GoFood. Payments are processed securely by Razorpay.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
