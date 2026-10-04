"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../../lib/supabaseClient";

type Props = {
  job: {
    id: number;
    title: string;
    location: string;
    salary: string;
    type: string;
    description: string;
    requirements: string[];
  };
};

export default function EditJobForm({ job }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(job.title);
  const [location, setLocation] = useState(job.location);
  const [salary, setSalary] = useState(job.salary);
  const [jobType, setJobType] = useState(job.type);
  const [description, setDescription] = useState(job.description);
  const [requirements, setRequirements] = useState(
    job.requirements.join("\n")
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const requirementsArray = requirements
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("jobs")
      .update({
        title,
        location,
        salary,
        type: jobType,
        description,
        requirements: requirementsArray,
      })
      .eq("id", job.id);

    if (error) {
      console.error("Álláshirdetés módosítási hiba:", error);
      setErrorMessage("Nem sikerült elmenteni a módosításokat.");
      setLoading(false);
      return;
    }

    router.push("/munkaltato");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label className="mb-2 block font-semibold text-slate-700">
          Pozíció neve
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        {loading ? "Mentés..." : "Módosítások mentése"}
      </button>
    </form>
  );
}