"use client";

import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Pastikan mengimpor Firebase
import { onAuthStateChanged } from "firebase/auth";

const HomePage = ({ pageTitle }: { pageTitle?: string }) => {
  const [name, setName] = useState("..."); // Default state untuk nama

  // Fungsi untuk mengambil nama user dari Firestore
  const fetchUserName = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setName(userDoc.data().name || "User"); // Set nama jika ada, fallback ke "User"
      } else {
        console.warn("User document not found.");
        setName("Guest"); // Default jika dokumen tidak ditemukan
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setName("Error");
    }
  };

  // Listener untuk perubahan autentikasi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid); // Ambil UID untuk fetch nama
      } else {
        setName("Guest"); // Default jika tidak ada user yang login
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA]">
      {/* Header */}
      <header className="flex items-center justify-between text-black px-8 py-4 border-b-2 border-black bg-[#F4F6FA] w-full">
        {/* Heading */}
        <h1 className="text-4xl font-bold">
          {pageTitle || `Selamat Datang, ${name}`}
        </h1>

        {/* Action Buttons */}
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
              👤
            </div>
            {/* Log Out Button */}
            <button className="flex items-center justify-center px-4 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700">
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <img
          src="/smile.png"
          alt="Smile"
          className="w-24 h-24 lg:w-36 lg:h-36 mb-4"
        />
        <button className="px-4 py-2 lg:px-6 lg:py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100">
          Join Class
        </button>
      </div>
    </div>
  );
};

export default HomePage;
