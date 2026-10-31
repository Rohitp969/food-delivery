import React from "react";
import { NavLink } from "react-router-dom";
import StoreLayout from "../store/StoreLayout";
import { cx } from "../../lib/styles";

const TABS = [
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

// Customer account pages: store navbar on top, Profile / Settings tabs
const AccountShell = ({ title, description, children }) => (
  <StoreLayout>
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-[15px] text-muted">{description}</p>}
        <nav aria-label="Account" className="mt-6 mb-6 flex gap-1 border-b border-line">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cx(
                  "-mb-px border-b-2 px-3 pb-2.5 text-[15px] font-semibold no-underline transition-colors",
                  isActive ? "border-leaf text-ink" : "border-transparent text-muted hover:text-ink",
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      {children}
    </div>
  </StoreLayout>
);

export default AccountShell;
