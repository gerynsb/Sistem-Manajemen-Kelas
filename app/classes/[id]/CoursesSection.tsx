"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CoursesSection = ({ classId }: { classId: string }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, "courses"), where("classId", "==", classId));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => {
          const rawData = doc.data();

          // 🔥 Pastikan kita menangani courseTitle yang salah format (misalnya ada spasi)
          const titleKey = Object.keys(rawData).find((key) => key.trim() === "courseTitle") || "courseTitle";
          const courseTitle = rawData[titleKey] || "Course Tanpa Judul";

          return {
            id: doc.id,
            courseTitle,
            description: rawData.description || "Tidak ada deskripsi.",
            instructor: rawData.instructor || "Tidak Diketahui",
          };
        });

        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [classId]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold text-black">Courses</h2>
      
      {loading ? (
        <p className="text-gray-500">Memuat courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">Belum ada course untuk kelas ini.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <p className="text-lg font-semibold text-black">{course.courseTitle}</p>
              <p className="text-sm text-gray-700">{course.description}</p>
              <p className="text-sm text-gray-500">Instruktur: {course.instructor}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesSection;
