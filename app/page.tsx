"use client";

import Header from "@/components/Header";

const HomePage = () => {
  return (
    <div className="min-h-screen flex bg-[#F4F6FA]">
      {/* Sidebar otomatis diambil dari layout */}

      {/* Konten Utama */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <img
            src="/smile.png"
            alt="Smile"
            className="w-36 h-36 mb-4"
          />
          <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100">
            Join Class
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
