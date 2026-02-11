"use client";

import { Children, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

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
  p: ({ children }) => {
    const nodes = Children.toArray(children);
    const hasBlockChild = nodes.some((node) => {
      if (!isValidElement(node) || typeof node.type !== "string") {
        return false;
      }
      return [
        "figure",
        "div",
        "table",
        "pre",
        "blockquote",
        "hr",
        "ul",
        "ol",
      ].includes(node.type);
    });

    if (hasBlockChild) {
      return <>{children}</>;
    }

    return <p className="text-[#0D1B3E]/80 leading-relaxed mb-4">{children}</p>;
  },
  a: ({ href, children }) => {
    // Check if this is a video link
    const isVideo = href && (
      href.endsWith(".mp4") || 
      href.includes("video.twimg.com") || 
      href.includes("twitter.com") || 
      href.includes("upload.salemate.app")
    );
    
    if (isVideo) {
      const caption = children && typeof children === 'string' && children !== href ? children : '';
      
      return (
        <span style={{ display: 'block', margin: '1.5rem 0' }}>
          <span style={{ display: 'block', borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: 'black' }}>
            <video
              src={href}
              controls
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
              onError={(e) => {
                const video = e.currentTarget;
                video.style.display = 'none';
                const fallback = video.parentElement?.querySelector('.video-fallback');
                if (fallback) fallback.classList.remove('hidden');
              }}
            >
              <source src={href} type="video/mp4" />
            </video>
            <span className="video-fallback hidden" style={{ padding: '1rem', textAlign: 'center' }}>
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#4FC3F7', fontSize: '0.875rem', textDecoration: 'underline' }}
              >
                View video (opens in new tab)
              </a>
            </span>
          </span>
          {caption && (
            <span style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(13, 27, 62, 0.5)', marginTop: '0.5rem', textAlign: 'center', fontStyle: 'italic' }}>
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

export function MarkdownRenderer({ content, className = "" }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
