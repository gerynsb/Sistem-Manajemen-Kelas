"use client";

import { useState, useEffect } from "react";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import CoursesCard from "@/components/CoursesCard";
import AssignmentCard from "@/components/AssignmentCard";

// Interface untuk TypeScript
interface Course {
  id: string;
  classId: string;
  courseTitle: string;
  description: string;
  instructor: string;
  classTitle?: string; // Opsional karena diambil terpisah
}

const CoursesPage = ({ pageTitle }: { pageTitle?: string }) => {
  const [name, setName] = useState("...");
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
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

  // Ambil data courses dari Firestore
  const fetchCourses = async () => {
    try {
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      let coursesData: Course[] = coursesSnapshot.docs.map((doc) => {
        const data = doc.data() as Course;
        return {
          id: doc.id, // Pastikan ID diambil dari Firestore
          classId: data.classId,
          courseTitle: data.courseTitle,
          description: data.description,
          instructor: data.instructor,
        };
      });

      // Ambil classTitle dari koleksi `classes` berdasarkan classId
      const classIds = [...new Set(coursesData.map((course) => course.classId))];
      const classDataMap: { [key: string]: string } = {};

      await Promise.all(
        classIds.map(async (classId) => {
          try {
            const classDoc = await getDoc(doc(db, "classes", classId));
            if (classDoc.exists()) {
              classDataMap[classId] = classDoc.data().name;
            } else {
              classDataMap[classId] = "Unknown Class";
            }
          } catch (error) {
            console.error(`Error fetching class data for ${classId}:`, error);
            classDataMap[classId] = "Error Fetching";
          }
        })
      );

      // Gabungkan classTitle ke dalam coursesData
      coursesData = coursesData.map((course) => ({
        ...course,
        classTitle: classDataMap[course.classId] || "Unknown Class",
      }));

      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ambil data assignments dari Firestore
  const fetchAssignments = async () => {
    try {
      const assignmentsSnapshot = await getDocs(collection(db, "assignments"));
      const assignmentsData = assignmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
        fetchCourses();
        fetchAssignments();
      } else {
        setName("Guest");
        setCourses([]);
        setAssignments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] overflow-auto">
      {/* Header */}
      <header className="w-full max-w-[1280px] flex items-center justify-between text-black px-8 py-4 border-b-2 border-black bg-[#F4F6FA]">
        <h1 className="text-4xl font-bold">{pageTitle || `Courses`}</h1>
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
        {/* Courses Section */}
        <div className="flex-1">
          {loading ? (
            <p>Loading courses...</p>
          ) : courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <CoursesCard
                  key={course.id}
                  courseTitle={course.courseTitle}
                  classTitle={course.classTitle || "Unknown Class"} // Nama kelas dari Firestore
                  instructor={course.instructor}
                  description={course.description}
                />
              ))}
            </div>
          )}
        </div>

        {/* Assignment Section */}
        <div className="w-full lg:w-[30%] mb-2">
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
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
      </div>
    </div>
  );
};

export default CoursesPage;
