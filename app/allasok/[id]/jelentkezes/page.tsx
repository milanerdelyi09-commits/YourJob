"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function ApplicationPage() {
  const params = useParams();
const slug = params.id as string;
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;
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
  name,
  email,
  phone,
  message,
  status: "submitted",
});
  if (error) {
    console.error("Jelentkezési hiba:", error);
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