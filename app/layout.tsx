"use client";

import "@/styles/globals.css"; // Pastikan import CSS sesuai lokasi file
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ClientWrapper from "@/components/ClientWrapper";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="h-screen flex bg-[#F4F6FA] overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 flex flex-col h-screen">
            {/* Header */}
            <ClientWrapper>
              <Header />
            </ClientWrapper>

            {/* Dynamic Page Content */}
            <div className="flex-1 flex items-center justify-center">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
