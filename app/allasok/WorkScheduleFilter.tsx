"use client";

import { useRouter, useSearchParams } from "next/navigation";

const options = [
  {
    value: "teljes",
    label: "Teljes munkaidő",
  },
  {
    value: "resz",
    label: "Részmunkaidő",
  },
  {
    value: "muszak",
    label: "Több műszak",
  },
];

export default function WorkScheduleFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected =
    searchParams
      .get("munkarend")
      ?.split(",")
      .filter(Boolean) ?? [];

  function handleChange(value: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    let nextSelected: string[];

    if (selected.includes(value)) {
      nextSelected = selected.filter(
        (item) => item !== value
      );
    } else {
      nextSelected = [...selected, value];
    }

    if (nextSelected.length === 0) {
      params.delete("munkarend");
    } else {
      params.set(
        "munkarend",
        nextSelected.join(",")
      );
    }

    router.push(`/allasok?${params.toString()}`);
  }

  return (
    <div className="mt-3 space-y-3 text-sm text-slate-600">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer gap-2"
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() =>
              handleChange(option.value)
            }
          />

          {option.label}
        </label>
      ))}
    </div>
  );
}