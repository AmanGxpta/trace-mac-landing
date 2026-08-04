import type { NextConfig } from "next";

const appcastHeaders = [
  { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
  { key: "Content-Type", value: "application/xml; charset=utf-8" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Sparkle's update feeds, written by scripts/publish.sh in the Trace
        // repo. These are the one pair of files whose whole job is to change:
        // if the CDN serves yesterday's appcast, every installed copy keeps
        // deciding it's up to date and the release reaches nobody — with no
        // error anywhere to notice it by. The zips they point at are immutable
        // (their URLs carry the build number), so only the feed needs this.
        source: "/appcast.xml",
        headers: appcastHeaders,
      },
      {
        source: "/appcast-beta.xml",
        headers: appcastHeaders,
      },
    ];
  },
};

export default nextConfig;
