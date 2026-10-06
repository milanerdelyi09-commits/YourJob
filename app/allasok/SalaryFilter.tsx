"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SalaryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const minFromUrl = searchParams.get("minber") ?? "";
  const maxFromUrl = searchParams.get("maxber") ?? "";

  const [minSalary, setMinSalary] = useState(minFromUrl);
  const [maxSalary, setMaxSalary] = useState(maxFromUrl);

  // Ha kívülről változik az URL
  // pl. "Szűrők törlése" miatt,
  // frissítjük az input mezőket is.
  useEffect(() => {
    setMinSalary(minFromUrl);
    setMaxSalary(maxFromUrl);
  }, [minFromUrl, maxFromUrl]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(
        searchParams.toString()
      );

      if (minSalary) {
        params.set("minber", minSalary);
      } else {
        params.delete("minber");
      }

      if (maxSalary) {
        params.set("maxber", maxSalary);
      } else {
        params.delete("maxber");
      }

      const newQuery = params.toString();
      const currentQuery = searchParams.toString();

      if (newQuery !== currentQuery) {
        router.replace(`/allasok?${newQuery}`);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [
    minSalary,
    maxSalary,
    router,
    searchParams,
  ]);

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <input
        type="number"
        placeholder="Min."
        value={minSalary}
        onChange={(e) =>
          setMinSalary(e.target.value)
        }
        className="w-full rounded-lg border px-3 py-2 text-sm"
      />

      <input
        type="number"
        placeholder="Max."
        value={maxSalary}
        onChange={(e) =>
          setMaxSalary(e.target.value)
        }
        className="w-full rounded-lg border px-3 py-2 text-sm"
      />
    </div>
  );
}