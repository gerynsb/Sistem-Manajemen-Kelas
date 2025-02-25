"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ClassDetailPage = () => {
  const { id } = useParams(); // Mengambil ID kelas dari URL
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("forum");

  useEffect(() => {
    if (!id) return;
    
    const fetchClassData = async () => {
      try {
        const classDoc = await getDoc(doc(db, "classes", id));
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
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!classData) return <p>Class not found</p>;

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-black">{classData.name}</h1>

      {/* Navigation Tabs */}
      <div className="flex mt-4 border-b">
        {["Forum", "Tugas", "Absensi", "Peserta"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 text-lg ${
              activeTab === tab.toLowerCase() ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Based on Active Tab */}
      <div className="mt-6">
        {activeTab === "forum" && <ForumSection classId={id} />}
        {activeTab === "tugas" && <AssignmentsSection classId={id} />}
        {activeTab === "absensi" && <AttendanceSection classId={id} />}
        {activeTab === "peserta" && <ParticipantsSection classId={id} />}
      </div>
    </div>
  );
};

export default ClassDetailPage;
