"use client";

import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast"; 
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noLayoutPaths = ["/signup", "/login"];
  const isNoLayout = noLayoutPaths.includes(pathname);

  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" reverseOrder={false} />
        {isNoLayout ? (
          <div>{children}</div>
        ) : (
          <div className="h-screen flex bg-[#F4F6FA] overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-auto">
              {/* Dynamic Page Content */}
              <div className="flex-1 overflow-auto px-4 pt-6">
                {children}
              </div>
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
