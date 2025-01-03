"use client";

import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Pastikan mengimpor Firebase
import { onAuthStateChanged } from "firebase/auth";
import JoinClass from "@/components/JoinClass";
import ClassCard from "@/components/ClassCard";
import AssignmentCard from "@/components/AssignmentCard"; // Import komponen yang diperlukan

const HomePage = ({ pageTitle }: { pageTitle?: string }) => {
  const [name, setName] = useState("..."); // Default state untuk nama
  const [isJoinClassOpen, setIsJoinClassOpen] = useState(false); // State untuk dialog JoinClass
  const [joinclasses, setJoinClasses] = useState<any[]>([]); // State untuk kelas yang diikuti
  const [loadingClasses, setLoadingClasses] = useState(true); // State untuk loading kelas

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

  // Fungsi untuk mengambil data kelas yang diikuti
  const fetchJoinClasses = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists() && userDoc.data().joinclasses) {
        const classIds = userDoc.data().joinclasses;

        // Debugging: Tampilkan classIds
        console.log("Class IDs from user data:", classIds);

        // Filter nilai kosong sebelum diproses
        const validClassIds = classIds.filter((classId: string) => {
          if (!classId || classId.trim() === "") {
            console.warn("Filtered out invalid classId:", classId);
            return false;
          }
          return true;
        });

        const classesData = await Promise.all(
          validClassIds.map(async (classId: string) => {
            try {
              const classDoc = await getDoc(doc(db, "classes", classId));
              return classDoc.exists() ? { id: classId, ...classDoc.data() } : null;
            } catch (error) {
              console.error(`Error fetching class data for ID ${classId}:`, error);
              return null; // Skip invalid class data
            }
          })
        );

        setJoinClasses(classesData.filter((cls) => cls)); // Filter null values
      } else {
        console.warn("No joinclasses found for user.");
        setJoinClasses([]); // Reset jika tidak ada kelas
      }
    } catch (error) {
      console.error("Error fetching joinclasses:", error);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Listener untuk perubahan autentikasi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid); // Ambil UID untuk fetch nama
        fetchJoinClasses(user.uid); // Ambil kelas yang diikuti
      } else {
        setName("Guest"); // Default jika tidak ada user yang login
        setJoinClasses([]); // Reset joinclasses
        setLoadingClasses(false); // Selesai loading
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA]">
      {/* Header */}
      <header className="w-screen max-w-[1280px] flex items-center justify-between text-black px-8 py-4 border-b-2 border-black bg-[#F4F6FA]">
        <h1 className="text-4xl font-bold">
          {pageTitle || `Selamat Datang, ${name}`}
        </h1>
        <div className="flex items-center space-x-1">
          {/* Button Add */}
          <button
            className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700"
            onClick={() => setIsJoinClassOpen(true)}
          >
            +
          </button>
          {/* Notification Icon */}
          <button className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">
            🔔
          </button>
          {/* Profile and Log Out */}
          <div className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-2 shadow-md">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-1">
              👤
            </div>
            <button className="flex items-center justify-center px-4 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700">
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        {loadingClasses ? (
          <p>Loading classes...</p>
        ) : joinclasses.length === 0 ? (
          <>
            <img
              src="/smile.png"
              alt="Smile"
              className="w-24 h-24 lg:w-36 lg:h-36 mb-4"
            />
            <button
              className="px-4 py-2 lg:px-6 lg:py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100"
              onClick={() => setIsJoinClassOpen(true)}
            >
              Join Class
            </button>
          </>
        ) : (
          <div className="w-full max-w-4xl space-y-4">
            {joinclasses.map((cls) => (
              <ClassCard
                key={cls.id}
                classId={cls.id}
                name={cls.name}
                desc={cls.desc}
              />
            ))}
            <AssignmentCard />
          </div>
        )}
      </div>

      {/* Dialog JoinClass */}
      {isJoinClassOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[400px]">
            <JoinClass onClose={() => setIsJoinClassOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
