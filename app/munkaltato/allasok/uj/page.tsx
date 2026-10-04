"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../lib/supabaseClient";

export default function NewJobPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function createSlug(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("Nem vagy bejelentkezve.");
      setLoading(false);
      return;
    }

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id, name")
      .eq("owner_id", user.id)
      .single();

    if (companyError || !company) {
      setErrorMessage("Nem található a fiókodhoz tartozó cégprofil.");
      setLoading(false);
      return;
    }

    const requirementsArray = requirements
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const slug = `${createSlug(title)}-${Date.now()}`;

    const { error } = await supabase.from("jobs").insert({
      title,
      slug,
      company: company.name,
      company_id: company.id,
      location,
      salary,
      type: jobType,
      description,
      requirements: requirementsArray,
      match: 0,
    });

    if (error) {
      console.error("Álláshirdetés mentési hiba:", error);
      setErrorMessage("Nem sikerült létrehozni az álláshirdetést.");
      setLoading(false);
      return;
    }

    router.push("/munkaltato");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <a
          href="/munkaltato"
          className="mb-6 inline-block font-semibold text-blue-700 hover:underline"
        >
          ← Vissza a dashboardra
        </a>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Új álláshirdetés
          </h1>

          <p className="mt-2 text-slate-600">
            Add meg az állás legfontosabb adatait.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Pozíció neve
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="pl. Raktáros"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Munkavégzés helye
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="pl. Gyöngyös"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Fizetés
              </label>

              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="pl. 400 000 – 500 000 Ft"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Munkarend
              </label>

              <input
                type="text"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                placeholder="pl. Teljes munkaidő / 2 műszak"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Munkakör leírása
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Elvárások
              </label>

              <p className="mb-2 text-sm text-slate-500">
                Minden elvárást külön sorba írj.
              </p>

              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={5}
                placeholder={`Pontos munkavégzés
Műszakos munkarend vállalása
Műszaki érdeklődés`}
                required
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
              {loading ? "Hirdetés létrehozása..." : "Álláshirdetés létrehozása"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}