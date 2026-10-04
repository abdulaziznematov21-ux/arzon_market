import { useEffect, useState } from "react";
export function useCountdown(start) {
  const [s, setS] = useState(start);
  useEffect(() => {
    const t = setInterval(() => setS((x) => (x > 0 ? x - 1 : start)), 1000);
    return () => clearInterval(t);
  }, [start]);
  const p = (n) => String(n).padStart(2, "0");
  return { h: p(Math.floor(s / 3600)), m: p(Math.floor((s % 3600) / 60)), s: p(s % 60) };
}
