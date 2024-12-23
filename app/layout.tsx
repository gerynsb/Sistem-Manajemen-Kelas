import "@/styles/globals.css"; // Pastikan import CSS sesuai lokasi file
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata = {
  title: "SMKD Management",
  description: "A management system for SMKD",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex bg-[#F4F6FA]">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            {/* Dynamic Page Content */}
            <div className="flex-1 p-4">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
