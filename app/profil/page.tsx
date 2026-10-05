import { redirect } from "next/navigation";
import { createClient as createServerClient } from "../../lib/supabaseServer";
import ProfileForm from "./ProfileForm";
import JobseekerNav from "../JobseekerNav";

export default async function ProfilePage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/belepes");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <JobseekerNav />
        
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-blue-700">
            YourJob profil
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {profile?.full_name ?? "Álláskeresői profil"}
          </h1>

          <p className="mt-2 text-slate-600">
            {user.email}
          </p>

          {!profile && (
            <div className="mt-8 rounded-xl bg-blue-50 p-5">
              <p className="font-semibold text-blue-900">
                A profilod még nincs kitöltve.
              </p>

              <p className="mt-1 text-sm text-blue-700">
                Töltsd ki az alábbi adatokat a profilod létrehozásához.
              </p>
            </div>
          )}

          {profile && (
            <div className="mt-8 rounded-xl bg-green-50 p-5">
              <p className="font-semibold text-green-900">
                A profilod már létre van hozva.
              </p>

              <p className="mt-1 text-sm text-green-700">
                Az alábbi mezőkben bármikor módosíthatod az adataidat.
              </p>
            </div>
          )}

          <ProfileForm
            userId={user.id}
            existingProfile={profile}
          />
        </div>
      </div>
    </main>
  );
}