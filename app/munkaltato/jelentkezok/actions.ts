"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "../../../lib/supabaseServer";

const allowedStatuses = [
  "submitted",
  "reviewing",
  "accepted",
  "rejected",
];

export async function updateEmployerApplicationStatus(
  applicationId: number,
  status: string
) {
  if (!allowedStatuses.includes(status)) {
    throw new Error("Érvénytelen státusz.");
  }

  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "employer") {
    throw new Error("Nincs jogosultságod ehhez a művelethez.");
  }

  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) {
    throw new Error("Nem sikerült módosítani a jelentkezés státuszát.");
  }

  revalidatePath("/munkaltato");
  revalidatePath("/munkaltato/jelentkezok");
}