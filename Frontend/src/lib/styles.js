export const cx = (...classes) => classes.filter(Boolean).join(" ");

const BUTTON_VARIANTS = {
  primary: "bg-leaf text-white hover:bg-leaf-dark disabled:bg-leaf/50",
  secondary: "bg-white text-ink ring-1 ring-inset ring-line hover:bg-canvas disabled:text-muted disabled:opacity-60 disabled:hover:bg-white",
  ghost: "text-ink hover:bg-canvas disabled:text-muted",
  danger: "bg-danger text-white hover:bg-red-800 disabled:bg-danger/50",
  "danger-ghost": "text-danger hover:bg-danger-soft disabled:opacity-50",
};

const BUTTON_SIZES = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-[15px] gap-2",
  icon: "h-9 w-9 justify-center",
};

export const buttonStyles = (variant = "primary", size = "md") =>
  cx(
    "inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed",
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
  );

export const inputStyles = (invalid) =>
  cx(
    "block w-full rounded-lg border bg-white px-3 text-[15px] text-ink placeholder:text-muted/70 transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-leaf/25 focus:border-leaf",
    "disabled:bg-canvas disabled:text-muted",
    invalid ? "border-danger" : "border-line hover:border-slate-300",
  );
