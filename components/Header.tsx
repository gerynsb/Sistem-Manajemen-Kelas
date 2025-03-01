"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 🔥 Untuk navigasi ke halaman login
import { auth } from "@/lib/firebase"; // 🔥 Import Firebase Auth
import { onAuthStateChanged, signOut } from "firebase/auth"; // 🔥 Cek status login dan logout
import JoinClass from "@/components/JoinClass"; // Import JoinClass

const Header = ({ pageTitle, onJoinSuccess }: { pageTitle?: string; onJoinSuccess: () => void }) => {
  const [isJoinClassOpen, setIsJoinClassOpen] = useState(false); // 🔥 State untuk modal Join Class
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null); // 🔥 State untuk menyimpan user yang login
  const router = useRouter(); // 🔥 Untuk navigasi halaman

  // 🔥 Cek apakah user sudah login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ uid: currentUser.uid, email: currentUser.email });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Fungsi untuk logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Hapus user dari state setelah logout
      router.push("/login"); // ✅ Redirect ke halaman login setelah logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="w-full max-w-[1280px] flex items-center justify-between text-black px-8 py-4 border-b-2 border-black bg-[#F4F6FA]">
      {/* Judul Halaman */}
      <h1 className="text-4xl font-bold">{pageTitle}</h1>

      {/* Bagian Kanan: Tombol +, Notifikasi, Profil */}
      <div className="flex items-center space-x-4">
        {/* 🔥 Tombol Tambah Kelas yang membuka modal */}
        {user && ( // ✅ Tampilkan hanya jika user sudah login
          <button
            onClick={() => setIsJoinClassOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            +
          </button>
        )}

        {/* Notifikasi */}
        {user && ( // ✅ Tampilkan hanya jika user sudah login
          <button className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">
            🔔
          </button>
        )}

        {/* 🔥 Login & Logout */}
        {user ? (
          // ✅ Jika sudah login, tampilkan tombol logout
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          // ✅ Jika belum login, tampilkan tombol login
          <button
            onClick={() => router.push("/login")} // 🔥 Redirect ke halaman login
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        )}
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
