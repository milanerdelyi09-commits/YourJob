"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseClient";

export default function JobseekerNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/belepes");
    router.refresh();
  }

  function linkClass(path: string) {
    return pathname === path
      ? "text-blue-700"
      : "text-slate-700 hover:text-blue-700";
  }

  return (
    <header className="mb-8 rounded-2xl border bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-blue-700"
        >
          YourJob
        </Link>

        <nav className="flex items-center gap-5 text-sm font-semibold">
          <Link
            href="/"
            className={linkClass("/")}
          >
            Főoldal
          </Link>

          <Link
            href="/allasok"
            className={linkClass("/allasok")}
          >
            Állások
          </Link>

          <Link
            href="/jelentkezeseim"
            className={linkClass("/jelentkezeseim")}
          >
            Jelentkezéseim
          </Link>

          <Link
            href="/profil"
            className={linkClass("/profil")}
          >
            Profil
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Kijelentkezés
          </button>
        </nav>
      </div>
    </header>
  );
}