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
    {
      url: `${SITE_URL}/slack`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Rarely read by people, and required by the Slack Marketplace listing —
    // which is reason enough for them to be crawlable and permanent.
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
