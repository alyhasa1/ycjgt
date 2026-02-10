# YCJGT App

Next.js 16 App Router project with:
- Public marketing/demo homepage
- Convex-backed blog
- Protected `/admin` content management UI

Deployment target is **Cloudflare Workers** (OpenNext), not Cloudflare Pages static export.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Add environment variables in `.env.local`:
```bash
NEXT_PUBLIC_CONVEX_URL=...
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_SITE_URL=...
ADMIN_PASSWORD=...
JWT_SECRET=...
CONVEX_ADMIN_API_TOKEN=...
```

3. Run development server:
```bash
npm run dev
```

4. Validate production build:
```bash
npm run build
```

## Cloudflare Workers Runtime (OpenNext)

### Scripts
- `npm run preview` builds with OpenNext and runs a local workerd preview
- `npm run deploy` builds with OpenNext and deploys via Wrangler
- `npm run cf-typegen` regenerates Cloudflare env types

### Required Worker secrets/vars
- `NEXT_PUBLIC_CONVEX_URL`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `CONVEX_ADMIN_API_TOKEN`

## Convex Write Security Model

Public reads stay in `convex/posts.ts` and `convex/categories.ts`.  
Admin writes are routed through:

1. Next.js server actions (`src/app/admin/(dashboard)/actions.ts`)
2. Server-only helper (`src/lib/convex-admin.ts`)
3. Convex admin actions (`convex/admin.ts`) requiring `adminToken`
4. Convex internal mutations (`createInternal/updateInternal/removeInternal`)

This prevents browser clients from directly calling write mutations.

## GitHub + Cloudflare Workers Builds

Repository setup for this project:
- Repo URL: `git@github.com:alyhasa1/ycjgt.git`
- App root directory: `ycjgt-app`
- Default branch: `main`

In Cloudflare Workers Builds:
1. Connect the GitHub repo.
2. Set root directory to `ycjgt-app`.
3. Configure production branch as `main`.
4. Add the required Worker secrets/vars listed above.

## Environment Risk Note (Accepted)

Preview branches are configured to use the **production Convex URL** in this release plan.  
That means preview deployments can read/write production content if admin actions are used.
