"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Link from "next/link";
import { Trash2, Edit, Plus, Eye } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { deletePostAction } from "../actions";

export default function PostsListPage() {
  const posts = useQuery(api.posts.listAll);

  const handleDelete = async (id: Id<"posts">, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      const result = await deletePostAction(id);
      if (!result.ok) {
        alert(result.error);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4FC3F7] to-[#039BE5] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          New Post
        </Link>
      </div>

      {!posts ? (
        <div className="text-white/50 text-center py-12">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/50 mb-4">No posts yet</p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4FC3F7]/20 text-[#4FC3F7] hover:bg-[#4FC3F7]/30 transition-colors"
          >
            <Plus size={18} />
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">
                  Date
                </th>
                <th className="text-right px-4 py-3 text-white/60 text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white font-medium text-sm">
                        {post.title}
                      </p>
                      <p className="text-white/40 text-xs mt-0.5">
                        /{post.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white/60 text-sm">
                      {post.category?.name || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        post.status === "published"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/50 text-sm">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {post.status === "published" && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>
                      )}
                      <Link
                        href={`/admin/posts/${post._id}/edit`}
                        className="p-2 rounded-lg text-white/40 hover:text-[#4FC3F7] hover:bg-white/10 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id, post.title)}
                        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
