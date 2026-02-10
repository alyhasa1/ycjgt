import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    slug: v.string(),
    title: v.string(),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    content: v.string(),
    excerpt: v.optional(v.string()),
    featuredImageUrl: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    tags: v.optional(v.array(v.string())),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_category", ["categoryId"])
    .index("by_published", ["status", "publishedAt"]),

  categories: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  }).index("by_slug", ["slug"]),
});
