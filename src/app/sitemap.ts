import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, lastModified: new Date("2026-10-27"), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/privacy`, lastModified: new Date("2026-10-01"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
