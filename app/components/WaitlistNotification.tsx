"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";

interface WaitlistNotificationProps {
  title: string;
  message: string;
  onClose: () => void;
}

export default function WaitlistNotification({
  title,
  message,
  onClose,
}: WaitlistNotificationProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 6000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 right-5 z-[100] w-[min(360px,calc(100vw-2.5rem))] rounded-[12px] border border-line2 bg-[color-mix(in_oklab,var(--panel)_92%,transparent)] backdrop-blur-[14px] shadow-[0_20px_60px_-20px_rgba(0,0,0,.85)] p-4 animate-[slide-in-right_220ms_ease-out]"
    >
      <div className="flex items-start gap-3">
        <IoCheckmarkCircle
          className="text-accent shrink-0 mt-0.5"
          size={20}
          aria-hidden
        />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[14px] font-semibold text-ink">{title}</p>
          <p className="font-mono text-[12.5px] text-ink-dim mt-1 leading-[1.5]">
            {message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="text-ink-faint hover:text-ink transition-colors shrink-0"
        >
          <IoClose size={18} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
