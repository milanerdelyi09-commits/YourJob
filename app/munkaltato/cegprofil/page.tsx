"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";

export default function CompanyProfilePage() {
  const router = useRouter();

  const [companyId, setCompanyId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  function createSlug(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  useEffect(() => {
    async function loadCompany() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/munkaltato/login");
        return;
      }

      const { data: company, error } = await supabase
        .from("companies")
        .select(
          "id, name, description, location, website"
        )
        .eq("owner_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Cégprofil betöltési hiba:", error);
        setErrorMessage("Nem sikerült betölteni a cégprofilt.");
        setPageLoading(false);
        return;
      }

      if (company) {
        setCompanyId(company.id);
        setName(company.name ?? "");
        setDescription(company.description ?? "");
        setLocation(company.location ?? "");
        setWebsite(company.website ?? "");
      }

      setPageLoading(false);
    }

    loadCompany();
  }, [router]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("Nem vagy bejelentkezve.");
      setLoading(false);
      return;
    }

    if (companyId) {
      const { error } = await supabase
        .from("companies")
        .update({
          name,
          slug: createSlug(name),
          description,
          location,
          website: website.trim() || null,
        })
        .eq("id", companyId)
        .eq("owner_id", user.id);

      if (error) {
        console.error("Cégprofil frissítési hiba:", error);
        setErrorMessage(
          "Nem sikerült frissíteni a cégprofilt."
        );
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("companies")
        .insert({
          name,
          slug: createSlug(name),
          description,
          location,
          website: website.trim() || null,
          owner_id: user.id,
          verified: false,
        });

      if (error) {
        console.error("Cégprofil mentési hiba:", error);
        setErrorMessage(
          "Nem sikerült létrehozni a cégprofilt."
        );
        setLoading(false);
        return;
      }
    }

    router.push("/munkaltato");
    router.refresh();
  }

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <p className="text-slate-600">
            Cégprofil betöltése...
          </p>
        </div>
      </main>
    );
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
            {companyId
              ? "Cégprofil szerkesztése"
              : "Cégprofil létrehozása"}
          </h1>

          <p className="mt-2 text-slate-600">
            {companyId
              ? "Módosítsd a vállalkozás adatait."
              : "Add meg a vállalkozás alapadatait."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Cégnév
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Telephely / város
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Weboldal
              </label>

              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Cég bemutatása
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={5}
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
              {loading
                ? "Mentés..."
                : companyId
                  ? "Cégprofil mentése"
                  : "Cégprofil létrehozása"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}