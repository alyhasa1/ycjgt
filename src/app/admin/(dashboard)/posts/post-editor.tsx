"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Save, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { createPostAction, updatePostAction } from "../actions";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface PostData {
  _id?: Id<"posts">;
  title: string;
  slug: string;
  seoTitle: string;
  metaDescription: string;
  content: string;
  excerpt: string;
  featuredImageUrl: string;
  categoryId: string;
  tags: string;
  status: "draft" | "published";
}

export function PostEditor({ postId }: { postId?: Id<"posts"> }) {
  const router = useRouter();
  const categories = useQuery(api.categories.list);
  // For new posts, we don't need to fetch existing data
  // Edit uses PostEditorWithData which loads data separately

  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [form, setForm] = useState<PostData>({
    title: "",
    slug: "",
    seoTitle: "",
    metaDescription: "",
    content: "",
    excerpt: "",
    featuredImageUrl: "",
    categoryId: "",
    tags: "",
    status: "draft",
  });

  const [loadedPost, setLoadedPost] = useState(false);

  // Load existing post data if editing
  useEffect(() => {
    if (postId && !loadedPost) {
      // We'll load this via a different mechanism
    }
  }, [postId, loadedPost]);

  const updateField = (field: keyof PostData, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && autoSlug) {
        updated.slug = slugify(value);
      }
      return updated;
    });
    if (field === "slug") {
      setAutoSlug(false);
    }
  };

  const handleSave = async (status?: "draft" | "published") => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      const postData = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        seoTitle: form.seoTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        content: form.content,
        excerpt: form.excerpt || form.content.slice(0, 200).replace(/[#*_\[\]]/g, "") + "...",
        featuredImageUrl: form.featuredImageUrl || undefined,
        categoryId: form.categoryId
          ? (form.categoryId as Id<"categories">)
          : undefined,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : undefined,
        status: (status || form.status) as "draft" | "published",
      };

      const result = postId
        ? await updatePostAction({ id: postId, ...postData })
        : await createPostAction(postData);

      if (!result.ok) {
        alert(result.error);
        return;
      }

      if (postId) {
        router.push("/admin/posts");
      } else {
        router.push("/admin/posts");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {postId ? "Edit Post" : "New Post"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            <Eye size={16} />
            {showPreview ? "Editor" : "Preview"}
          </button>
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors text-sm disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4FC3F7] to-[#039BE5] text-white font-semibold hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Post title"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]/50 focus:border-[#4FC3F7]"
          />

          {/* Slug */}
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-sm">/blog/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="post-slug"
              className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
            />
          </div>

          {/* Content */}
          {showPreview ? (
            <div className="min-h-[500px] p-6 rounded-xl bg-white/5 border border-white/10">
              <MarkdownRenderer content={form.content} />
            </div>
          ) : (
            <textarea
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Write your post in Markdown...\n\nTo embed videos, use: [Video caption](https://your-video-url.mp4)\n\nTo embed images, use: ![Alt text](https://your-image-url.png)"
              rows={24}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 text-sm font-mono placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]/50 focus:border-[#4FC3F7] resize-y"
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* SEO Title */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-white font-semibold text-sm">SEO Settings</h3>
            <div>
              <label className="text-white/50 text-xs mb-1 block">
                SEO Title Override
              </label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => updateField("seoTitle", e.target.value)}
                placeholder={form.title || "Auto from title"}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 flex justify-between">
                <span>Meta Description</span>
                <span
                  className={
                    form.metaDescription.length > 155
                      ? "text-red-400"
                      : "text-white/30"
                  }
                >
                  {form.metaDescription.length}/155
                </span>
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                placeholder="Brief description for search results..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50 resize-none"
              />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-white font-semibold text-sm">Organization</h3>
            <div>
              <label className="text-white/50 text-xs mb-1 block">
                Category
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => updateField("categoryId", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
              >
                <option value="">No category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                placeholder="ai, video, seedance"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-white font-semibold text-sm">Featured Image</h3>
            <input
              type="text"
              value={form.featuredImageUrl}
              onChange={(e) => updateField("featuredImageUrl", e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
            />
            {form.featuredImageUrl && (
              <img
                src={form.featuredImageUrl}
                alt="Preview"
                className="w-full rounded-lg object-cover max-h-40"
              />
            )}
          </div>

          {/* Excerpt */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-white font-semibold text-sm">Excerpt</h3>
            <textarea
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              placeholder="Auto-generated from content if empty"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PostEditorWithData({ postId }: { postId: Id<"posts"> }) {
  const posts = useQuery(api.posts.listAll);
  const post = posts?.find((p) => p._id === postId);

  if (!posts) {
    return <div className="text-white/50 text-center py-12">Loading...</div>;
  }
  if (!post) {
    return <div className="text-red-400 text-center py-12">Post not found</div>;
  }

  return <PostEditorLoaded postId={postId} post={post} />;
}

function PostEditorLoaded({
  postId,
  post,
}: {
  postId: Id<"posts">;
  post: {
    title: string;
    slug: string;
    seoTitle?: string;
    metaDescription?: string;
    content: string;
    excerpt?: string;
    featuredImageUrl?: string;
    categoryId?: Id<"categories">;
    tags?: string[];
    status: "draft" | "published";
  };
}) {
  const router = useRouter();
  const categories = useQuery(api.categories.list);

  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: post.title,
    slug: post.slug,
    seoTitle: post.seoTitle || "",
    metaDescription: post.metaDescription || "",
    content: post.content,
    excerpt: post.excerpt || "",
    featuredImageUrl: post.featuredImageUrl || "",
    categoryId: post.categoryId || "",
    tags: post.tags?.join(", ") || "",
    status: post.status,
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (status?: "draft" | "published") => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const result = await updatePostAction({
        id: postId,
        title: form.title,
        slug: form.slug,
        seoTitle: form.seoTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        content: form.content,
        excerpt: form.excerpt || undefined,
        featuredImageUrl: form.featuredImageUrl || undefined,
        categoryId: form.categoryId
          ? (form.categoryId as Id<"categories">)
          : undefined,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : undefined,
        status: (status || form.status) as "draft" | "published",
      });

      if (!result.ok) {
        alert(result.error);
        return;
      }
      router.push("/admin/posts");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            <Eye size={16} />
            {showPreview ? "Editor" : "Preview"}
          </button>
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors text-sm disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4FC3F7] to-[#039BE5] text-white font-semibold hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Post title"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]/50 focus:border-[#4FC3F7]"
          />
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-sm">/blog/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
            />
          </div>
          {showPreview ? (
            <div className="min-h-[500px] p-6 rounded-xl bg-white/5 border border-white/10">
              <MarkdownRenderer content={form.content} />
            </div>
          ) : (
            <textarea
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Write your post in Markdown..."
              rows={24}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 text-sm font-mono placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]/50 focus:border-[#4FC3F7] resize-y"
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-white font-semibold text-sm">SEO Settings</h3>
            <div>
              <label className="text-white/50 text-xs mb-1 block">SEO Title Override</label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => updateField("seoTitle", e.target.value)}
                placeholder={form.title || "Auto from title"}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 flex justify-between">
                <span>Meta Description</span>
                <span className={form.metaDescription.length > 155 ? "text-red-400" : "text-white/30"}>
                  {form.metaDescription.length}/155
                </span>
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                placeholder="Brief description for search results..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50 resize-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-white font-semibold text-sm">Organization</h3>
            <div>
              <label className="text-white/50 text-xs mb-1 block">Category</label>
              <select
                value={form.categoryId as string}
                onChange={(e) => updateField("categoryId", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
              >
                <option value="">No category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                placeholder="ai, video, seedance"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-white font-semibold text-sm">Featured Image</h3>
            <input
              type="text"
              value={form.featuredImageUrl}
              onChange={(e) => updateField("featuredImageUrl", e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
            />
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-white font-semibold text-sm">Excerpt</h3>
            <textarea
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              placeholder="Auto-generated from content if empty"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
