"use client";

import { useState } from "react";

const Sidebar = () => {
  const [menuActive, setMenuActive] = useState("Home"); // State untuk menu aktif

  return (
    <aside className="w-[250px] bg-white border-r border-gray-200 shadow-md flex flex-col justify-between">
      <div>
        {/* Menu Items */}
        <ul className="px-4 py-4 items-center mt-28 space-y-4">
          {[
            { name: "Home", icon: "🏠" },
            { name: "Courses", icon: "🎓" },
            { name: "Assignment", icon: "📝" },
            { name: "Daftar Kelas", icon: "👩‍🏫" },
          ].map((item) => (
            <li
              key={item.name}
              onClick={() => setMenuActive(item.name)}
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
