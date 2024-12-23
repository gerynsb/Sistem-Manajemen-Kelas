"use client";

import { usePathname } from "next/navigation";

type ClientWrapperProps = {
  children: React.ReactNode;
  renderHeader?: boolean; // Tambahan untuk kontrol render header
};

export default function ClientWrapper({ children, renderHeader = true }: ClientWrapperProps) {
  const pathname = usePathname();
  const isSettingsPage = pathname === "/settings";

  return (
    <>
      {/* Render Header jika halaman bukan settings */}
      {renderHeader && !isSettingsPage && <>{children}</>}
    </>
  );
}
