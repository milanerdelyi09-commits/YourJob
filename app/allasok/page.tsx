import { supabase } from "../../lib/supabase";
import SortSelect from "./SortSelect";
import WorkScheduleFilter from "./WorkScheduleFilter";
import SalaryFilter from "./SalaryFilter";
import ClearFiltersButton from "./ClearFiltersButton";
import UserAccountNav from "../UserAccountNav";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    kereses?: string;
    hely?: string;
    rendezes?: string;
    munkarend?: string;
    minber?: string;
    maxber?: string;
  }>;
}) {
  const params = await searchParams;
  const search = (params.kereses || "").toLowerCase();
  const location = (params.hely || "").toLowerCase();
  const sort = params.rendezes || "relevance";
  const minSalary = Number(params.minber || 0);
const maxSalary = Number(params.maxber || 0);
const workSchedules = (params.munkarend || "")

  .split(",")
  .filter(Boolean);
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "active");

  const jobs = data ?? [];
  function getSalaryRange(salary: string | null) {
  if (!salary) {
    return {
      min: 0,
      max: 0,
    };
  }

  const numbers =
    salary
      .match(/\d[\d\s.]*/g)
      ?.map((value) =>
        Number(value.replace(/[^\d]/g, ""))
      )
      .filter((value) => !Number.isNaN(value)) ?? [];

  if (numbers.length === 0) {
    return {
      min: 0,
      max: 0,
    };
  }

  if (numbers.length === 1) {
    return {
      min: numbers[0],
      max: numbers[0],
    };
  }

  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers),
  };
}
const filteredJobs = jobs.filter((job) => {
  const matchesSearch = job.title
    .toLowerCase()
    .includes(search);

  const matchesLocation = job.location
    .toLowerCase()
    .includes(location);

  const jobType = (job.type ?? "").toLowerCase();

  const matchesWorkSchedule =
    workSchedules.length === 0 ||
    workSchedules.some((schedule) => {
      if (schedule === "teljes") {
        return jobType.includes("teljes munkaidő");
      }

      if (schedule === "resz") {
        return jobType.includes("részmunkaidő");
      }

      if (schedule === "muszak") {
        return jobType.includes("műszak");
      }

      return false;
    });
const salaryRange = getSalaryRange(job.salary);

const matchesSalary =
  (minSalary === 0 || salaryRange.max >= minSalary) &&
  (maxSalary === 0 || salaryRange.min <= maxSalary);
  return (
    matchesSearch &&
    matchesLocation &&
    matchesWorkSchedule &&
    matchesSalary 
  );
});


function getSalaryNumber(salary: string | null) {
  if (!salary) return 0;

  const numbers =
    salary
      .match(/\d[\d\s.]*/g)
      ?.map((value) =>
        Number(value.replace(/[^\d]/g, ""))
      )
      .filter((value) => !Number.isNaN(value)) ?? [];

  return numbers.length > 0 ? Math.max(...numbers) : 0;
}

const sortedJobs = [...filteredJobs].sort((a, b) => {
  if (sort === "latest") {
    return (
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
    );
  }

  if (sort === "salary") {
    return (
      getSalaryNumber(b.salary) -
      getSalaryNumber(a.salary)
    );
  }

  return (b.match ?? 0) - (a.match ?? 0);
});

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

  <UserAccountNav />
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

             <WorkScheduleFilter />
            </div>

            <div className="mt-8">
  <label className="text-sm font-semibold text-slate-700">
    Fizetés
  </label>

  <SalaryFilter />
</div>
<ClearFiltersButton />
          </aside>

          {/* JOBS */}
          <div className="flex-1">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-500">
      {filteredJobs.length} állás található
              </p>

              <SortSelect currentSort={sort} />
            </div>

            <div className="space-y-4">
              {sortedJobs.map((job) => (
                <article
                  key={job.id}
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