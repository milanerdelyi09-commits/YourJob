"use client";

import { useTransition } from "react";
import { updateEmployerApplicationStatus } from "./actions";
type Props = {
  applicationId: number;
  currentStatus: string;
};

export default function StatusSelect({
  applicationId,
  currentStatus,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleChange(status: string) {
    startTransition(async () => {
      await updateEmployerApplicationStatus(applicationId, status);
    });
  }

  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
    >
      <option value="submitted">Új</option>
      <option value="reviewing">Átnézés alatt</option>
      <option value="accepted">Elfogadva</option>
      <option value="rejected">Elutasítva</option>
    </select>
  );
}