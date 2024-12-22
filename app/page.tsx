"use client";

import { useState } from "react";

const HomePage = () => {
  const [menuActive, setMenuActive] = useState("Home"); // State untuk menu aktif

  return (
    <div className="min-h-screen flex bg-[#F4F6FA]">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between text-black px-8 py-4 shadow-md">
          <h1 className="text-3xl font-bold">Selamat Datang, ....</h1>
          <div className="flex items-center space-x-4">
            {/* Button Add */}
            <button className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700">
              +
            </button>
            {/* Notification Icon */}
            <button className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">
              🔔
            </button>
            {/* Profile and Log Out */}
            <div className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-2 shadow-md">
              {/* Profile Placeholder */}
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-1">
                <span>👤</span>
              </div>
              {/* Log Out Button */}
              <button className="flex items-center justify-center px-4 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700">
                Log Out
              </button>
            </div>
          </div>
        </header>

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
