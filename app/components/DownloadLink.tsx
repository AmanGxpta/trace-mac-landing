"use client";

import { sendGAEvent } from "@next/third-parties/google";

export default function DownloadLink({
  href,
  location,
  className,
  children,
}: {
  href: string;
  /** Where on the page this button lives — shows up in GA as the `location` param. */
  location: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      download
      className={className}
      onClick={() => sendGAEvent("event", "download_click", { location })}
    >
      {children}
    </a>
  );
}
