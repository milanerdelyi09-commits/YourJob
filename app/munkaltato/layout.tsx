import type { ReactNode } from "react";
import EmployerNav from "./EmployerNav";

export default function EmployerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <EmployerNav />
      {children}
    </>
  );
}