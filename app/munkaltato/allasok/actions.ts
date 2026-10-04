"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "../../../lib/supabaseServer";

export async function closeJob(jobId: number) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "employer") {
    throw new Error("Nincs jogosultságod ehhez a művelethez.");
  }
  

  const { error } = await supabase
    .from("jobs")
    .update({ status: "closed" })
    .eq("id", jobId);

  if (error) {
    throw new Error("Nem sikerült lezárni az álláshirdetést.");
  }
  

  revalidatePath("/munkaltato");
  revalidatePath("/allasok");
}
export async function reactivateJob(jobId: number) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "employer") {
    throw new Error("Nincs jogosultságod ehhez a művelethez.");
  }

  const { error } = await supabase
    .from("jobs")
    .update({ status: "active" })
    .eq("id", jobId);

  if (error) {
    throw new Error("Nem sikerült újraaktiválni az álláshirdetést.");
  }

  revalidatePath("/munkaltato");
  revalidatePath("/allasok");
}