"use client";

import { use } from "react";
import { PostEditorWithData } from "../../post-editor";
import { Id } from "../../../../../../../convex/_generated/dataModel";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <PostEditorWithData postId={id as Id<"posts">} />;
}
