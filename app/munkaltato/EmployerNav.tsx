"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../../lib/supabaseClient";

export default function EmployerNav() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/munkaltato/login");
    router.refresh();
  }

  useEffect(() => {
    if (pathname === "/munkaltato/login") {
      return;
    }

    const INACTIVITY_LIMIT = 30 * 60 * 1000;

    let timeoutId: ReturnType<typeof setTimeout>;

    async function logoutAfterInactivity() {
      const supabase = createClient();

      await supabase.auth.signOut();

      router.replace("/munkaltato/login");
      router.refresh();
    }

    function resetTimer() {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(
        logoutAfterInactivity,
        INACTIVITY_LIMIT
      );
    }

    const events = [
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeoutId);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [pathname, router]);

  if (pathname === "/munkaltato/login") {
    return null;
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold text-blue-700"
        >
          YourJob
        </Link>

        <nav className="flex items-center gap-5 text-sm font-semibold text-slate-700">
          <Link href="/munkaltato" className="hover:text-blue-700">
            Dashboard
          </Link>

          <Link
            href="/munkaltato/allasok/uj"
            className="hover:text-blue-700"
          >
            Új állás
          </Link>

          <Link
            href="/munkaltato/jelentkezok"
            className="hover:text-blue-700"
          >
            Jelentkezők
          </Link>

          <Link
            href="/munkaltato/cegprofil"
            className="hover:text-blue-700"
          >
            Cégprofil
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50"
          >
            Kijelentkezés
          </button>
        </nav>
      </div>
    </header>
  );
}