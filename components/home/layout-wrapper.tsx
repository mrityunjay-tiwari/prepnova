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
  const hideNavbar =
    pathname.startsWith("/interview") || pathname.startsWith("/signin");

  return (
    <>
      {!hideNavbar && navbar}
      {children}
    </>
  );
}
