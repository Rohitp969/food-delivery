// Order statuses in the order a kitchen moves through them
export const ORDER_FLOW = ["Preparing", "Accepted", "Out For Delivery", "Delivered"];
export const ORDER_STATUSES = [...ORDER_FLOW, "Cancelled"];

export const STATUS_META = {
  Preparing: { label: "New", tone: "bg-saffron-soft text-amber-800 ring-amber-200", dot: "bg-amber-500" },
  Accepted: { label: "Accepted", tone: "bg-sky-50 text-sky-800 ring-sky-200", dot: "bg-sky-500" },
  "Out For Delivery": { label: "Out for delivery", tone: "bg-violet-50 text-violet-800 ring-violet-200", dot: "bg-violet-500" },
  Delivered: { label: "Delivered", tone: "bg-leaf-soft text-leaf-dark ring-green-200", dot: "bg-leaf" },
  Cancelled: { label: "Cancelled", tone: "bg-danger-soft text-danger ring-red-200", dot: "bg-danger" },
};

// The one-click action that moves an order to its next step
export const NEXT_ACTION = {
  Preparing: { status: "Accepted", label: "Accept" },
  Accepted: { status: "Out For Delivery", label: "Send out" },
  "Out For Delivery": { status: "Delivered", label: "Mark delivered" },
};

export const PAYMENT_LABELS = {
  cod: "Cash on delivery",
  online: "Card / netbanking",
  upi: "UPI",
};
