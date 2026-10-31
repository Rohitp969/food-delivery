const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount) => rupees.format(Number(amount) || 0);

export const formatNumber = (value) => (Number(value) || 0).toLocaleString("en-IN");

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const timeAgo = (value) => {
  const date = new Date(value);
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (Number.isNaN(seconds)) return "";
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(value);
};

export const initials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
};

// Short, human-friendly order reference from a Mongo id
export const orderRef = (id = "") => `#${String(id).slice(-6).toUpperCase()}`;

export const PERIODS = [
  { days: 7, short: "7D", label: "last 7 days" },
  { days: 30, short: "30D", label: "last 30 days" },
  { days: 90, short: "90D", label: "last 90 days" },
  { days: 365, short: "1Y", label: "last 12 months" },
];

export const periodLabel = (days) => PERIODS.find((p) => p.days === days)?.label || `last ${days} days`;

// Axis ticks: full numbers under 10,000, compact above
export const axisRupees = (value, max) => {
  if (max < 10000) return `₹${formatNumber(value)}`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 ? 1 : 0)}L`;
  return `₹${(value / 1000).toFixed(value % 1000 ? 1 : 0)}K`;
};

export const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
