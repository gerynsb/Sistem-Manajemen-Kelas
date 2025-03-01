"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AssignmentCard = ({ assignment }: { assignment: any }) => {
  console.log("🔥 Debug Assignment Data:", assignment);

  const [className, setClassName] = useState("Memuat...");

  useEffect(() => {
    const fetchClassName = async () => {
      if (assignment.classId) {
        try {
          const classDoc = await getDoc(doc(db, "classes", assignment.classId));
          if (classDoc.exists()) {
            setClassName(classDoc.data().name || "Nama Kelas Tidak Ditemukan");
          } else {
            setClassName("Nama Kelas Tidak Ditemukan");
          }
        } catch (error) {
          console.error("🔥 Error fetching class name:", error);
          setClassName("Gagal memuat kelas");
        }
      }
    };

    fetchClassName();
  }, [assignment.classId]);

  const title = assignment["title "] || "Tugas Tanpa Judul";

  // Konversi dueDate dengan aman
  let formattedDate = "Invalid Date";
  if (assignment.dueDate) {
    try {
      const dueDate = assignment.dueDate.toDate
        ? assignment.dueDate.toDate()
        : new Date(assignment.dueDate);
      formattedDate = dueDate.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting dueDate:", error);
    }
  }

  const status = assignment.status || (assignment.isSubmitted ? "Terkumpul" : "Belum Dikumpulkan");

  return (
    <div className="text-white p-4 mt-2">
      <p className={`text-xs font-semibold mb-2 ${status === "Terkumpul" ? "text-white-600" : "text-white-600"}`}>
        {status}
      </p>
      <h3 className="text-xl">{className}</h3>
      <h3 className="text-2xl">{title}</h3>
      <p className="text-xs mt-2 text-white-500">Deadline: {formattedDate}</p>

      {/* ✅ Perbaikan Path ke Halaman Tugas */}
      <Link href={`/classes/${assignment.classId}`} passHref>
        <p className="text-blue-200 hover:underline text-sm mt-2 cursor-pointer">
          Lihat Selengkapnya →
        </p>
      </Link>
    </div>
  );
};

export default AssignmentCard;
