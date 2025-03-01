"use client";

import { useState, useEffect } from "react";
import { getDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import CoursesCard from "@/components/CoursesCard";
import AssignmentCard from "@/components/AssignmentCard";
import Header from "@/components/Header";

// Interface untuk TypeScript
interface Course {
  id: string;
  classId: string;
  courseTitle: string;
  description: string;
  instructor: string;
  classTitle?: string;
}

const CoursesPage = ({ pageTitle }: { pageTitle?: string }) => {
  const [name, setName] = useState("...");
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedClasses, setJoinedClasses] = useState<string[]>([]); // 🔥 Menyimpan kelas yang diikuti

  // 🔥 Fungsi untuk refresh daftar courses dan assignments setelah join kelas
  const refreshJoinClasses = async () => {
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
        setCourses([]);
        setAssignments([]);
        setJoinedClasses([]);
      }
    });

    return () => unsubscribe();
  }, []);

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
        fetchCourses(classIds); // 🔥 Ambil kursus hanya untuk kelas yang diikuti
        fetchAssignments(classIds); // 🔥 Ambil assignments hanya untuk kelas yang diikuti
      } else {
        setJoinedClasses([]);
        setCourses([]);
        setAssignments([]);
      }
    } catch (error) {
      console.error("Error fetching joined classes:", error);
    }
  };

  // 🔥 Fetch Courses sesuai dengan kelas yang diikuti
  const fetchCourses = async (classIds: string[]) => {
    try {
      if (classIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      // 🔹 Query hanya kursus dari kelas yang diikuti
      const coursesQuery = query(collection(db, "courses"), where("classId", "in", classIds));
      const coursesSnapshot = await getDocs(coursesQuery);

      let coursesData: Course[] = coursesSnapshot.docs.map((doc) => {
        const data = doc.data() as Course;
        return {
          id: doc.id,
          classId: data.classId,
          courseTitle: data.courseTitle,
          description: data.description,
          instructor: data.instructor,
        };
      });

      // 🔹 Fetch nama kelas untuk setiap course
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

      // 🔹 Menambahkan nama kelas ke data course
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

  // 🔥 Fetch Assignments sesuai dengan kelas yang diikuti
  const fetchAssignments = async (classIds: string[]) => {
    try {
      if (classIds.length === 0) {
        setAssignments([]); // Jika tidak ada kelas yang diikuti, kosongkan assignments
        return;
      }

      // 🔹 Query hanya assignments dari kelas yang diikuti
      const assignmentsQuery = query(collection(db, "assignments"), where("classId", "in", classIds));
      const assignmentsSnapshot = await getDocs(assignmentsQuery);

      const assignmentsData = assignmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] overflow-auto">
      {/* Header */}
      <Header pageTitle={`Courses`} onJoinSuccess={refreshJoinClasses} />

      {/* Main Content */}
      <div className="flex flex-1 px-4 pt-6 lg:flex-row flex-col max-w-[1280px] mx-auto space-x-4">
        {/* Courses Section */}
        <div className="flex-1">
          {joinedClasses.length === 0 ? (
            <p className="text-center text-lg text-gray-600">
            Anda belum bergabung dengan kelas mana pun. Silakan join kelas terlebih dahulu.
            </p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <CoursesCard
                  key={course.id}
                  classId={course.classId}
                  courseTitle={course.courseTitle}
                  classTitle={course.classTitle || "Unknown Class"}
                  instructor={course.instructor}
                  description={course.description}
                />
              ))}
            </div>
          )}
        </div>

        {/* Assignment Section - hanya muncul jika ada kelas yang diikuti */}
        {joinedClasses.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
