import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const jobs = [
  {
    id: "raktaros",
    title: "Raktáros",
    company: "Minta Logisztika Kft.",
    location: "Gyöngyös",
    salary: "350 000 – 450 000 Ft",
    type: "Teljes munkaidő",
    match: 92,
    description:
  "Raktári áruk átvétele, ellenőrzése, komissiózása és kiadása. A munkakör része a raktári rend fenntartása és a készletmozgások pontos kezelése.",
  requirements: [
  "Pontos, megbízható munkavégzés",
  "Jó fizikai állóképesség",
  "Alapvető számítógépes ismeretek",
],
  },
  {
    id: "gepkezelo",
    title: "Gépkezelő",
    company: "Minta Ipari Kft.",
    location: "Eger",
    salary: "380 000 – 480 000 Ft",
    type: "3 műszak",
    match: 87,
  },
  {
    id: "tehergepkocsi-vezeto",
    title: "Tehergépkocsi-vezető",
    company: "Minta Fuvarozás Kft.",
    location: "Hatvan",
    salary: "450 000 – 600 000 Ft",
    type: "Teljes munkaidő",
    match: 81,
  },
  {
    id: "cnc-gepkezelo",
    title: "CNC gépkezelő",
    company: "Minta Gépipar Kft.",
    location: "Gyöngyös",
    salary: "420 000 – 520 000 Ft",
    type: "2 műszak",
    match: 89,
  },
];

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

const { data: job, error } = await supabase
  .from("jobs")
  .select("*")
  .eq("slug", id)
  .single();
  console.log("REQUIREMENTS:", job?.requirements);
if (error || !job) {
  notFound();
}

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <a
          href="/allasok"
          className="mb-6 inline-block text-sm font-semibold text-blue-700 hover:underline"
        >
          ← Vissza az állásokhoz
        </a>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {job.title}
              </h1>

              <p className="mt-2 text-lg text-slate-600">
                {job.company}
              </p>

              <p className="mt-2 text-slate-500">
                {job.location}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 px-4 py-3 font-bold text-green-700">
              {job.match}% egyezés
            </div>
          </div>

          <div className="grid gap-4 border-t pt-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Fizetés</p>
              <p className="font-semibold text-slate-900">
                {job.salary}
              </p>
            </div>
            

            <div>
              <p className="text-sm text-slate-500">Munkarend</p>
              <p className="font-semibold text-slate-900">
                {job.type}
              </p>
            </div>
            <div className="mt-8 border-t pt-6">
  <h2 className="text-xl font-bold text-slate-900">
    Munkakör leírása
  </h2>

  <p className="mt-3 leading-7 text-slate-600">
    {job.description}
  </p>
</div>
<div className="mt-8 border-t pt-6">
  <h2 className="text-xl font-bold text-slate-900">
    Elvárások
  </h2>

 <ul className="mt-3 space-y-2 text-slate-600">
  {Array.isArray(job.requirements) &&
    job.requirements.map((requirement: string) => (
      <li key={requirement}>
        • {requirement}
      </li>
    ))}
</ul>
</div>
<div className="mt-8 border-t pt-6">
  <a
    href={`/allasok/${job.slug}/jelentkezes`}
    className="inline-block rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800"
  >
    Jelentkezem
  </a>
</div>
          </div>
        </div>
      </div>
    </main>
  );
}