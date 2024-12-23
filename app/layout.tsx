"use client";

import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Mengambil path aktif

  // Tentukan path yang tidak memerlukan layout
  const noLayoutPaths = ["/signup", "/login"];

  // Cek apakah path aktif termasuk ke dalam noLayoutPaths
  const isNoLayout = noLayoutPaths.includes(pathname);

  return (
    <html lang="en">
      <body>
        {isNoLayout ? (
          // Jika path termasuk noLayoutPaths, render hanya children
          <div>{children}</div>
        ) : (
          // Layout default dengan Sidebar dan Header
          <div className="h-screen flex bg-[#F4F6FA] overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen">
              {/* Header */}
              <Header />

              {/* Dynamic Page Content */}
              <div className="flex-1 flex items-center justify-center">
                {children}
              </div>
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
