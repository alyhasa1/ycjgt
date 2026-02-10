import { getConvexClient } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — You Can Just Generate Things | AI Video Generation Insights",
  description:
    "Explore the latest in AI video generation, social commerce content, and creative automation. Powered by Seedance 2.0.",
  openGraph: {
    title: "YCJGT Blog — AI Video Generation Insights",
    description:
      "Explore the latest in AI video generation, social commerce content, and creative automation.",
    type: "website",
  },
};

export const revalidate = 60;

function formatDate(date: number) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogIndexPage() {
  const convex = getConvexClient();
  const posts = await convex.query(api.posts.listPublished, {});
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
      {/* Elegant Hero */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#4FC3F7]/10 to-[#039BE5]/10 border border-[#4FC3F7]/20 mb-8">
          <Sparkles className="w-4 h-4 text-[#039BE5]" />
          <span className="text-sm font-medium text-[#039BE5]">AI Video Generation Insights</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#039BE5] to-[#4FC3F7]">YCJGT</span> Blog
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Deep dives into AI video generation, Seedance 2.0, social commerce content, 
          and the future of creative automation.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 text-lg">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block relative rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {featuredPost.featuredImageUrl ? (
                    <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                      <img
                        src={featuredPost.featuredImageUrl}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-[#4FC3F7]/20 to-[#039BE5]/20 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-[#039BE5]/40" />
                    </div>
                  )}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    {featuredPost.category && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#039BE5] uppercase tracking-wider mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#039BE5]" />
                        {featuredPost.category.name}
                      </span>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-[#039BE5] transition-colors duration-300">
                      {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="w-4 h-4" />
                        {featuredPost.publishedAt && (
                          <time>{formatDate(featuredPost.publishedAt)}</time>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-sm font-semibold text-[#039BE5] group-hover:gap-2 transition-all">
                        Read article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Post Grid */}
          {otherPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-semibold text-slate-900">More Articles</h3>
                <span className="text-sm text-slate-400">{otherPosts.length} posts</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300"
                  >
                    {post.featuredImageUrl ? (
                      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={post.featuredImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-slate-300" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {post.category && (
                        <span className="text-xs font-semibold text-[#039BE5] uppercase tracking-wider mb-3">
                          {post.category.name}
                        </span>
                      )}
                      <h4 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-[#039BE5] transition-colors">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        {post.publishedAt && (
                          <time className="text-xs text-slate-400 font-medium">
                            {formatDate(post.publishedAt)}
                          </time>
                        )}
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#039BE5] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
