"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Sidebar = () => {
  const [menuActive, setMenuActive] = useState("Home"); // State menu aktif
  const [dropdownOpen, setDropdownOpen] = useState(false); // State dropdown
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State sidebar (default terbuka)
  const [classes, setClasses] = useState<any[]>([]); // State daftar kelas dari Firebase
  const router = useRouter(); // Hook untuk navigasi

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true); // Sidebar tetap terbuka di desktop
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set state awal berdasarkan ukuran layar

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 🔥 Mengambil daftar kelas dari Firebase
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "classes"));
        const classData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "Kelas Tanpa Nama",
        }));
        setClasses(classData);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleNavigation = (name: string, path: string) => {
    setMenuActive(name); // Set menu aktif
    if (path !== "#") {
      router.push(path); // Navigasi ke halaman
    }
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false); // Tutup sidebar setelah navigasi di mobile
    }
  };

  return (
    <div className="relative flex">
      {/* Hamburger Menu (Mobile) */}
      <button
        className="p-2 text-xl bg-blue-600 text-white rounded-md fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-md flex flex-col justify-between transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0 lg:w-[250px]`}
      >
        <div>
          {/* Menu Utama */}
          <ul className="px-4 py-4 items-center mt-28 space-y-4">
            {[
              { name: "Home", icon: "🏠", path: "/" },
              { name: "Courses", icon: "🎓", path: "/courses" },
              { name: "Assignment", icon: "📝", path: "/assignment" },
            ].map((item) => (
              <li
                key={item.name}
                onClick={() => handleNavigation(item.name, item.path)}
                className={`flex items-center px-4 py-2 space-x-4 rounded-md cursor-pointer ${
                  menuActive === item.name
                    ? "text-blue-600 bg-blue-100"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-100"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-center">{item.name}</span>
              </li>
            ))}

            {/* Dropdown Daftar Kelas */}
            <li>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center justify-between px-4 py-2 space-x-4 text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-md cursor-pointer ${
                  menuActive === "Daftar Kelas" ? "bg-blue-100" : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span>{dropdownOpen ? "▼" : "▲"}</span>
                  <span className="text-xl">📚</span>
                  <span>Daftar Kelas</span>
                </div>
              </div>
              {dropdownOpen && (
                <ul className="ml-2 mt-2 space-y-2 text-sm">
                  {classes.length > 0 ? (
                    classes.map((kelas) => (
                      <li
                        key={kelas.id}
                        onClick={() => handleNavigation(kelas.name, `/classes/${kelas.id}`)}
                        className={`flex items-center px-4 py-2 space-x-4 rounded-md cursor-pointer ${
                          menuActive === kelas.name
                            ? "text-blue-600 bg-blue-100"
                            : "text-gray-700 hover:text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        <span>{kelas.name}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 px-4 py-2">Tidak ada kelas</p>
                  )}
                </ul>
              )}
            </li>
          </ul>
        </div>

        {/* Settings */}
        <div className="px-4 py-4">
          <div
            onClick={() => handleNavigation("Settings", "/settings")}
            className={`flex items-center px-4 py-2 space-x-4 text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-md cursor-pointer ${
              menuActive === "Settings" ? "text-blue-600 bg-blue-100" : "text-gray-700"
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span>Settings</span>
          </div>
        </div>
      </aside>

      {/* Overlay untuk Mobile */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
