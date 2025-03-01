"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AssignmentsSection = ({ classId }: { classId: string }) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const q = query(collection(db, "assignments"), where("classId", "==", classId));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => {
          const assignmentData = doc.data();
          return {
            id: doc.id,
            title: assignmentData["title "] || assignmentData.title || "Judul Tidak Tersedia", // ✅ Fix Typo Key
            description: assignmentData.description || "Tidak ada deskripsi.",
            dueDate: assignmentData.dueDate?.seconds
              ? new Date(assignmentData.dueDate.seconds * 1000).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Tanggal tidak tersedia",
            isSubmitted: assignmentData.isSubmitted || false,
          };
        });
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [classId]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      {/* Tombol Buat Tugas */}
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        + Buat
      </button>

      {/* Loading Indicator */}
      {loading ? (
        <p className="text-gray-500 mt-4">Loading tugas...</p>
      ) : assignments.length === 0 ? (
        <p className="text-gray-500 mt-4">Belum ada tugas</p>
      ) : (
        <div className="mt-4 space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              {/* Judul Tugas */}
              <p className="text-xl font-bold text-black">{assignment.title}</p>

              {/* Informasi Kelas & Tanggal */}
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span className="italic">Kelas: {classId}</span>
                <span>Batas: {assignment.dueDate}</span>
              </div>

              {/* Deskripsi */}
              <p className="text-gray-700 mt-2">{assignment.description}</p>

              {/* Status Pengumpulan */}
              <p className={`mt-2 font-semibold ${assignment.isSubmitted ? "text-green-600" : "text-red-600"}`}>
                {assignment.isSubmitted ? "Terkumpul" : "Belum Dikumpulkan"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsSection;
