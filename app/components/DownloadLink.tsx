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
  const fileName = href.split("/").pop() ?? "Trace-Installer.dmg";

  return (
    <a
      href={href}
      download
      className={className}
      onClick={() =>
        sendGAEvent("event", "download_click", {
          location,
          file_name: fileName,
          file_extension: "dmg",
          link_url: href,
        })
      }
    >
      {children}
    </a>
  );
}
