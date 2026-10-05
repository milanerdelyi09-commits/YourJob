"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabaseClient";

type Props = {
  userId: string;
  existingProfile?: {
    full_name?: string | null;
    phone?: string | null;
    location?: string | null;
    bio?: string | null;
    preferred_job?: string | null;
    experience?: string | null;
    skills?: string[] | null;
  } | null;
};

export default function ProfileForm({
  userId,
  existingProfile,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState(
    existingProfile?.full_name ?? ""
  );
  const [phone, setPhone] = useState(
    existingProfile?.phone ?? ""
  );
  const [location, setLocation] = useState(
    existingProfile?.location ?? ""
  );
  const [preferredJob, setPreferredJob] = useState(
    existingProfile?.preferred_job ?? ""
  );
  const [experience, setExperience] = useState(
    existingProfile?.experience ?? ""
  );
  const [bio, setBio] = useState(
    existingProfile?.bio ?? ""
  );
  const [skills, setSkills] = useState(
    Array.isArray(existingProfile?.skills)
      ? existingProfile.skills.join("\n")
      : ""
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const skillsArray = skills
      .split("\n")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: fullName,
        phone,
        location,
        preferred_job: preferredJob,
        experience,
        bio,
        skills: skillsArray,
      });

    if (error) {
      console.error("Profil mentési hiba:", error);
      setErrorMessage("Nem sikerült elmenteni a profilt.");
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
          Telefonszám
        </label>

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-slate-700">
          Lakhely
        </label>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="pl. Gyöngyös"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-slate-700">
          Keresett munkakör
        </label>

        <input
          type="text"
          value={preferredJob}
          onChange={(e) => setPreferredJob(e.target.value)}
          placeholder="pl. Gépkezelő"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-slate-700">
          Tapasztalat
        </label>

        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-slate-700">
          Készségek
        </label>

        <p className="mb-2 text-sm text-slate-500">
          Minden készséget külön sorba írj.
        </p>

        <textarea
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          rows={5}
          placeholder={`Targoncavezetés
CNC gépkezelés
Microsoft Office`}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-slate-700">
          Rövid bemutatkozás
        </label>

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
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
        {loading ? "Mentés..." : "Profil mentése"}
      </button>
    </form>
  );
}