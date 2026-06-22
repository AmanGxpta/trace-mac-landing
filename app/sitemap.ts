import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { changelog } from "@/lib/changelog";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/changelog`,
      // Reflects the latest release date so crawlers see real freshness.
      lastModified: new Date(`${changelog[0].date}T00:00:00`),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
