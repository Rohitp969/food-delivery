const ORDER_STATUSES = ["Preparing", "Accepted", "Out For Delivery", "Delivered", "Cancelled"];

const parseOrderDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// Orders are stored as one document per customer email with an order_data
// array; this turns them into one flat object per order
const flattenOrders = (docs) =>
  docs.flatMap((doc) =>
    (doc.order_data || []).map((order, index) => ({
      id: String(order._id),
      orderId: String(doc._id),
      index,
      email: doc.email,
      date: parseOrderDate(order.order_date),
      totalAmount: Number(order.totalAmount || 0),
      paymentMethod: order.paymentMethod || "cod",
      paymentStatus: order.paymentStatus || "Pending",
      orderStatus: order.orderStatus || "Preparing",
      address: order.address || {},
      items: order.items || [],
    })),
  );

const sortNewestFirst = (orders) =>
  [...orders].sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

// Cancelled orders count as orders but never as revenue
const summarize = (orders) => {
  const billable = orders.filter((o) => o.orderStatus !== "Cancelled");
  const revenue = billable.reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    orders: orders.length,
    revenue,
    avgOrderValue: billable.length ? Math.round(revenue / billable.length) : 0,
    delivered: orders.filter((o) => o.orderStatus === "Delivered").length,
    cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length,
    active: orders.filter((o) => !["Delivered", "Cancelled"].includes(o.orderStatus)).length,
  };
};

const countBy = (orders, key, keys) => {
  const counts = Object.fromEntries(keys.map((k) => [k, 0]));
  orders.forEach((o) => {
    if (counts[o[key]] !== undefined) counts[o[key]] += 1;
  });
  return counts;
};

module.exports = {
  ORDER_STATUSES,
  flattenOrders,
  sortNewestFirst,
  summarize,
  countBy,
};
