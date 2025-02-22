"use client";

import { useState, useEffect } from "react";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AssignmentPageCard from "@/components/AssignmentPageCard";

const AssignmentPage = ({ pageTitle }: { pageTitle?: string }) => {
  const [name, setName] = useState("...");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchAssignments = async () => {
    try {
      const assignmentsSnapshot = await getDocs(collection(db, "assignments"));
      let assignmentsData = assignmentsSnapshot.docs.map((doc) => {
        const rawData = doc.data();

        // 🔥 Ambil title dengan key yang mungkin salah formatnya (punya spasi)
        const titleKey = Object.keys(rawData).find((key) => key.trim() === "title") || "title";
        const title = rawData[titleKey] || "Untitled Assignment";

        return {
          id: doc.id,
          classId: rawData.classId || "Unknown",
          title,
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

      const classIds = [...new Set(assignmentsData.map((a) => a.classId))];
      const classDataMap: { [key: string]: string } = {};

      await Promise.all(
        classIds.map(async (classId) => {
          if (classId === "Unknown") return;
          try {
            const classDoc = await getDoc(doc(db, "classes", classId));
            if (classDoc.exists()) {
              classDataMap[classId] = classDoc.data().name;
            } else {
              classDataMap[classId] = "Kelas Tidak Diketahui";
            }
          } catch (error) {
            console.error(`Error fetching class data for ${classId}:`, error);
            classDataMap[classId] = "Error Fetching";
          }
        })
      );

      assignmentsData = assignmentsData.map((assignment) => ({
        ...assignment,
        classTitle: classDataMap[assignment.classId] || "Kelas Tidak Diketahui",
      }));

      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
        fetchAssignments();
      } else {
        setName("Guest");
        setAssignments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] overflow-auto">
      <header className="w-full max-w-[1280px] flex items-center justify-between text-black px-8 py-4 border-b-2 border-black bg-[#F4F6FA]">
        <h1 className="text-4xl font-bold">{pageTitle || `Assignment`}</h1>
        <div className="flex items-center space-x-1">
          <button className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700">
            +
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">
            🔔
          </button>
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

      <div className="flex flex-col px-8 pt-6 max-w-[1280px] mx-auto space-y-4 w-full">
        <div className="flex-1">
          {loading ? (
            <p>Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <p>No assignments available.</p>
          ) : (
            <div className="space-y-4 w-full">
              {assignments.map((assignment) => (
                <AssignmentPageCard
                  key={assignment.id}
                  title={assignment.title}
                  status={assignment.isSubmitted ? "Terkumpul" : "Belum Dikumpulkan"}
                  classTitle={assignment.classTitle}
                  dueDate={assignment.dueDate}
                  description={assignment.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
