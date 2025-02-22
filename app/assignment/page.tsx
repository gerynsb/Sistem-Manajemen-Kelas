"use client";

import { useState, useEffect } from "react";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AssignmentPageCard from "@/components/AssignmentPageCard";

interface AssignmentData {
  id: string;
  title: string;
  description: string;
  isSubmitted?: boolean;
  dueDate: any; // Firestore Timestamp
  classId?: string;
  classTitle?: string;
}

const AssignmentPage = ({ pageTitle }: { pageTitle?: string }) => {
  const [name, setName] = useState("...");
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil nama user dari Firestore
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

  // Ambil data assignments dari Firestore
  const fetchAssignments = async () => {
    try {
      const assignmentsSnapshot = await getDocs(collection(db, "assignments"));
      let assignmentsData: AssignmentData[] = assignmentsSnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<AssignmentData, "id">),
      }));

      // Kumpulkan semua classId yang ada di assignment
      const classIds = [...new Set(assignmentsData.map((a) => a.classId).filter(Boolean))] as string[];
      const classMap: Record<string, string> = {};

      // Ambil nama kelas berdasarkan classId
      await Promise.all(
        classIds.map(async (cId) => {
          if (!cId) return;
          const classDocSnap = await getDoc(doc(db, "classes", cId));
          if (classDocSnap.exists()) {
            const classData = classDocSnap.data();
            classMap[cId] = classData.name || "Unknown Class";
          } else {
            classMap[cId] = "Unknown Class";
          }
        })
      );

      // Ganti classId dengan classTitle
      assignmentsData = assignmentsData.map((assignment) => ({
        ...assignment,
        classTitle: assignment.classId ? classMap[assignment.classId] : "Unknown Class",
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
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] overflow-auto">
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex flex-1 px-4 pt-6 lg:flex-row flex-col max-w-[1280px] mx-auto space-x-4">
        {/* Assignments Section */}
        <div className="flex-1">
          {loading ? (
            <p>Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <p>No assignments available.</p>
          ) : (
            <div className="space-y-4 mb-4">
              {assignments.map((assignment) => {
                // Konversi dueDate Firestore Timestamp -> string
                let dueDateStr = "Unknown Date";
                if (assignment.dueDate && assignment.dueDate.seconds) {
                  dueDateStr = new Date(assignment.dueDate.seconds * 1000).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  });
                }

                const status = assignment.isSubmitted ? "Terkumpul" : "Belum Dikumpulkan";

                return (
                  <AssignmentPageCard
                    key={assignment.id}
                    title={assignment.title} // 🔥 Judul Tugas Ditampilkan
                    status={status}
                    classTitle={assignment.classTitle || "Unknown Class"}
                    dueDate={dueDateStr}
                    description={assignment.description}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;