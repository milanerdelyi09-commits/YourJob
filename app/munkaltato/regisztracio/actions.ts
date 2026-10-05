"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function registerEmployer(
  email: string,
  password: string
) {
  if (!email || !password) {
    return {
      success: false,
      message: "Add meg az e-mail címet és a jelszót.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "A jelszó legalább 8 karakter hosszú legyen.",
    };
  }

  const { data, error } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,

      // MVP-ben egyelőre azonnal aktiváljuk.
      email_confirm: true,

      app_metadata: {
        role: "employer",
      },
    });

  if (error) {
    console.error("Munkáltatói regisztrációs hiba:", error);

    return {
      success: false,
      message: "Nem sikerült létrehozni a munkáltatói fiókot.",
    };
  }

  if (!data.user) {
    return {
      success: false,
      message: "Nem sikerült létrehozni a felhasználót.",
    };
  }

  return {
    success: true,
    message: "Sikeres regisztráció.",
  };
}