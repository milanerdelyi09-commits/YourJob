import { supabase } from "../../lib/supabase";
export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ kereses?: string; hely?: string }>;
}) {
  const params = await searchParams;
  const search = (params.kereses || "").toLowerCase();
  const location = (params.hely || "").toLowerCase();
  const { data, error } = await supabase
  .from("jobs")
  .select("*");

const jobs = data ?? [];

if (error) {
  console.error("Supabase hiba:", error);
}
  return (
    
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-bold tracking-tight text-blue-700"
          >
            YourJob
          </a>

          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-blue-700"
            >
              Főoldal
            </a>

            <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50">
              Belépés
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Állások
          </h1>
<form
  action="/allasok"
  method="GET"
  className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
>
            <input
              type="text"
              placeholder="Milyen munkát keresel?"
              defaultValue={params.kereses || ""}
                           name="kereses"
              className="rounded-xl border border-slate-300 bg-white px-5 py-4 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="Hol szeretnél dolgozni?"
              defaultValue={params.hely || ""}
                           name="hely"
              className="rounded-xl border border-slate-300 bg-white px-5 py-4 outline-none focus:border-blue-500"
            />

           <button
  type="submit"
  className="rounded-xl bg-blue-700 px-8 py-4 font-semibold text-white hover:bg-blue-800"
>
  Keresés
</button>
          </form>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* FILTERS */}
          <aside className="w-full rounded-2xl border border-slate-200 bg-white p-6 lg:w-72">
            <h2 className="font-bold text-slate-900">
              Szűrés
            </h2>

            <div className="mt-6">
              <label className="text-sm font-semibold text-slate-700">
                Munkarend
              </label>

              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <label className="flex gap-2">
                  <input type="checkbox" />
                  Teljes munkaidő
                </label>

                <label className="flex gap-2">
                  <input type="checkbox" />
                  Részmunkaidő
                </label>

                <label className="flex gap-2">
                  <input type="checkbox" />
                  Több műszak
                </label>
              </div>
            </div>

            <div className="mt-8">
              <label className="text-sm font-semibold text-slate-700">
                Fizetés
              </label>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Min."
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />

                <input
                  type="text"
                  placeholder="Max."
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-8">
              <label className="text-sm font-semibold text-slate-700">
                Távolság
              </label>

              <select className="mt-3 w-full rounded-lg border px-3 py-2 text-sm">
                <option>Mindegy</option>
                <option>10 km-en belül</option>
                <option>25 km-en belül</option>
                <option>50 km-en belül</option>
              </select>
            </div>
          </aside>

          {/* JOBS */}
          <div className="flex-1">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-500">
      {jobs.filter((job) =>
  job.title.toLowerCase().includes(search) &&
  job.location.toLowerCase().includes(location)
).length} állás található
              </p>

              <select className="rounded-lg border bg-white px-3 py-2 text-sm">
                <option>Legrelevánsabb</option>
                <option>Legfrissebb</option>
                <option>Fizetés szerint</option>
              </select>
            </div>

            <div className="space-y-4">
              {jobs
  .filter((job) =>
  job.title.toLowerCase().includes(search) &&
  job.location.toLowerCase().includes(location)
)
.map((job) => (
                <article
                  key={job.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900">
                          {job.title}
                        </h2>

                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {job.match}% illeszkedés
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-medium text-slate-600">
                        {job.company}
                      </p>

                      <div className="mt-4 space-y-1 text-sm text-slate-600">
                        <p>📍 {job.location}</p>
                        <p>💰 {job.salary}</p>
                        <p>🕐 {job.type}</p>
                      </div>
                    </div>

                    <a
  href={`/allasok/${job.slug}`}
  className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
>
  Részletek
</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}