"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "../../../../lib/supabaseClient";
export default function ApplicationPage() {
  const supabase = createClient();
  const params = useParams();
const slug = params.id as string;
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

useEffect(() => {
  async function loadProfile() {
    const profileClient = createClient();

    const {
      data: { user },
    } = await profileClient.auth.getUser();

    if (!user) {
      return;
    }

    setEmail(user.email ?? "");

    const { data: profile } = await profileClient
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      setName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    }
  }

  loadProfile();
}, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setErrorMessage("");
  
  const formData = new FormData(e.currentTarget);

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;
  const {
  data: { user },
} = await supabase.auth.getUser();

const { data: job, error: jobError } = await supabase
  .from("jobs")
  .select("id")
  .eq("slug", slug)
  .single();

if (jobError || !job) {
  console.error("Állás lekérési hiba:", jobError);
  return;
}

  const { error } = await supabase
    .from("applications")
    .insert({
  job_id: job.id,
  user_id: user?.id ?? null,
  name,
  email,
  phone,
  message,
  status: "submitted",
});
  if (error) {
  if (error.code === "23505") {
    setErrorMessage("Erre az állásra már jelentkeztél.");
    return;
  }

  console.error("Jelentkezési hiba:", error);
  setErrorMessage("Nem sikerült elküldeni a jelentkezést.");
  return;
}
  setSubmitted(true);
}

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">
              Jelentkezés elküldve! 🎉
            </h1>

            <p className="mt-4 text-slate-600">
              A jelentkezésedet sikeresen rögzítettük.
            </p>

            <a
              href="/allasok"
              className="mt-8 inline-block rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Vissza az állásokhoz
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <a
          href="/allasok"
          className="mb-6 inline-block text-sm font-semibold text-blue-700 hover:underline"
        >
          ← Vissza az állásokhoz
        </a>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Jelentkezés
          </h1>

          <p className="mt-2 text-slate-600">
            Add meg az adataidat a jelentkezéshez.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Teljes név
              </label>

              <input
  type="text"
  name="name"
  value={name}
  onChange={(e) => setName(e.target.value)}
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
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
/>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Telefonszám
              </label>

              <input
  type="tel"
  name="phone"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  required
  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
/>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Rövid bemutatkozás
              </label>

              <textarea
                name="message"
                rows={5}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
{errorMessage && (
  <p className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
    {errorMessage}
  </p>
)}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800"
            >
              Jelentkezés elküldése
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}