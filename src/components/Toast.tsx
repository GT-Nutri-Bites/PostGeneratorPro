"use client";

import { useEffect, useRef } from "react";

export default function Toast({
  show,
  message,
}: {
  show: boolean;
  message: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      if (show) {
        ref.current.classList.add("show");
      } else {
        ref.current.classList.remove("show");
      }
    }
  }, [show]);

  return (
    <div className="toast" ref={ref}>
      <span>✓</span>
      <span>{message}</span>
    </div>
  );
}
