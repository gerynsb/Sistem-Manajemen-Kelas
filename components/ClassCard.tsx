"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ClassCard = ({ classId }: { classId: string }) => {
  const [classData, setClassData] = useState<{ name: string; desc: string } | null>(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const classDoc = await getDoc(doc(db, "Classes", classId));
        if (classDoc.exists()) {
          setClassData(classDoc.data() as { name: string; desc: string });
        } else {
          console.error("Class not found");
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClassData();
  }, [classId]);

  if (!classData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-bold">{classData.name}</h2>
      <p className="text-sm text-gray-600">{classData.desc}</p>
      <a href="#" className="text-blue-500 text-sm mt-2 block">
        Lihat Selengkapnya...
      </a>
    </div>
  );
};

export default ClassCard;
