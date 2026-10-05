"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerEmployer } from "./actions";

export default function EmployerRegistrationPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setErrorMessage("");

    if (password !== passwordAgain) {
      setErrorMessage("A két jelszó nem egyezik.");
      return;
    }

    setLoading(true);

    const result = await registerEmployer(
      email.trim(),
      password
    );

    if (!result.success) {
      setErrorMessage(result.message);
      setLoading(false);
      return;
    }

    router.push("/munkaltato/login");
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

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-blue-700">
            YourJob Munkáltatóknak
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Munkáltatói regisztráció
          </h1>

          <p className="mt-2 text-slate-600">
            Hozd létre a munkáltatói fiókodat.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
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
                minLength={8}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Jelszó újra
              </label>

              <input
                type="password"
                value={passwordAgain}
                onChange={(e) =>
                  setPasswordAgain(e.target.value)
                }
                required
                minLength={8}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {errorMessage && (
              <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {loading
                ? "Regisztráció..."
                : "Munkáltatói fiók létrehozása"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Már van munkáltatói fiókod?{" "}
            <a
              href="/munkaltato/login"
              className="font-semibold text-blue-700 hover:underline"
            >
              Belépés
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}