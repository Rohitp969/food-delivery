import { useEffect, useState } from "react";

// Seconds left until something (like "Resend code") is allowed again
export const useCountdown = (initial = 0) => {
  const [seconds, setSeconds] = useState(initial);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return [seconds, setSeconds];
};
