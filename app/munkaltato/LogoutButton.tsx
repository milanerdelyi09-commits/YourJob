"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabaseClient";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();

    router.replace("/munkaltato/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
    >
      Kijelentkezés
    </button>
  );
}