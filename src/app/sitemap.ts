import type { MetadataRoute } from "next";
import { navigation } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.SITE_URL?.replace(/\/$/, "");
  if (!origin) return [];
  return ["/", ...navigation.map((item) => item.href)].map((path) => ({
    url: `${origin}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
