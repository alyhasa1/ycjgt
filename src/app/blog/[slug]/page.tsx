import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostContent } from "./blog-post-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const convex = getConvexClient();
  const post = await convex.query(api.posts.getBySlug, { slug });

  if (!post || post.status !== "published") {
    return { title: "Post Not Found" };
  }

  const title = post.seoTitle || post.title;
  const description = post.metaDescription || post.excerpt || "";

  return {
    title: `${title} — YCJGT Blog`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
      modifiedTime: new Date(post.updatedAt).toISOString(),
      images: post.featuredImageUrl ? [post.featuredImageUrl] : [],
      tags: post.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImageUrl ? [post.featuredImageUrl] : [],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const convex = getConvexClient();
  const post = await convex.query(api.posts.getBySlug, { slug });

  if (!post || post.status !== "published") {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    image: post.featuredImageUrl || "",
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : "",
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      "@type": "Organization",
      name: "You Can Just Generate Things",
      url: "https://youcanjustgeneratethings.com",
    },
    publisher: {
      "@type": "Organization",
      name: "You Can Just Generate Things",
      logo: {
        "@type": "ImageObject",
        url: "https://youcanjustgeneratethings.com/ycjgt.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://youcanjustgeneratethings.com/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#0D1B3E]/40 mb-8">
          <a href="/blog" className="hover:text-[#039BE5] transition-colors">
            Blog
          </a>
          <span>/</span>
          {post.category && (
            <>
              <a
                href={`/blog/category/${post.category.slug}`}
                className="hover:text-[#039BE5] transition-colors"
              >
                {post.category.name}
              </a>
              <span>/</span>
            </>
          )}
          <span className="text-[#0D1B3E]/60 truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <a
              href={`/blog/category/${post.category.slug}`}
              className="inline-block px-3 py-1 rounded-full bg-[#4FC3F7]/10 text-[#039BE5] text-xs font-medium mb-4 hover:bg-[#4FC3F7]/20 transition-colors"
            >
              {post.category.name}
            </a>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0D1B3E] leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-[#0D1B3E]/50">
            {post.publishedAt && (
              <time>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-[#0D1B3E]/5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImageUrl && (
          <div className="mb-10 rounded-2xl overflow-hidden">
            <img
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <BlogPostContent content={post.content} />

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[#0D1B3E] to-[#1a2d5a] text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Ready to Generate?
          </h3>
          <p className="text-white/70 mb-6 max-w-lg mx-auto">
            Drop your assets, get an AI-generated storyboard in seconds. We
            handle the friction — you get the output.
          </p>
          <a
            href="/"
            className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-[#4FC3F7] to-[#039BE5] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Try You Can Just Generate Things →
          </a>
        </div>
      </article>
    </>
  );
}
