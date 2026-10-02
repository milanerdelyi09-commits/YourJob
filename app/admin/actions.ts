"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { createClient as createServerClient } from "../../lib/supabaseServer";

const allowedStatuses = [
  "submitted",
  "reviewing",
  "accepted",
  "rejected",
];

export async function updateApplicationStatus(
  applicationId: number,
  status: string
) {
  const supabaseAuth = await createServerClient();

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    throw new Error("Nincs jogosultságod ehhez a művelethez.");
  }

  if (!allowedStatuses.includes(status)) {
    throw new Error("Érvénytelen státusz.");
  }

  const { error } = await supabaseAdmin
    .from("applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) {
    throw new Error("Nem sikerült módosítani a jelentkezés státuszát.");
  }

  revalidatePath("/admin");
}