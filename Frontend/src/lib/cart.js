export const FREE_DELIVERY_FROM = 499;
export const DELIVERY_FEE = 40;
export const GST_RATE = 0.05;

// Food options are stored as [{ Regular: 99 }] or { Regular: 99 }; returns { size: price }
export const parseOptions = (options) => {
  const result = {};
  const list = Array.isArray(options) ? options : [options];
  list.forEach((entry) => {
    if (entry && typeof entry === "object") {
      Object.entries(entry).forEach(([size, value]) => {
        const price = parseFloat(value);
        if (!Number.isNaN(price)) result[size] = price;
      });
    }
  });
  return result;
};

export const priceOf = (food) => {
  const sizes = parseOptions(food?.options);
  return food?.price ?? Object.values(sizes)[0] ?? 0;
};

// Same numbers on the cart and checkout pages
export const cartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const gst = Math.round(subtotal * GST_RATE);
  return {
    subtotal,
    delivery,
    gst,
    total: subtotal + delivery + gst,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    toFreeDelivery: Math.max(0, FREE_DELIVERY_FROM - subtotal),
  };
};

// Photos for the dish categories used across the menu
export const CATEGORY_IMAGES = {
  "Biryani/Rice": "/images/Biryani/Biryani2.jpg",
  Pizza: "/images/Pizza/pizza1.jpg",
  Burger: "/images/Burger/Burger1.jpg",
  Chinese: "/images/Chinese/Chinese1.jpg",
  "South Indian": "/images/South Indian/South Indian1.jpg",
  Starter: "/images/Starter/Starter1.jpg",
  Desserts: "/images/Dessts/Dessts1.jpg",
  Beverages: "/images/Beverages/Beverages1.jpg",
};
