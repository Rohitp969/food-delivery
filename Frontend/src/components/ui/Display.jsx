import React from "react";
import { cx } from "../../lib/styles";
import { initials } from "../../lib/format";
import { STATUS_META } from "../../lib/orders";

export const PageHeader = ({ title, description, actions }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[28px]">
        {title}
      </h1>
      {description && <p className="mt-1 max-w-2xl text-[15px] text-muted">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Panel = ({ title, description, actions, children, className, bodyClassName = "p-5" }) => (
  <section className={cx("rounded-xl border border-line bg-white", className)}>
    {(title || actions) && (
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="min-w-0">
          <h2 className="font-display text-[17px] font-semibold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
        {actions}
      </header>
    )}
    <div className={bodyClassName}>{children}</div>
  </section>
);

export const EmptyState = ({ icon: Icon, title, description, action, className }) => (
  <div className={cx("flex flex-col items-center px-6 py-14 text-center", className)}>
    {Icon && (
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-muted">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
    )}
    <p className="font-semibold text-ink">{title}</p>
    {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const Skeleton = ({ className }) => (
  <div className={cx("animate-pulse rounded-md bg-slate-200/70", className)} aria-hidden="true" />
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="divide-y divide-line" role="status" aria-label="Loading">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex items-center gap-4 px-5 py-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-1/5" />
        </div>
        <Skeleton className="hidden h-3.5 w-20 sm:block" />
      </div>
    ))}
  </div>
);

const AVATAR_SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
};

export const Avatar = ({ name, src, size = "md", className }) =>
  src ? (
    <img
      src={src}
      alt=""
      className={cx("shrink-0 rounded-full object-cover", AVATAR_SIZES[size], className)}
    />
  ) : (
    <span
      aria-hidden="true"
      className={cx(
        "flex shrink-0 items-center justify-center rounded-full bg-ink font-display font-semibold text-saffron",
        AVATAR_SIZES[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );

export const StatusBadge = ({ status, label, className }) => {
  const meta = STATUS_META[status] || STATUS_META.Preparing;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        meta.tone,
        className,
      )}
    >
      <span className={cx("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden="true" />
      {label || meta.label}
    </span>
  );
};

export const Badge = ({ children, tone = "neutral", className }) => {
  const tones = {
    neutral: "bg-canvas text-muted ring-line",
    leaf: "bg-leaf-soft text-leaf-dark ring-green-200",
    ink: "bg-ink text-white ring-ink",
    warn: "bg-saffron-soft text-amber-800 ring-amber-200",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
};
