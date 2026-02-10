"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "../actions";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoriesPage() {
  const categories = useQuery(api.categories.list);

  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<Id<"categories"> | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
  });

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", metaTitle: "", metaDescription: "" });
    setShowNew(false);
    setEditingId(null);
  };

  const startEdit = (cat: {
    _id: Id<"categories">;
    name: string;
    slug: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
  }) => {
    setEditingId(cat._id);
    setShowNew(false);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      metaTitle: cat.metaTitle || "",
      metaDescription: cat.metaDescription || "",
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }
    try {
      if (editingId) {
        const result = await updateCategoryAction({
          id: editingId,
          name: form.name,
          slug: form.slug || slugify(form.name),
          description: form.description || undefined,
          metaTitle: form.metaTitle || undefined,
          metaDescription: form.metaDescription || undefined,
        });
        if (!result.ok) {
          alert(result.error);
          return;
        }
      } else {
        const result = await createCategoryAction({
          name: form.name,
          slug: form.slug || slugify(form.name),
          description: form.description || undefined,
          metaTitle: form.metaTitle || undefined,
          metaDescription: form.metaDescription || undefined,
        });
        if (!result.ok) {
          alert(result.error);
          return;
        }
      }
      resetForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save";
      alert(message);
    }
  };

  const handleDelete = async (id: Id<"categories">, name: string) => {
    if (confirm(`Delete category "${name}"?`)) {
      const result = await deleteCategoryAction(id);
      if (!result.ok) {
        alert(result.error);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <button
          onClick={() => {
            resetForm();
            setShowNew(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4FC3F7] to-[#039BE5] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          New Category
        </button>
      </div>

      {(showNew || editingId) && (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">
              {editingId ? "Edit Category" : "New Category"}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 rounded text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                  slug: editingId ? prev.slug : slugify(e.target.value),
                }));
              }}
              placeholder="Category name"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
            />
            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="category-slug"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
            />
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Description"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
            />
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, metaTitle: e.target.value }))
              }
              placeholder="SEO Title"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50"
            />
          </div>
          <textarea
            value={form.metaDescription}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, metaDescription: e.target.value }))
            }
            placeholder="SEO meta description"
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4FC3F7]/50 resize-none"
          />
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4FC3F7]/20 text-[#4FC3F7] hover:bg-[#4FC3F7]/30 transition-colors text-sm font-medium"
          >
            <Save size={14} />
            {editingId ? "Update" : "Create"}
          </button>
        </div>
      )}

      {!categories ? (
        <div className="text-white/50 text-center py-12">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-white/50">
          No categories yet. Create one to get started.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">Name</th>
                <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">Slug</th>
                <th className="text-left px-4 py-3 text-white/60 text-sm font-medium">Description</th>
                <th className="text-right px-4 py-3 text-white/60 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-white font-medium text-sm">{cat.name}</td>
                  <td className="px-4 py-3 text-white/50 text-sm">{cat.slug}</td>
                  <td className="px-4 py-3 text-white/50 text-sm">{cat.description || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 rounded-lg text-white/40 hover:text-[#4FC3F7] hover:bg-white/10 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors"
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
