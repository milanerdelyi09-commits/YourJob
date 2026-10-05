"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabaseClient";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/belepes");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      Kijelentkezés
    </button>
  );
}