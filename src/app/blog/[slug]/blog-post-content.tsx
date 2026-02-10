"use client";

import { MarkdownRenderer } from "@/components/markdown-renderer";

export function BlogPostContent({ content }: { content: string }) {
  return (
    <MarkdownRenderer 
      content={content} 
      className="prose-wrapper"
    />
  );
}
