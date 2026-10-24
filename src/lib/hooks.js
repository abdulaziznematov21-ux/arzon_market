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

// Global modal counter to prevent multiple modals breaking body overflow
let activeModalCount = 0;
let initialBodyOverflow = "";

export function lockScroll() {
  if (typeof document === "undefined") return;
  if (activeModalCount === 0) {
    initialBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  activeModalCount++;
}

export function unlockScroll() {
  if (typeof document === "undefined") return;
  activeModalCount = Math.max(0, activeModalCount - 1);
  if (activeModalCount === 0) {
    document.body.style.overflow = initialBodyOverflow || "unset";
  }
}

export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [locked]);
}

// Drawer/modal ochiq bo'lganda sahifa scrollini qulflaydi va Esc bilan yopadi
export function useOverlay(open, onClose) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
}
