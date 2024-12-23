"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const HomePage = () => {
  return (
    <div className="min-h-screen flex bg-[#F4F6FA]">
      <main className="flex-1 flex flex-col">
        {/* Main Section */}
        <section className="flex-1 flex flex-col items-center justify-center">
          <img
            src="/smile.png" // Path ke gambar Anda
            alt="Smile"
            className="w-36 h-36 mb-4"
          />
          <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100">
            Join Class
          </button>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
