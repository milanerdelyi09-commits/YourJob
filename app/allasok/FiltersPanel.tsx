"use client";

import { useState } from "react";
import WorkScheduleFilter from "./WorkScheduleFilter";
import SalaryFilter from "./SalaryFilter";
import ClearFiltersButton from "./ClearFiltersButton";

export default function FiltersPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full lg:w-72">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="mb-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 lg:hidden"
      >
        {open ? "Szűrők bezárása ▲" : "Szűrők megnyitása ▼"}
      </button>

      <aside
        className={`rounded-2xl border border-slate-200 bg-white p-6 ${
          open ? "block" : "hidden"
        } lg:block`}
      >
        <h2 className="font-bold text-slate-900">
          Szűrés
        </h2>

        <div className="mt-6">
          <label className="text-sm font-semibold text-slate-700">
            Munkarend
          </label>

          <WorkScheduleFilter />
        </div>

        <div className="mt-8">
          <label className="text-sm font-semibold text-slate-700">
            Fizetés
          </label>

          <SalaryFilter />
        </div>

        <ClearFiltersButton />
      </aside>
    </div>
  );
}