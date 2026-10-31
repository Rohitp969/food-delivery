import React from "react";
import { Loader2 } from "lucide-react";
import { buttonStyles, cx } from "../../lib/styles";

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  children,
  className,
  type = "button",
  disabled,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={cx(buttonStyles(variant, size), className)}
    {...props}
  >
    {loading ? (
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    ) : (
      Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
    )}
    {children}
  </button>
);

export default Button;
