import { MetadataRoute } from "next";
import { getConvexClient } from "@/lib/convex";
import { SITE_URL } from "@/lib/site-url";
import { api } from "../../convex/_generated/api";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const convex = getConvexClient();

  const [postSlugs, categorySlugs] = await Promise.all([
    convex.query(api.posts.listAllPublishedSlugs, {}),
    convex.query(api.categories.listAllSlugs, {}),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const postPages: MetadataRoute.Sitemap = postSlugs.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((cat) => ({
    url: `${SITE_URL}/blog/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...categoryPages];
}
