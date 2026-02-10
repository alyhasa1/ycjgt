# YCJGT pSEO Blog System — Feb 10, 2025

## What was built
Full programmatic SEO blog engine with Convex backend, admin panel, auto-updating sitemap, and first published blog post about Seedance 2.0.

## Tech Additions
- Convex (backend — schema, queries, mutations)
- react-markdown + remark-gfm (Markdown rendering)
- jose (JWT admin sessions)

## Convex Deployments
- **Production**: `frugal-kudu-623` → `https://frugal-kudu-623.convex.cloud`
- **Dev**: `tremendous-pheasant-681` → `https://tremendous-pheasant-681.convex.cloud`
- Both seeded with 5 categories + 1 blog post

## Convex Schema
- **posts** — slug, title, seoTitle, metaDescription, content (Markdown), excerpt, featuredImageUrl, categoryId, tags[], status, publishedAt, updatedAt
- **categories** — slug, name, description, metaTitle, metaDescription

## Convex Functions
- `posts:getBySlug`, `posts:listPublished`, `posts:listByCategory`, `posts:listAll`, `posts:listAllPublishedSlugs`, `posts:create`, `posts:update`, `posts:remove`
- `categories:list`, `categories:getBySlug`, `categories:listAllSlugs`, `categories:create`, `categories:update`, `categories:remove`
- `seed:seedAll` — one-time seed function (idempotent)

## New Files

### Convex
- `convex/schema.ts` — Database schema with indexes
- `convex/posts.ts` — All post queries and mutations
- `convex/categories.ts` — All category queries and mutations
- `convex/seed.ts` — Seed script for categories + first blog post
- `convex/tsconfig.json` — TypeScript config for Convex

### Admin Panel (`/admin`)
- `src/app/admin/page.tsx` — Login page
- `src/app/admin/login-form.tsx` — Client-side login form
- `src/app/admin/actions.ts` — Server actions (login/logout)
- `src/app/admin/(dashboard)/layout.tsx` — Protected admin layout
- `src/app/admin/(dashboard)/admin-nav.tsx` — Admin navigation bar
- `src/app/admin/(dashboard)/posts/page.tsx` — Post list with CRUD
- `src/app/admin/(dashboard)/posts/post-editor.tsx` — Full post editor + edit mode
- `src/app/admin/(dashboard)/posts/new/page.tsx` — New post page
- `src/app/admin/(dashboard)/posts/[id]/edit/page.tsx` — Edit post page
- `src/app/admin/(dashboard)/categories/page.tsx` — Category manager

### Public Blog
- `src/app/blog/layout.tsx` — Blog layout with header/footer
- `src/app/blog/page.tsx` — Blog index (SSR, revalidate 60s)
- `src/app/blog/[slug]/page.tsx` — Individual post (SEO meta, JSON-LD, OG)
- `src/app/blog/[slug]/blog-post-content.tsx` — Markdown renderer with video support
- `src/app/blog/category/[slug]/page.tsx` — Category listing

### SEO Infrastructure
- `src/app/sitemap.ts` — Dynamic sitemap (queries Convex, revalidates hourly)
- `src/app/robots.ts` — robots.txt (allows all, blocks /admin, points to sitemap)

### Shared
- `src/components/providers/convex-provider.tsx` — ConvexProvider wrapper
- `src/lib/auth.ts` — JWT session create/verify/destroy
- `src/lib/convex.ts` — ConvexHttpClient for SSR

### Modified
- `src/app/layout.tsx` — Added ConvexProvider + metadataBase
- `.env.local` — Convex deployment vars + ADMIN_PASSWORD + JWT_SECRET

## Seeded Categories
1. AI Video Generation
2. Social Commerce
3. Industry News
4. Tutorials
5. Use Cases

## First Blog Post
- **Title**: "Seedance 2.0: ByteDance's New AI Video Model That Leaves Sora, Veo, and Kling in the Dust"
- **Keywords**: seedance 2.0, bytedance new model, you can just generate things, ai content generation, social commerce, tiktok shop
- **3 embedded videos**: Animation demo, Vibe Marketing, LeBron basketball
- **~2000 words**, SEO-optimized with JSON-LD Article structured data

## Admin Credentials
- URL: `/admin`
- Password: set via `ADMIN_PASSWORD` environment variable (value intentionally not documented)

## How Sitemap Works
- Dynamic `sitemap.xml` auto-generates from Convex data
- Revalidates every hour
- Submit once to Google Search Console → new posts auto-discovered
- Includes: homepage, /blog, all /blog/[slug], all /blog/category/[slug]
