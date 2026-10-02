import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { createClient as createServerClient } from "../../lib/supabaseServer";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import StatusSelect from "./StatusSelect";
type JobInfo = {
  title: string;
  company: string;
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

export default async function AdminPage() {
  const supabaseAuth = await createServerClient();

const {
  data: { user },
} = await supabaseAuth.auth.getUser();

if (!user || user.app_metadata?.role !== "admin") {
  redirect("/admin/login");
}
  const { data: applications, error } = await supabaseAdmin
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
      title,
      company,
      location
    )
  `)
  .order("created_at", { ascending: false });

  if (error) {
 
}

  const rows = (applications ?? []) as unknown as ApplicationRow[];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
       <div className="flex items-center justify-between gap-4">
  <h1 className="text-3xl font-bold text-slate-900">
    Jelentkezések
  </h1>

  <LogoutButton />
</div>

        <p className="mt-2 text-slate-600">
          Beérkezett álláspályázatok kezelése
          
        </p>
        <div className="mt-8 space-y-4">
          {rows.map((application) => (
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

                <div className="text-sm text-slate-500">
                  {new Date(application.created_at).toLocaleString("hu-HU")}
                </div>
              </div>

              <div className="mt-5 border-t pt-5">
                <p className="font-semibold text-slate-900">
                  Állás:
                </p>

               <p className="mt-1 text-slate-600">
  {(Array.isArray(application.job)
    ? application.job[0]?.title
    : application.job?.title) ?? "Ismeretlen állás"}
</p>

<p className="text-sm text-slate-500">
  {Array.isArray(application.job)
    ? `${application.job[0]?.company ?? ""} · ${application.job[0]?.location ?? ""}`
    : `${application.job?.company ?? ""} · ${application.job?.location ?? ""}`}
</p>
              </div>

              {application.message && (
                <div className="mt-5 border-t pt-5">
                  <p className="font-semibold text-slate-900">
                    Bemutatkozás
                  </p>
F
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

          {rows.length === 0 && (
            <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">
              Még nincs beérkezett jelentkezés.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}