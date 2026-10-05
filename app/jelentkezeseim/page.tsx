import { redirect } from "next/navigation";
import { createClient as createServerClient } from "../../lib/supabaseServer";
import JobseekerNav from "../JobseekerNav";
type JobInfo = {
  title: string;
  slug: string;
  company: string;
  location: string;
};

type ApplicationRow = {
  id: number;
  created_at: string;
  status: string | null;
  job: JobInfo | null;
};

function getStatusLabel(status: string | null) {
  switch (status) {
    case "reviewing":
      return "Átnézés alatt";
    case "accepted":
      return "Elfogadva";
    case "rejected":
      return "Elutasítva";
    default:
      return "Beküldve";
  }
}

export default async function ApplicationsPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/belepes");
  }

  const { data, error } = await supabase
    .from("applications")
    .select(`
      id,
      created_at,
      status,
      job:jobs!applications_job_id_fkey (
        title,
        slug,
        company,
        location
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const applications = (data ?? []) as unknown as ApplicationRow[];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <JobseekerNav />
            
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Jelentkezéseim
            </h1>
          </div>
        
        {error && (
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            Nem sikerült betölteni a jelentkezéseket.
          </div>
        )}

        {!error && applications.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <p className="font-semibold text-slate-900">
              Még nincs jelentkezésed.
            </p>

            <a
              href="/allasok"
              className="mt-4 inline-block font-semibold text-blue-700 hover:underline"
            >
              Állások böngészése →
            </a>
          </div>
        )}

        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {application.job?.title ?? "Ismeretlen állás"}
                  </h2>

                  <p className="mt-1 text-slate-600">
                    {application.job?.company ?? "Ismeretlen cég"}
                    {application.job?.location
                      ? ` · ${application.job.location}`
                      : ""}
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {getStatusLabel(application.status)}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Jelentkezés ideje:{" "}
                {new Date(application.created_at).toLocaleDateString("hu-HU")}
              </p>

              {application.job?.slug && (
                <a
                  href={`/allasok/${application.job.slug}`}
                  className="mt-4 inline-block font-semibold text-blue-700 hover:underline"
                >
                  Állás megtekintése →
                </a>
              )}
            </div>
          ))}
        </div>
    </main>
  );
}