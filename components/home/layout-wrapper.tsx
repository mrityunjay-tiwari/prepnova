"use client";

import {usePathname} from "next/navigation";

export default function LayoutWrapper({
  children,
  navbar,
}: {
  children: React.ReactNode;
  navbar?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isInterviewPage = pathname.startsWith("/interview");

  return (
    <>
      {!isInterviewPage && navbar}
      {children}
    </>
  );
}
