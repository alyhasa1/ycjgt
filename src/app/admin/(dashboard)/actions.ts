"use server";

import type { Id } from "../../../../convex/_generated/dataModel";
import { verifySession } from "@/lib/auth";
import {
  adminCreateCategory,
  adminCreatePost,
  adminRemoveCategory,
  adminRemovePost,
  adminUpdateCategory,
  adminUpdatePost,
} from "@/lib/convex-admin";

type ActionResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
    };

function toOptionalString(value?: string): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

async function requireAdminSession() {
  const isAuthenticated = await verifySession();
  if (!isAuthenticated) {
    throw new Error("Unauthorized");
  }
}

export type AdminPostActionInput = {
  id?: string;
  slug?: string;
  title?: string;
  seoTitle?: string;
  metaDescription?: string;
  content?: string;
  excerpt?: string;
  featuredImageUrl?: string;
  categoryId?: string;
  tags?: string[];
  status?: "draft" | "published";
  publishedAt?: number;
};

export type AdminCategoryActionInput = {
  id?: string;
  slug?: string;
  name?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export async function createPostAction(
  input: AdminPostActionInput
): Promise<ActionResult> {
  try {
    await requireAdminSession();
    if (!input.slug || !input.title || !input.content || !input.status) {
      return { ok: false, error: "Missing required post fields" };
    }

    await adminCreatePost({
      slug: input.slug,
      title: input.title,
      seoTitle: toOptionalString(input.seoTitle),
      metaDescription: toOptionalString(input.metaDescription),
      content: input.content,
      excerpt: toOptionalString(input.excerpt),
      featuredImageUrl: toOptionalString(input.featuredImageUrl),
      categoryId: input.categoryId
        ? (input.categoryId as Id<"categories">)
        : undefined,
      tags: input.tags && input.tags.length > 0 ? input.tags : undefined,
      status: input.status,
      publishedAt: input.publishedAt,
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }
}

export async function updatePostAction(
  input: AdminPostActionInput
): Promise<ActionResult> {
  try {
    await requireAdminSession();
    if (!input.id) {
      return { ok: false, error: "Missing post id" };
    }

    await adminUpdatePost({
      id: input.id as Id<"posts">,
      slug: toOptionalString(input.slug),
      title: toOptionalString(input.title),
      seoTitle: toOptionalString(input.seoTitle),
      metaDescription: toOptionalString(input.metaDescription),
      content: toOptionalString(input.content),
      excerpt: toOptionalString(input.excerpt),
      featuredImageUrl: toOptionalString(input.featuredImageUrl),
      categoryId: input.categoryId
        ? (input.categoryId as Id<"categories">)
        : undefined,
      tags: input.tags && input.tags.length > 0 ? input.tags : undefined,
      status: input.status,
      publishedAt: input.publishedAt,
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update post",
    };
  }
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  try {
    await requireAdminSession();
    await adminRemovePost(id as Id<"posts">);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to delete post",
    };
  }
}

export async function createCategoryAction(
  input: AdminCategoryActionInput
): Promise<ActionResult> {
  try {
    await requireAdminSession();
    if (!input.slug || !input.name) {
      return { ok: false, error: "Missing required category fields" };
    }

    await adminCreateCategory({
      slug: input.slug,
      name: input.name,
      description: toOptionalString(input.description),
      metaTitle: toOptionalString(input.metaTitle),
      metaDescription: toOptionalString(input.metaDescription),
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

export async function updateCategoryAction(
  input: AdminCategoryActionInput
): Promise<ActionResult> {
  try {
    await requireAdminSession();
    if (!input.id) {
      return { ok: false, error: "Missing category id" };
    }

    await adminUpdateCategory({
      id: input.id as Id<"categories">,
      slug: toOptionalString(input.slug),
      name: toOptionalString(input.name),
      description: toOptionalString(input.description),
      metaTitle: toOptionalString(input.metaTitle),
      metaDescription: toOptionalString(input.metaDescription),
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    await requireAdminSession();
    await adminRemoveCategory(id as Id<"categories">);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
