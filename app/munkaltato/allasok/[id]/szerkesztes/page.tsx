import { notFound, redirect } from "next/navigation";
import { createClient as createServerClient } from "../../../../../lib/supabaseServer";
import EditJobForm from "./EditJobForm";
export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "employer") {
    redirect("/munkaltato/login");
  }

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!company) {
    redirect("/munkaltato/cegprofil");
  }

  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, location, salary, type, description, requirements")
    .eq("id", Number(id))
    .eq("company_id", company.id)
    .single();

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <a
          href="/munkaltato"
          className="font-semibold text-blue-700 hover:underline"
        >
          ← Vissza a dashboardra
        </a>

        <div className="mt-6 rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Álláshirdetés szerkesztése
          </h1>

          <EditJobForm job={job} />
        </div>
      </div>
    </main>
  );
}