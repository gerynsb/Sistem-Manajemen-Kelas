"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [menuActive, setMenuActive] = useState("Home"); // State untuk menu aktif
  const [dropdownOpen, setDropdownOpen] = useState(false); // State untuk dropdown
  const router = useRouter(); // Hook untuk navigasi

  const handleNavigation = (name: string, path: string) => {
    setMenuActive(name); // Set menu aktif
    if (path !== "#") {
      router.push(path); // Navigasi ke path jika ada
    }
  };

  return (
    <aside className="w-[250px] bg-white border-r border-gray-200 shadow-md flex flex-col justify-between">
      <div>
        {/* Menu Items */}
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

          {/* Dropdown Item */}
          <li>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center justify-between px-4 py-2 space-x-4 text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-md cursor-pointer ${
                menuActive === "Daftar Kelas" ? "bg-blue-100" : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                <span>{dropdownOpen ? "▼" : "▲"}</span>
                <span className="text-xl">👩‍🏫</span>
                <span>Daftar Kelas</span>
              </div>
            </div>
            {dropdownOpen && (
              <ul className="ml-2 mt-2 space-y-2 text-sm">
                {[
                  { name: "Biologi 2024 XI MIPA 1", path: "/kelas/xi-mipa-1" },
                  { name: "Biologi 2024 XII MIPA 1", path: "/kelas/xii-mipa-1" },
                ].map((kelas) => (
                  <li
                    key={kelas.name}
                    onClick={() => handleNavigation(kelas.name, kelas.path)}
                    className={`flex items-center px-4 py-2 space-x-4 rounded-md cursor-pointer ${
                      menuActive === kelas.name
                        ? "text-blue-600 bg-blue-100"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <span>{kelas.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Settings */}
      <div className="px-4 py-4">
        <div className="flex items-center px-4 py-2 space-x-4 text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-md cursor-pointer">
          <span className="text-xl">⚙️</span>
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
