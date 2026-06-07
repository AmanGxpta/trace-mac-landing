"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fades its children in once they scroll into view, mirroring the
 * IntersectionObserver behaviour of the original prototype.
 */
export default function Reveal({
  className = "",
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Older browsers: just reveal on the next frame.
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            setShown(true);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={style}
      className={`reveal${shown ? " in" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
