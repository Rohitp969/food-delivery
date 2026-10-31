import React from "react";
import { Minus, Plus } from "lucide-react";
import { cx } from "../../lib/styles";

const QtyStepper = ({ qty, onIncrease, onDecrease, label, size = "md", className }) => (
  <div
    className={cx(
      "inline-flex items-center rounded-lg bg-white ring-1 ring-inset ring-leaf/40",
      size === "sm" ? "h-8" : "h-9",
      className,
    )}
  >
    <button
      type="button"
      onClick={onDecrease}
      aria-label={qty === 1 ? `Remove ${label}` : `One less ${label}`}
      className="flex h-full w-8 items-center justify-center rounded-l-lg text-leaf hover:bg-leaf-soft"
    >
      <Minus className="h-4 w-4" />
    </button>
    <span className="tabular min-w-7 text-center text-sm font-bold text-ink" aria-live="polite">
      {qty}
    </span>
    <button
      type="button"
      onClick={onIncrease}
      aria-label={`One more ${label}`}
      className="flex h-full w-8 items-center justify-center rounded-r-lg text-leaf hover:bg-leaf-soft"
    >
      <Plus className="h-4 w-4" />
    </button>
  </div>
);

export default QtyStepper;
