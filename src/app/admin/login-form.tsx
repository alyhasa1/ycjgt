"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <input
          type="password"
          name="password"
          placeholder="Admin password"
          required
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]/50 focus:border-[#4FC3F7]"
        />
      </div>
      {state?.error && (
        <p className="text-red-400 text-sm text-center">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4FC3F7] to-[#039BE5] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
