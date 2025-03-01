"use client";

import { useState, useEffect } from "react";
import { getDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AssignmentPageCard from "@/components/AssignmentPageCard";
import Header from "@/components/Header";

const AssignmentPage = ({ pageTitle }: { pageTitle?: string }) => {
  const [name, setName] = useState("...");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [joinedClasses, setJoinedClasses] = useState<string[]>([]); // 🔥 Menyimpan kelas yang diikuti
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch nama user
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

  // 🔥 Fetch kelas yang diikuti oleh user
  const fetchJoinedClasses = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists() && userDoc.data().joinedclasses) {
        const classIds = userDoc.data().joinedclasses;
        setJoinedClasses(classIds); // 🔥 Simpan kelas yang diikuti
        fetchAssignments(classIds); // 🔥 Ambil assignments hanya untuk kelas yang diikuti
      } else {
        setJoinedClasses([]);
        setAssignments([]);
      }
    } catch (error) {
      console.error("Error fetching joined classes:", error);
    }
  };

  // 🔥 Fetch Assignments sesuai dengan kelas yang diikuti
  const fetchAssignments = async (classIds: string[]) => {
    try {
      if (classIds.length === 0) {
        setAssignments([]); // Jika tidak ada kelas yang diikuti, kosongkan assignments
        setLoading(false);
        return;
      }

      // 🔹 Query hanya assignments dari kelas yang diikuti
      const assignmentsQuery = query(collection(db, "assignments"), where("classId", "in", classIds));
      const assignmentsSnapshot = await getDocs(assignmentsQuery);

      const assignmentsData = assignmentsSnapshot.docs.map((doc) => {
        const rawData = doc.data();
        const titleKey = Object.keys(rawData).find((key) => key.trim() === "title") || "title";
        return {
          id: doc.id,
          classId: rawData.classId || "Unknown",
          title: rawData[titleKey] || "Untitled Assignment",
          description: rawData.description || "Tidak ada deskripsi.",
          dueDate: rawData.dueDate?.seconds
            ? new Date(rawData.dueDate.seconds * 1000).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "Tanggal Tidak Diketahui",
          isSubmitted: rawData.isSubmitted || false,
        };
      });

      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Perbaikan: Hanya memanggil ulang fetchAssignments setelah join kelas
  const refreshAssignments = async () => {
    const user = auth.currentUser;
    if (user) {
      await fetchJoinedClasses(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
        fetchJoinedClasses(user.uid);
      } else {
        setName("Guest");
        setJoinedClasses([]);
        setAssignments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] overflow-auto">
      <Header pageTitle={`Assignment`} onJoinSuccess={refreshAssignments} />

      <div className="flex flex-col px-8 pt-6 max-w-[1280px] mx-auto space-y-4 w-full">
        {/* Tampilkan pesan jika tidak ada kelas yang diikuti */}
        {joinedClasses.length === 0 ? (
          <p className="text-center text-lg text-gray-600">
            Anda belum bergabung dengan kelas mana pun. Silakan join kelas terlebih dahulu.
          </p>
        ) : (
          <div className="flex-1">
            {loading ? (
              <p>Loading assignments...</p>
            ) : assignments.length === 0 ? (
              <p className="text-center text-lg text-gray-600">
                Tidak ada tugas yang tersedia untuk kelas yang Anda ikuti.
              </p>
            ) : (
              <div className="space-y-4 w-full">
                {assignments.map((assignment) => (
                  <AssignmentPageCard
                    key={assignment.id}
                    title={assignment.title}
                    status={assignment.isSubmitted ? "Terkumpul" : "Belum Dikumpulkan"}
                    classTitle={assignment.classTitle || "Kelas Tidak Diketahui"}
                    dueDate={assignment.dueDate}
                    description={assignment.description}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;
