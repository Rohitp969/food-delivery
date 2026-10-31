import React from "react";
import { Link } from "react-router-dom";
import { cx } from "../lib/styles";

// Same mark as the customer navbar: burger + saffron wordmark on navy
const Logo = ({ to = "/", className, label = "GoFood" }) => (
  <Link
    to={to}
    className={cx(
      "inline-flex items-center gap-2 self-start rounded-lg bg-ink px-3 py-1.5 no-underline",
      className,
    )}
  >
    <span className="text-xl leading-none" aria-hidden="true">
      🍔
    </span>
    <span className="font-display text-lg font-bold tracking-tight text-saffron">{label}</span>
  </Link>
);

export default Logo;
