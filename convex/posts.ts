import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Queries remain the same...
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!post) return null;
    let category = null;
    if (post.categoryId) {
      category = await ctx.db.get(post.categoryId);
    }
    return { ...post, category };
  },
});

export const listPublished = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit);

    const postsWithCategories = await Promise.all(
      posts.map(async (post) => {
        let category = null;
        if (post.categoryId) {
          category = await ctx.db.get(post.categoryId);
        }
        return { ...post, category };
      })
    );
    return postsWithCategories;
  },
});

export const listByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .order("desc")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();

    const category = await ctx.db.get(args.categoryId);
    return { posts, category };
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    const postsWithCategories = await Promise.all(
      posts.map(async (post) => {
        let category = null;
        if (post.categoryId) {
          category = await ctx.db.get(post.categoryId);
        }
        return { ...post, category };
      })
    );
    return postsWithCategories;
  },
});

export const listAllPublishedSlugs = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    return posts.map((p) => ({
      slug: p.slug,
      updatedAt: p.updatedAt,
    }));
  },
});

// Public mutations for admin panel
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      throw new Error(`Post with slug "${args.slug}" already exists`);
    }
    const now = Date.now();
    return await ctx.db.insert("posts", {
      ...args,
      publishedAt: args.status === "published" ? (args.publishedAt ?? now) : undefined,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    featuredImageUrl: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Post not found");

    if (fields.slug && fields.slug !== existing.slug) {
      const slugCheck = await ctx.db
        .query("posts")
        .withIndex("by_slug", (q) => q.eq("slug", fields.slug!))
        .first();
      if (slugCheck) {
        throw new Error(`Slug "${fields.slug}" is already in use`);
      }
    }

    const updateData: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    if (fields.status === "published" && existing.status !== "published" && !fields.publishedAt) {
      updateData.publishedAt = Date.now();
    }

    await ctx.db.patch(id, updateData);
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Internal mutations for seeding
export const createInternal = internalMutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      throw new Error(`Post with slug "${args.slug}" already exists`);
    }
    const now = Date.now();
    return await ctx.db.insert("posts", {
      ...args,
      publishedAt: args.status === "published" ? (args.publishedAt ?? now) : undefined,
      updatedAt: now,
    });
  },
});

export const updateInternal = internalMutation({
  args: {
    id: v.id("posts"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    featuredImageUrl: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Post not found");

    if (fields.slug && fields.slug !== existing.slug) {
      const slugCheck = await ctx.db
        .query("posts")
        .withIndex("by_slug", (q) => q.eq("slug", fields.slug!))
        .first();
      if (slugCheck) {
        throw new Error(`Slug "${fields.slug}" is already in use`);
      }
    }

    const updateData: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    if (fields.status === "published" && existing.status !== "published" && !fields.publishedAt) {
      updateData.publishedAt = Date.now();
    }

    await ctx.db.patch(id, updateData);
  },
});

export const removeInternal = internalMutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
