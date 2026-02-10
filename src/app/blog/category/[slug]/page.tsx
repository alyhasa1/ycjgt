import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const convex = getConvexClient();
  const category = await convex.query(api.categories.getBySlug, { slug });

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.metaTitle || category.name} — YCJGT Blog`,
    description:
      category.metaDescription ||
      `Browse all posts in ${category.name} on the YCJGT Blog.`,
    alternates: { canonical: `/blog/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const convex = getConvexClient();
  const category = await convex.query(api.categories.getBySlug, { slug });

  if (!category) notFound();

  const { posts } = await convex.query(api.posts.listByCategory, {
    categoryId: category._id,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-[#0D1B3E]/40 mb-8">
        <Link href="/blog" className="hover:text-[#039BE5] transition-colors">
          Blog
        </Link>
        <span>/</span>
        <span className="text-[#0D1B3E]/60">{category.name}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0D1B3E] mb-3">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-lg text-[#0D1B3E]/60">{category.description}</p>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-[#0D1B3E]/50">
          No posts in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#0D1B3E]/5"
            >
              {post.featuredImageUrl && (
                <div className="aspect-video overflow-hidden bg-[#0D1B3E]/5">
                  <img
                    src={post.featuredImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#0D1B3E] mb-2 group-hover:text-[#039BE5] transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-[#0D1B3E]/60 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                {post.publishedAt && (
                  <time className="block mt-3 text-xs text-[#0D1B3E]/40">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
