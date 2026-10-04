import { redirect } from "next/navigation";
import { createClient as createServerClient } from "../../../lib/supabaseServer";
import StatusSelect from "./StatusSelect";
type JobInfo = {
  id: number;
  title: string;
  slug: string;
  location: string;
};

type ApplicationRow = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
  job: JobInfo | null;
};

export default async function EmployerApplicationsPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "employer") {
    redirect("/munkaltato/login");
  }

  const { data, error } = await supabase
    .from("applications")
    .select(`
      id,
      name,
      email,
      phone,
      message,
      status,
      created_at,
      job:jobs!applications_job_id_fkey (
        id,
        title,
        slug,
        location
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Jelentkezők lekérési hiba:", error);
  }

  const applications = (data ?? []) as unknown as ApplicationRow[];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <a
          href="/munkaltato"
          className="font-semibold text-blue-700 hover:underline"
        >
          ← Vissza a dashboardra
        </a>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Jelentkezők
          </h1>

          <p className="mt-2 text-slate-600">
            A saját álláshirdetéseidre érkezett jelentkezések.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {application.name}
                  </h2>

                  <p className="mt-1 text-slate-600">
                    {application.email}
                  </p>

                  <p className="text-slate-600">
                    {application.phone}
                  </p>
                </div>

                <p className="text-sm text-slate-500">
                  {new Date(application.created_at).toLocaleString("hu-HU")}
                </p>
              </div>

              <div className="mt-5 border-t pt-5">
                <p className="text-sm font-semibold text-slate-500">
                  Jelentkezett erre:
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {application.job?.title ?? "Ismeretlen állás"}
                </p>

                <p className="text-sm text-slate-500">
                  {application.job?.location}
                </p>
              </div>

              {application.message && (
                <div className="mt-5 border-t pt-5">
                  <p className="font-semibold text-slate-900">
                    Bemutatkozás
                  </p>

                  <p className="mt-2 text-slate-600">
                    {application.message}
                  </p>
                </div>
              )}

              <div className="mt-5 border-t pt-5">
  <StatusSelect
    applicationId={application.id}
    currentStatus={application.status ?? "submitted"}
  />
</div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">
              Még nincs jelentkező a saját álláshirdetéseidre.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}