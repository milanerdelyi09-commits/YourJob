"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ClearFiltersButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function clearFilters() {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.delete("munkarend");
    params.delete("minber");
    params.delete("maxber");
    params.delete("rendezes");

    router.push(`/allasok?${params.toString()}`);
  }

  return (
    <button
      type="button"
      onClick={clearFilters}
      className="mt-6 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      Szűrők törlése
    </button>
  );
}