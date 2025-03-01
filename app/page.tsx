"use client";

import { useState, useEffect } from "react";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import JoinClass from "@/components/JoinClass";
import ClassCard from "@/components/ClassCard";
import AssignmentCard from "@/components/AssignmentCard";
import Header from "@/components/Header";

const HomePage = ({ pageTitle }: { pageTitle?: string }) => {
  const [name, setName] = useState("...");
  const [isJoinClassOpen, setIsJoinClassOpen] = useState(false);
  const [joinclasses, setJoinClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const fetchUserName = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setName(userDoc.data().name || "User");
      } else {
        setName("Guest");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setName("Error");
    }
  };

  const fetchJoinClasses = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists() && userDoc.data().joinedclasses) {
        const classIds = userDoc.data().joinedclasses.filter((id: string) => id.trim() !== "");

        console.log("Class IDs from user data:", classIds);

        const classesData = await Promise.all(
          classIds.map(async (classId: string) => {
            try {
              const classDoc = await getDoc(doc(db, "classes", classId));
              if (classDoc.exists()) {
                console.log(`Fetched class data (${classId}):`, classDoc.data());
                return { id: classId, ...classDoc.data() };
              } else {
                console.warn(`Class document ${classId} not found.`);
                return null;
              }
            } catch (error) {
              console.error(`Error fetching class data for ID ${classId}:`, error);
              return null;
            }
          })
        );

        const filteredClasses = classesData.filter((cls) => cls);
        setJoinClasses(filteredClasses);
        console.log("Final joined classes:", filteredClasses);

        if (filteredClasses.length > 0) {
          await fetchAssignments(classIds);
        }
      } else {
        console.warn("No joinclasses found for user.");
        setJoinClasses([]);
      }
    } catch (error) {
      console.error("Error fetching joinclasses:", error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchAssignments = async (classIds: string[]) => {
    try {
      if (classIds.length === 0) {
        setAssignments([]);
        return;
      }

      console.log("Fetching assignments for classIds:", classIds);

      const assignmentsRef = collection(db, "assignments");
      const q = query(assignmentsRef, where("classId", "in", classIds));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn("Tidak ada tugas ditemukan.");
      }

      const assignmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Assignments found:", assignmentsData);

      setAssignments(assignmentsData);
    } catch (error) { 
      console.error("Error fetching assignments:", error);
    }
  };

  const refreshJoinClasses = async () => {
    const user = auth.currentUser;
    if (user) {
      await fetchJoinClasses(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
        fetchJoinClasses(user.uid);
      } else {
        setName("Guest");
        setJoinClasses([]);
        setAssignments([]);
        setLoadingClasses(false);
      }
    });

    return () => unsubscribe();
  }, [refresh]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] overflow-auto">
      {/* Header */}
      <Header pageTitle={`Selamat Datang, ${name}`} onJoinSuccess={() => refreshJoinClasses()} />

      {/* Main Content */}
      <div className="flex flex-1 px-4 pt-6 lg:flex-row flex-col max-w-[1280px] mx-auto space-x-4 overflow-auto">
        {/* Kelas yang diikuti */}
        <div className="flex-1 overflow-auto">
          {loadingClasses ? (
            <p>Loading classes...</p>
          ) : joinclasses.length === 0 ? (
            <div className="flex flex-col items-center">
              <img src="/smile.png" alt="Smile" className="w-24 h-24 lg:w-36 lg:h-36 mb-4" />
              <button
                className="px-4 py-2 lg:px-6 lg:py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100"
                onClick={() => setIsJoinClassOpen(true)}
              >
                Join Class
              </button>
            </div>
          ) : (
            <div className="space-y-4 mr-4 lg:mr-4 pb-8">
              {joinclasses.map((cls) => (
                <ClassCard key={cls.id} classId={cls.id} name={cls.name} desc={cls.desc} />
              ))}
            </div>
          )}
        </div>

        {/* 🔥 Assignment Section hanya muncul jika ada kelas */}
        {joinclasses.length > 0 && (
          <div className="w-full lg:w-[30%]">
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md overflow-auto">
              <h2 className="text-lg font-bold">Assignment</h2>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))
              ) : (
                <p className="text-sm">Belum ada tugas yang diberikan</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🔹 MODAL JOIN CLASS */}
      {isJoinClassOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsJoinClassOpen(false)} // 🔥 Tutup modal jika klik di luar modal
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

            {/* Komponen JoinClass */}
            <JoinClass onClose={() => setIsJoinClassOpen(false)} onJoinSuccess={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
