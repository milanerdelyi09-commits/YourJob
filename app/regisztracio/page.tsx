"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabaseClient";

export default function RegistrationPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password !== passwordAgain) {
      setErrorMessage("A két jelszó nem egyezik.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("A jelszó legalább 8 karakter hosszú legyen.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setSuccessMessage(
        "Sikeres regisztráció! Ellenőrizd az e-mail fiókodat a regisztráció megerősítéséhez."
      );
      setLoading(false);
      return;
    }

    router.push("/profil");
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
            YourJob
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Regisztráció
          </h1>

          <p className="mt-2 text-slate-600">
            Hozd létre az álláskeresői fiókodat.
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Teljes név
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

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

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Jelszó újra
              </label>

              <input
                type="password"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {errorMessage && (
              <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Regisztráció..." : "Fiók létrehozása"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Már van fiókod? A belépést következőnek kötjük be.
          </p>
        </div>
      </div>
    </main>
  );
}