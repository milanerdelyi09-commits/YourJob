"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseClient";

type UserType = "guest" | "jobseeker" | "employer" | "admin";

export default function UserAccountNav() {
  const router = useRouter();

  const [userType, setUserType] = useState<UserType>("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserType("guest");
        setLoading(false);
        return;
      }

      const role = user.app_metadata?.role;

      if (role === "employer") {
        setUserType("employer");
      } else if (role === "admin") {
        setUserType("admin");
      } else {
        setUserType("jobseeker");
      }

      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    setUserType("guest");

    router.refresh();
  }

  if (loading) {
    return null;
  }

  if (userType === "employer") {
    return (
      <Link
        href="/munkaltato"
        className="font-semibold text-blue-700 hover:underline"
      >
        Munkáltatói felület
      </Link>
    );
  }

  if (userType === "admin") {
    return (
      <Link
        href="/admin"
        className="font-semibold text-blue-700 hover:underline"
      >
        Admin
      </Link>
    );
  }

  if (userType === "jobseeker") {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/jelentkezeseim"
        className="font-semibold text-slate-700 hover:text-blue-700"
      >
        Jelentkezéseim
      </Link>

      <Link
        href="/profil"
        className="font-semibold text-blue-700 hover:underline"
      >
        Profil
      </Link>

      <button
        onClick={handleLogout}
        className="font-semibold text-slate-600 hover:text-blue-700"
      >
        Kijelentkezés
      </button>
    </div>
  );
}

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/belepes"
        className="font-semibold text-slate-700 hover:text-blue-700"
      >
        Belépés
      </Link>

      <Link
        href="/regisztracio"
        className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
      >
        Regisztráció
      </Link>
    </div>
  );
}