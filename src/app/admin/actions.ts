"use server";

import { createSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "Admin login is not configured" };
  }

  if (password !== adminPassword) {
    return { error: "Invalid password" };
  }

  await createSession();
  redirect("/admin/posts");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin");
}
