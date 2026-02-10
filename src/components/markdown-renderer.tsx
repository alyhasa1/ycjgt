"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";

export const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-bold text-[#0D1B3E] mt-10 mb-4" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-bold text-[#0D1B3E] mt-8 mb-3" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold text-[#0D1B3E] mt-6 mb-2" {...props}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[#0D1B3E]/80 leading-relaxed mb-4">
      {children}
    </p>
  ),
  a: ({ href, children }) => {
    // Check if this is a video link
    const isVideo = href && (
      href.endsWith(".mp4") || 
      href.includes("video.twimg.com") || 
      href.includes("twitter.com") || 
      href.includes("upload.salemate.app")
    );
    
    if (isVideo) {
      // Return inline video player wrapped in spans only (valid inside <p>)
      const caption = children && typeof children === 'string' && children !== href ? children : '';
      
      return (
        <span 
          className="block my-6 rounded-xl overflow-hidden bg-black" 
          style={{ display: 'block', marginTop: '1.5rem', marginBottom: '1.5rem', borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: 'black' }}
        >
          <video
            src={href}
            controls
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
            className="w-full max-h-[500px] object-contain"
            onError={(e) => {
              const video = e.currentTarget;
              video.style.display = 'none';
              const fallback = video.parentElement?.querySelector('.video-fallback');
              if (fallback) fallback.classList.remove('hidden');
            }}
          >
            <source src={href} type="video/mp4" />
          </video>
          <span 
            className="video-fallback hidden p-4 text-center"
            style={{ display: 'none', padding: '1rem', textAlign: 'center' }}
          >
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#4FC3F7] hover:underline text-sm"
            >
              View video (opens in new tab)
            </a>
          </span>
          {caption && (
            <span 
              className="block text-sm text-[#0D1B3E]/50 mt-2 text-center italic"
              style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(13, 27, 62, 0.5)', marginTop: '0.5rem', textAlign: 'center', fontStyle: 'italic' }}
            >
              {caption}
            </span>
          )}
        </span>
      );
    }
    
    return (
      <a
        href={href}
        className="text-[#039BE5] hover:text-[#4FC3F7] underline underline-offset-2 transition-colors"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  },
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside space-y-1.5 mb-4 text-[#0D1B3E]/80" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside space-y-1.5 mb-4 text-[#0D1B3E]/80" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-[#4FC3F7] pl-4 py-1 my-4 text-[#0D1B3E]/70 italic bg-[#4FC3F7]/5 rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-[#0D1B3E]" {...props}>
      {children}
    </strong>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded bg-[#0D1B3E]/5 text-[#039BE5] text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="block p-4 rounded-xl bg-[#0D1B3E] text-white/90 text-sm font-mono overflow-x-auto my-4"
        {...props}
      >
        {children}
      </code>
    );
  },
  hr: (props) => (
    <hr className="my-8 border-[#0D1B3E]/10" {...props} />
  ),
  img: ({ src, alt, ...props }) => (
    <figure className="my-6">
      <img
        src={src}
        alt={alt || ""}
        className="w-full rounded-xl"
        loading="lazy"
        {...props}
      />
      {alt && (
        <figcaption className="text-center text-sm text-[#0D1B3E]/50 mt-2">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
};

// Rehype plugin to unwrap paragraphs containing video links
function rehypeUnwrapVideoParagraphs() {
  return (tree: Root) => {
    const isVideoUrl = (url: string) => 
      url.endsWith(".mp4") || 
      url.includes("video.twimg.com") || 
      url.includes("twitter.com") || 
      url.includes("upload.salemate.app");

    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName === "p" && parent && Array.isArray(parent.children)) {
        const hasVideoLink = node.children.some((child: any) => {
          if (child.type === "element" && child.tagName === "a") {
            const href = child.properties?.href as string;
            return href && isVideoUrl(href);
          }
          return false;
        });

        if (hasVideoLink) {
          parent.children.splice(index ?? 0, 1, ...node.children);
          return index ?? 0;
        }
      }
    });
  };
}

// Rehype plugin to transform video links into video elements
function rehypeTransformVideos() {
  return (tree: Root) => {
    const isVideoUrl = (url: string) => 
      url.endsWith(".mp4") || 
      url.includes("video.twimg.com") || 
      url.includes("twitter.com") || 
      url.includes("upload.salemate.app");

    visit(tree, "element", (node: Element) => {
      if (node.tagName === "a") {
        const href = node.properties?.href as string;
        if (href && isVideoUrl(href)) {
          const caption = node.children?.[0]?.type === "text" 
            ? (node.children[0] as any).value 
            : "";
          
          node.tagName = "div";
          node.properties = { 
            className: ["my-6", "rounded-xl", "overflow-hidden", "bg-black"] 
          };
          node.children = [
            {
              type: "element",
              tagName: "video",
              properties: {
                src: href,
                controls: true,
                playsInline: true,
                preload: "metadata",
                crossOrigin: "anonymous",
                className: ["w-full", "max-h-[500px]", "object-contain"]
              },
              children: [
                {
                  type: "element",
                  tagName: "source",
                  properties: { src: href, type: "video/mp4" },
                  children: []
                }
              ]
            },
            {
              type: "element",
              tagName: "div",
              properties: { className: ["video-fallback", "hidden", "p-4", "text-center"] },
              children: [
                {
                  type: "element",
                  tagName: "a",
                  properties: { 
                    href, 
                    target: "_blank", 
                    rel: "noopener noreferrer", 
                    className: ["text-[#4FC3F7]", "hover:underline", "text-sm"] 
                  },
                  children: [{ type: "text", value: "View video (opens in new tab)" }]
                }
              ]
            },
            ...(caption && caption !== href ? [{
              type: "element",
              tagName: "div",
              properties: { className: ["text-sm", "text-[#0D1B3E]/50", "mt-2", "text-center", "italic"] },
              children: [{ type: "text", value: caption }]
            } as Element] : [])
          ];
        }
      }
    });
  };
}

export function MarkdownRenderer({ content, className = "" }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw, rehypeUnwrapVideoParagraphs, rehypeTransformVideos]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
