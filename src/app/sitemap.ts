import { MetadataRoute } from "next";
import { getConvexClient } from "@/lib/convex";
import { api } from "../../convex/_generated/api";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const convex = getConvexClient();

  const [postSlugs, categorySlugs] = await Promise.all([
    convex.query(api.posts.listAllPublishedSlugs, {}),
    convex.query(api.categories.listAllSlugs, {}),
  ]);

  const baseUrl = "https://youcanjustgeneratethings.com";
  const baseUrl2 = "https://ycjgt.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: baseUrl2,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl2}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const postPages: MetadataRoute.Sitemap = postSlugs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...categoryPages];
}
