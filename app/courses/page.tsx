"use client";

import { useState, useEffect } from "react";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import JoinClass from "@/components/JoinClass";
import CoursesCard from "@/components/CoursesCard";
import AssignmentCard from "@/components/AssignmentCard";
import Header from "@/components/Header";

<button className="flex items-center justify-center px-4 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700">
Log Out
</button>

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
  const [isJoinClassOpen, setIsJoinClassOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchCourses = async () => {
    try {
      const coursesSnapshot = await getDocs(collection(db, "courses"));
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] overflow-auto">
      {/* Header */}
      <Header pageTitle="Courses" />

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
                  classTitle={course.classTitle || "Unknown Class"}
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

      {/* 🔹 MODAL JOIN CLASS */}
      {isJoinClassOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsJoinClassOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[400px] relative pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close (❌) */}
            <button
              onClick={() => setIsJoinClassOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
            </button>

            {/* Komponen JoinClass */}
            <JoinClass onClose={() => setIsJoinClassOpen(false)} onJoinSuccess={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
