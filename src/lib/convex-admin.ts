import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const adminApi = api as any;

function getConvexUrl(): string {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
  }
  return convexUrl;
}

function getAdminToken(): string {
  const adminToken = process.env.CONVEX_ADMIN_API_TOKEN;
  if (!adminToken) {
    throw new Error("Missing CONVEX_ADMIN_API_TOKEN environment variable");
  }
  return adminToken;
}

function getAdminClient() {
  return new ConvexHttpClient(getConvexUrl());
}

export type AdminPostCreateInput = {
  slug: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  content: string;
  excerpt?: string;
  featuredImageUrl?: string;
  categoryId?: Id<"categories">;
  tags?: string[];
  status: "draft" | "published";
  publishedAt?: number;
};

export type AdminPostUpdateInput = {
  id: Id<"posts">;
  slug?: string;
  title?: string;
  seoTitle?: string;
  metaDescription?: string;
  content?: string;
  excerpt?: string;
  featuredImageUrl?: string;
  categoryId?: Id<"categories">;
  tags?: string[];
  status?: "draft" | "published";
  publishedAt?: number;
};

export type AdminCategoryCreateInput = {
  slug: string;
  name: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type AdminCategoryUpdateInput = {
  id: Id<"categories">;
  slug?: string;
  name?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export async function adminCreatePost(input: AdminPostCreateInput) {
  const client = getAdminClient();
  return await client.action(adminApi.admin.createPost, {
    adminToken: getAdminToken(),
    ...input,
  });
}

export async function adminUpdatePost(input: AdminPostUpdateInput) {
  const client = getAdminClient();
  await client.action(adminApi.admin.updatePost, {
    adminToken: getAdminToken(),
    ...input,
  });
}

export async function adminRemovePost(id: Id<"posts">) {
  const client = getAdminClient();
  await client.action(adminApi.admin.removePost, {
    adminToken: getAdminToken(),
    id,
  });
}

export async function adminCreateCategory(input: AdminCategoryCreateInput) {
  const client = getAdminClient();
  return await client.action(adminApi.admin.createCategory, {
    adminToken: getAdminToken(),
    ...input,
  });
}

export async function adminUpdateCategory(input: AdminCategoryUpdateInput) {
  const client = getAdminClient();
  await client.action(adminApi.admin.updateCategory, {
    adminToken: getAdminToken(),
    ...input,
  });
}

export async function adminRemoveCategory(id: Id<"categories">) {
  const client = getAdminClient();
  await client.action(adminApi.admin.removeCategory, {
    adminToken: getAdminToken(),
    id,
  });
}
