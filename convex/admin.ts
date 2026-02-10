import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

const internalApi = internal as any;

function assertAdminToken(adminToken: string) {
  const expectedToken = process.env.CONVEX_ADMIN_API_TOKEN;
  if (!expectedToken) {
    throw new Error("Missing CONVEX_ADMIN_API_TOKEN environment variable");
  }
  if (adminToken !== expectedToken) {
    throw new Error("Unauthorized");
  }
}

export const createPost = action({
  args: {
    adminToken: v.string(),
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
    assertAdminToken(args.adminToken);
    const { adminToken, ...postArgs } = args;
    return await ctx.runMutation(internalApi.posts.createInternal, postArgs);
  },
});

export const updatePost = action({
  args: {
    adminToken: v.string(),
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
    assertAdminToken(args.adminToken);
    const { adminToken, ...postArgs } = args;
    await ctx.runMutation(internalApi.posts.updateInternal, postArgs);
  },
});

export const removePost = action({
  args: {
    adminToken: v.string(),
    id: v.id("posts"),
  },
  handler: async (ctx, args) => {
    assertAdminToken(args.adminToken);
    await ctx.runMutation(internalApi.posts.removeInternal, { id: args.id });
  },
});

export const createCategory = action({
  args: {
    adminToken: v.string(),
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertAdminToken(args.adminToken);
    const { adminToken, ...categoryArgs } = args;
    return await ctx.runMutation(
      internalApi.categories.createInternal,
      categoryArgs
    );
  },
});

export const updateCategory = action({
  args: {
    adminToken: v.string(),
    id: v.id("categories"),
    slug: v.optional(v.string()),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertAdminToken(args.adminToken);
    const { adminToken, ...categoryArgs } = args;
    await ctx.runMutation(internalApi.categories.updateInternal, categoryArgs);
  },
});

export const removeCategory = action({
  args: {
    adminToken: v.string(),
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    assertAdminToken(args.adminToken);
    await ctx.runMutation(internalApi.categories.removeInternal, {
      id: args.id,
    });
  },
});
