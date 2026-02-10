import { mutation } from "./_generated/server";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingCats = await ctx.db.query("categories").collect();
    if (existingCats.length > 0) {
      return "Already seeded";
    }

    // Seed categories
    const catIds: Record<string, string> = {};

    const categories = [
      {
        slug: "ai-video-generation",
        name: "AI Video Generation",
        description: "The latest breakthroughs in AI-powered video creation",
        metaTitle: "AI Video Generation — YCJGT Blog",
        metaDescription:
          "Explore the cutting edge of AI video generation, from Seedance 2.0 to the future of automated content creation.",
      },
      {
        slug: "social-commerce",
        name: "Social Commerce",
        description:
          "AI-powered video content for TikTok Shop, Instagram, and social selling",
        metaTitle: "Social Commerce AI Videos — YCJGT Blog",
        metaDescription:
          "How AI video generation is transforming social commerce, TikTok Shop, and shoppable content creation.",
      },
      {
        slug: "industry-news",
        name: "Industry News",
        description:
          "Breaking news and analysis on AI video models and the creator economy",
        metaTitle: "AI Video Industry News — YCJGT Blog",
        metaDescription:
          "Stay up to date with the latest AI video generation models, industry shifts, and creator economy trends.",
      },
      {
        slug: "tutorials",
        name: "Tutorials",
        description: "Step-by-step guides for AI content generation",
        metaTitle: "AI Video Generation Tutorials — YCJGT Blog",
        metaDescription:
          "Learn how to generate professional videos with AI. Step-by-step tutorials and best practices.",
      },
      {
        slug: "use-cases",
        name: "Use Cases",
        description:
          "Real-world applications of AI video generation across industries",
        metaTitle: "AI Video Use Cases — YCJGT Blog",
        metaDescription:
          "Discover how businesses use AI video generation for marketing, e-commerce, real estate, fashion, and more.",
      },
    ];

    for (const cat of categories) {
      const id = await ctx.db.insert("categories", cat);
      catIds[cat.slug] = id;
    }

    // Seed first blog post
    const now = Date.now();
    const blogContent = `# Seedance 2.0 Is Here — And Nothing Else Comes Close

The AI video generation space just got a new king.

**Seedance 2.0**, ByteDance's latest and most capable AI video generation model, has arrived — and it doesn't just raise the bar. It obliterates it. If you've been following the rapid evolution of AI-generated video, you know the names: OpenAI's Sora, Google's Veo, Kuaishou's Kling. They've each had their moment. But Seedance 2.0 makes them all look like rough drafts.

This isn't hype. This is what happens when the world's most sophisticated short-video platform decides to build the world's most capable video AI.

## It Surpasses Kling — Which Just Released

Kling made waves when it launched. Impressive motion coherence, decent physics, solid output quality. For a brief window, it was the model to beat.

That window is now closed.

Seedance 2.0 surpasses Kling in virtually every dimension that matters: **motion fidelity, temporal consistency, physics simulation, lighting coherence, and cinematic quality**. Where Kling stumbles on complex multi-subject interactions, Seedance 2.0 handles them with an almost uncanny naturalism.

## Sora and Veo? Left in the Dust

Let's be direct: **there is no update from Sora or Veo that's ready to surpass Seedance 2.0 — or even match it**.

Sora captured the world's imagination with its early demos, but its actual public release has been limited and inconsistent. Veo showed promise inside Google's ecosystem, but it still struggles with the kind of fluid, physics-aware motion that Seedance 2.0 delivers effortlessly.

Seedance 2.0 doesn't just generate video. It generates *believable* video. The kind that makes you pause and question whether it was shot on a camera or conjured from pixels.

## The Bar Has Been Lifted — And That's a Good Thing

Here's the great thing about moments like this: **every time the bar is lifted, everyone now has a north star to follow**.

First it was sound — models that could generate coherent audio alongside video. That was the benchmark. Now? It's motion. Pure, physics-defying, emotionally resonant motion that looks and feels real.

Seedance 2.0 is that north star. And the entire industry — from open-source projects to billion-dollar labs — now has a target to aim for. Competition breeds innovation. And we're all going to benefit.

## See It to Believe It

Words only go so far. Let's look at what Seedance 2.0 can actually do.

### Cinematic Animation

The level of animation quality Seedance 2.0 produces is staggering. Fluid character movement, dynamic camera angles, and lighting that shifts naturally across scenes:

[Watch: Seedance 2.0 Animation Demo](https://video.twimg.com/amplify_video/2020934463652495365/vid/avc1/2520x1080/j-pQkNhDlW78mmpt.mp4)

This isn't pre-rendered CGI. This is AI-generated video from a single prompt. The temporal consistency — how objects and characters maintain their form across frames — is on another level.

### Vibe Marketing with AI

Marketing teams, pay attention. Seedance 2.0 opens the door to what we're calling **"vibe marketing"** — generating entire brand campaigns from a mood, an aesthetic, a feeling:

[Watch: Vibe Marketing with Seedance 2.0](https://video.twimg.com/amplify_video/2020833117058256896/vid/avc1/1280x720/YA18BWpyO9TQOGPG.mp4)

Imagine generating 50 video variants for A/B testing in the time it takes to brief a single production shoot. That's not the future — that's now.

### When AI Beats LeBron at Basketball

With AI, you can even beat the legend LeBron James on the basketball court — at least in a video. Seedance 2.0 handles complex human motion, physics interactions, and dynamic camera work that would cost tens of thousands in traditional production:

[Watch: AI vs LeBron — Seedance 2.0](https://video.twimg.com/amplify_video/2020908189194256385/vid/avc1/720x1280/BZNStXVFY9aUr1jQ.mp4)

The body mechanics, the ball physics, the court lighting — all generated. All convincing.

## What This Means for Social Commerce

Here's where it gets really interesting for businesses.

The **social commerce** revolution — TikTok Shop, Instagram Shopping, live commerce — runs on one fuel: **video content**. And not just any video. Scroll-stopping, conversion-driving, authentic-feeling video.

The bottleneck has always been production. You need the product, the studio, the model, the videographer, the editor. By the time you're done, trends have moved on.

**Seedance 2.0 eliminates that bottleneck entirely.**

With AI content generation at this level, brands can:

- Generate **TikTok Shop product videos** in minutes, not days
- Create **hundreds of variants** for different audiences, demographics, and aesthetics
- Produce **social commerce content at the speed of trends**, not the speed of production schedules
- Build entire **video-first product catalogs** without a single studio booking

This is the unlock that social commerce has been waiting for. The model quality is finally good enough that AI-generated video converts just as well — if not better — than traditional production.

## The Bigger Picture: AI Content Generation Has Crossed the Rubicon

Seedance 2.0 isn't just a better model. It's a signal.

We've crossed the point where **AI content generation** is "good enough." We're now in the era where it's genuinely *better* for many use cases — faster, cheaper, more iterative, and increasingly higher quality.

For creators, this means more output with less friction. For brands, it means more creative experimentation at lower cost. For entire industries — from fashion to real estate to entertainment — it means a fundamental reshaping of how content gets made.

The question isn't whether AI video will replace traditional production for certain use cases. It already has. The question is how fast the rest of the market catches up.

## You Can Just Generate Things

This is exactly why we built **[youcanjustgeneratethings.com](https://youcanjustgeneratethings.com)**.

The technology is incredible. But technology alone isn't enough. What most people need isn't access to a model — they need a *workflow*. They need to go from "I have assets and an idea" to "here's my finished video" without drowning in prompts, parameters, and technical complexity.

That's what YCJGT does:

1. **Drop your assets** — product photos, brand imagery, lifestyle shots
2. **We generate the storyboard** — AI-powered scene planning, transitions, timing
3. **You approve and generate** — one click, powered by the most capable AI video model on the planet
4. **Get your output** — download, share, publish

No studio. No editor. No weeks of back-and-forth. Just your vision, your assets, and an output that's ready for the world.

We handle the storyboard. We handle the generation. We handle all the friction.

**You can just generate things.**

---

*Ready to see what AI video generation can do for your brand? [Try YCJGT now →](https://youcanjustgeneratethings.com)*`;

    await ctx.db.insert("posts", {
      slug: "seedance-2-bytedance-ai-video-model-surpasses-sora-veo-kling",
      title:
        "Seedance 2.0: ByteDance's New AI Video Model That Leaves Sora, Veo, and Kling in the Dust",
      seoTitle:
        "Seedance 2.0 by ByteDance — The AI Video Model That Surpasses Sora, Veo & Kling",
      metaDescription:
        "Seedance 2.0 is ByteDance's most powerful AI video generation model. See how it surpasses Kling, Sora, and Veo with unmatched motion, physics, and realism.",
      content: blogContent,
      excerpt:
        "Seedance 2.0 by ByteDance surpasses Kling, Sora, and Veo as the world's most capable AI video generation model. See how it's transforming social commerce, content creation, and what it means for the future of video.",
      categoryId: catIds["ai-video-generation"] as any,
      tags: [
        "seedance 2.0",
        "bytedance",
        "ai video generation",
        "sora",
        "veo",
        "kling",
        "social commerce",
        "tiktok shop",
        "ai content generation",
        "you can just generate things",
      ],
      status: "published",
      publishedAt: now,
      updatedAt: now,
    });

    return "Seeded 5 categories + 1 blog post";
  },
});
