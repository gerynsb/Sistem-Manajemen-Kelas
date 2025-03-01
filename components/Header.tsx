"use client";

import { useState } from "react";
import JoinClass from "@/components/JoinClass"; // Import JoinClass

const Header = ({ pageTitle, onJoinSuccess }: { pageTitle?: string; onJoinSuccess: () => void }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isJoinClassOpen, setIsJoinClassOpen] = useState(false); // 🔥 State untuk modal Join Class

  return (
    <header className="w-full max-w-[1280px] flex items-center justify-between text-black px-8 py-4 border-b-2 border-black bg-[#F4F6FA]">
      {/* Judul Halaman */}
      <h1 className="text-4xl font-bold">{pageTitle}</h1>

      {/* Bagian Kanan: Tombol +, Notifikasi, Profil */}
      <div className="flex items-center space-x-1">
        {/* 🔥 Tombol Tambah Kelas yang membuka modal */}
        <button
          onClick={() => setIsJoinClassOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
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

      {/* 🔥 MODAL JOIN CLASS */}
      {isJoinClassOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsJoinClassOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[400px] relative pointer-events-auto"
            onClick={(e) => e.stopPropagation()} // 🔥 Mencegah modal tertutup saat diklik di dalam
          >
            {/* Tombol Close (❌) */}
            <button
              onClick={() => setIsJoinClassOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
            </button>

            {/* 🔥 Komponen JoinClass */}
            <JoinClass
              onClose={() => setIsJoinClassOpen(false)}
              onJoinSuccess={onJoinSuccess} // ✅ Kirim callback untuk refresh daftar kelas
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
