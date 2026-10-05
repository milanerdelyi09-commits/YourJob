"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";

export default function EmployerLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage("Hibás e-mail cím vagy jelszó.");
      setLoading(false);
      return;
    }

    router.push("/munkaltato");
    router.refresh();
  }

  return (
  <main className="min-h-screen bg-slate-50 px-6 py-10">
    <div className="mx-auto max-w-md">
      <a
        href="/"
        className="mb-6 inline-block font-semibold text-blue-700 hover:underline"
      >
        ← Vissza a főoldalra
      </a>

      <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-blue-700">
          YourJob Munkáltatói felület
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Munkáltatói belépés
        </h1>

        <p className="mt-2 text-slate-600">
          Jelentkezz be a céges fiókoddal.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              E-mail cím
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Jelszó
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {errorMessage && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "Belépés..." : "Belépés"}
          </button>
        </form>
      </div>
    </div>
  </main>
);
}