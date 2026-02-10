import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("asc").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const listAllSlugs = query({
  args: {},
  handler: async (ctx) => {
    const cats = await ctx.db.query("categories").collect();
    return cats.map((c) => ({ slug: c.slug }));
  },
});

// Public mutations for admin panel
export const create = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      throw new Error(`Category with slug "${args.slug}" already exists`);
    }
    return await ctx.db.insert("categories", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    slug: v.optional(v.string()),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Category not found");

    if (fields.slug && fields.slug !== existing.slug) {
      const slugCheck = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", fields.slug!))
        .first();
      if (slugCheck) {
        throw new Error(`Slug "${fields.slug}" is already in use`);
      }
    }

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    await ctx.db.patch(id, updateData);
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Internal mutations for seeding
export const createInternal = internalMutation({
  args: {
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      throw new Error(`Category with slug "${args.slug}" already exists`);
    }
    return await ctx.db.insert("categories", args);
  },
});

export const updateInternal = internalMutation({
  args: {
    id: v.id("categories"),
    slug: v.optional(v.string()),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Category not found");

    if (fields.slug && fields.slug !== existing.slug) {
      const slugCheck = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", fields.slug!))
        .first();
      if (slugCheck) {
        throw new Error(`Slug "${fields.slug}" is already in use`);
      }
    }

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    await ctx.db.patch(id, updateData);
  },
});

export const removeInternal = internalMutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
