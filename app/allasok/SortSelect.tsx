"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({
  currentSort,
}: {
  currentSort: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("rendezes", value);

    router.push(`/allasok?${params.toString()}`);
  }

  return (
    <select
      value={currentSort}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border bg-white px-3 py-2 text-sm"
    >
      <option value="relevance">
        Legrelevánsabb
      </option>

      <option value="latest">
        Legfrissebb
      </option>

      <option value="salary">
        Fizetés szerint
      </option>
    </select>
  );
}