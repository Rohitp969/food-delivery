import { useEffect, useState } from "react";
import { api } from "./api";

const POLL_MS = 60 * 1000;

// Count of orders still waiting to be accepted. Refreshes every minute and
// whenever a page fires the "orders-changed" event after updating an order.
export const useNewOrders = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    const refresh = () =>
      api("/api/admin/dashboard").then(
        (data) => active && setCount(data.statusCounts?.Preparing || 0),
        // The badge is a hint; a failed refresh just keeps the last value
        () => {},
      );

    refresh();
    const timer = setInterval(refresh, POLL_MS);
    window.addEventListener("orders-changed", refresh);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("orders-changed", refresh);
    };
  }, []);

  return count;
};

export const notifyOrdersChanged = () => window.dispatchEvent(new Event("orders-changed"));
