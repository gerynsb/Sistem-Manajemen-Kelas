"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ForumSection from "./ForumSection";
import AssignmentsSection from "./AssignmentsSection";
import AttendanceSection from "./AttendanceSection";
import ParticipantsSection from "./ParticipantsSection";

const ClassPage = () => {
  const { id } = useParams();
  const classId = typeof id === "string" ? id : id?.[0] ?? ""; 

  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("forum");

  useEffect(() => {
    if (!classId) return;

    const fetchClassData = async () => {
      try {
        const classDoc = await getDoc(doc(db, "classes", classId));
        if (classDoc.exists()) {
          setClassData(classDoc.data());
        } else {
          console.warn("Class not found");
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (!classData) return <p className="text-center text-xl">Kelas tidak ditemukan.</p>;

  return (
    <div className="min-h-screen bg-[#F4F6FA] px-8 py-6">
      <h1 className="text-black text-4xl font-bold">{classData.name || "Kelas Tidak Diketahui"}</h1>

      {/* TAB NAVIGATION */}
      <div className="mt-4 border-b border-gray-300">
        <div className="flex space-x-8">
          {["forum", "assignments", "attendance", "participants"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-lg font-medium ${
                activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
              }`}
            >
              {tab === "forum"
                ? "Forum"
                : tab === "assignments"
                ? "Tugas"
                : tab === "attendance"
                ? "Absensi"
                : "Peserta"}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6">
        {classId && activeTab === "forum" && <ForumSection classId={classId} />}
        {classId && activeTab === "assignments" && <AssignmentsSection classId={classId} />}
        {classId && activeTab === "attendance" && <AttendanceSection classId={classId} />}
        {classId && activeTab === "participants" && <ParticipantsSection classId={classId} />}
      </div>
    </div>
  );
};

export default ClassPage;
