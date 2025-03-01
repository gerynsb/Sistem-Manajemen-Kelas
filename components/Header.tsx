"use client";

import { useState } from "react";

const Header = ({ pageTitle }: { pageTitle?: string }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="w-full max-w-[1280px] flex items-center justify-between text-black px-8 py-4 border-b-2 border-black bg-[#F4F6FA]">
      {/* Judul Halaman */}
      <h1 className="text-4xl font-bold">{pageTitle}</h1>

      {/* Bagian Kanan: Tombol +, Notifikasi, Profil */}
      <div className="flex items-center space-x-1">
        {/* Tombol Tambah Kelas */}
        <button className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700">
          +
        </button>

        {/* Notifikasi */}
        <button className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">
          🔔
        </button>

        {/* Profil & Logout */}
        <div
          className="relative flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-2 shadow-md cursor-pointer"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-1">
            👤
          </div>
          {isProfileOpen && (
            <button className="absolute top-12 w-24 py-2 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700">
              Log Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
