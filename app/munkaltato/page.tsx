import { createClient as createServerClient } from "../../lib/supabaseServer";
import { redirect } from "next/navigation";
import { closeJob, reactivateJob } from "./allasok/actions";
export default async function EmployerPage() {
  const supabaseAuth = await createServerClient();

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user || user.app_metadata?.role !== "employer") {
    redirect("/munkaltato/login");
  }
  const { data: company } = await supabaseAuth
  .from("companies")
  .select("id, name, slug, verified")
  .eq("owner_id", user.id)
  .maybeSingle();
  const { count: jobsCount } = company
  ? await supabaseAuth
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company.id)
      .eq("status", "active")
  : { count: 0 };
  const { data: employerJobs } = company
  ? await supabaseAuth
      .from("jobs")
      .select("id, slug, title, location, salary, type")
      .eq("company_id", company.id)
.eq("status", "active")
.order("created_at", { ascending: false })
  : { data: [] };
  const { count: newApplicationsCount } = await supabaseAuth
  .from("applications")
  .select("*", { count: "exact", head: true })
  .eq("status", "submitted");
  const { data: closedJobs } = company
  ? await supabaseAuth
      .from("jobs")
      .select("id, slug, title, location, salary, type")
      .eq("company_id", company.id)
      .eq("status", "closed")
      .order("created_at", { ascending: false })
  : { data: [] };
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              YourJob Munkáltatói felület
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-600">
              Kezeld az álláshirdetéseidet és a jelentkezőidet.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Aktív álláshirdetések
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
  {jobsCount ?? 0}
</p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Új jelentkezők
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
  {newApplicationsCount ?? 0}
</p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Cégprofil
            </p>

           <p className="mt-3 font-semibold text-slate-900">
  {company?.name ?? "Nincs még beállítva"}
</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Álláshirdetések
            </h2>

            <p className="mt-2 text-slate-600">
              Itt fogod tudni létrehozni és kezelni a cég álláshirdetéseit.
              
            </p>
            <div className="mt-5 space-y-3">
  {(employerJobs ?? []).map((job) => (
  <div
  
  
    key={job.id}
    className="rounded-xl border border-slate-200 p-4"
  >
    <a
      href={`/allasok/${job.slug}`}
      className="block hover:bg-slate-50"
    >
      <p className="font-bold text-slate-900">
        {job.title}
      </p>

      <p className="mt-1 text-sm text-slate-600">
        {job.location} · {job.salary} · {job.type}
      </p>
    </a>

    <a
      href={`/munkaltato/allasok/${job.id}/szerkesztes`}
      className="mt-4 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      Szerkesztés
    </a>
    <form action={closeJob.bind(null, job.id)} className="inline-block">
  <button
    type="submit"
    className="ml-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
  >
    Hirdetés lezárása
  </button>
</form>
  </div>
  
))}


  {(employerJobs ?? []).length === 0 && (
    <p className="text-sm text-slate-500">
      Még nincs aktív álláshirdetésed.
    </p>
  )}
</div>

            <a
  href="/munkaltato/allasok/uj"
  className="mt-6 inline-block rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
>
  Új álláshirdetés
</a>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Jelentkezők
            </h2>

            <p className="mt-2 text-slate-600">
              Itt jelennek majd meg a saját állásaidra érkező jelentkezések.
            </p>

            <a
  href="/munkaltato/jelentkezok"
  className="mt-6 inline-block rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
>
  Jelentkezők megtekintése
</a>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
  <h2 className="text-xl font-bold text-slate-900">
    Lezárt állások
  </h2>

  <p className="mt-2 text-slate-600">
    Ezek a hirdetések már nem jelennek meg az álláskeresőknek.
  </p>

  <div className="mt-5 space-y-3">
    {(closedJobs ?? []).map((job) => (
      <div
        key={job.id}
        className="rounded-xl border border-slate-200 p-4"
      >
        <p className="font-bold text-slate-900">
          {job.title}
        </p>

        <p className="mt-1 text-sm text-slate-600">
          {job.location} · {job.salary} · {job.type}
        </p>

        <span className="mt-3 inline-block rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
          Lezárt
        </span>
        <form
  action={reactivateJob.bind(null, job.id)}
  className="mt-3"
>
  <button
    type="submit"
    className="rounded-lg border border-green-300 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
  >
    Újraaktiválás
  </button>
</form>
      </div>
    ))}

    {(closedJobs ?? []).length === 0 && (
      <p className="text-sm text-slate-500">
        Nincs lezárt álláshirdetésed.
      </p>
    )}
  </div>
</div>
    </main>
  );
}