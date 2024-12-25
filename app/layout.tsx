"use client";

import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast"; // Tambahkan import untuk Toaster
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
        <Toaster position="top-right" reverseOrder={false} />
        {isNoLayout ? (
          // Jika path termasuk noLayoutPaths, render hanya children
          <div>{children}</div>
        ) : (
          // Layout default tanpa Header
          <div className="h-screen flex bg-[#F4F6FA] overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen">
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
