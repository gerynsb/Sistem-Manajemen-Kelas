"use client";

import { useState, useEffect } from "react";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Pastikan Firebase dikonfigurasi dengan benar
import { onAuthStateChanged } from "firebase/auth";
import JoinClass from "@/components/JoinClass";
import ClassCard from "@/components/ClassCard";
import AssignmentCard from "@/components/AssignmentCard";

const HomePage = ({ pageTitle }: { pageTitle?: string }) => {
  const [name, setName] = useState("...");
  const [isJoinClassOpen, setIsJoinClassOpen] = useState(false);
  const [joinclasses, setJoinClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [refresh, setRefresh] = useState(false);

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

  // Ambil kelas yang diikuti user dari Firestore
  const fetchJoinClasses = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists() && userDoc.data().joinedclasses) {
        const classIds = userDoc.data().joinedclasses.filter((id: string) => id.trim() !== "");
  
        console.log("Class IDs from user data:", classIds); 
        
        const classesData = await Promise.all(
          classIds.map(async (classId: string) => {
            try {
              const classDoc = await getDoc(doc(db, "classes", classId));
              if (classDoc.exists()) {
                console.log(`Fetched class data (${classId}):`, classDoc.data()); // Debugging
                return { id: classId, ...classDoc.data() };
              } else {
                console.warn(`Class document ${classId} not found.`);
                return null;
              }
            } catch (error) {
              console.error(`Error fetching class data for ID ${classId}:`, error);
              return null;
            }
          })
        );
  
        const filteredClasses = classesData.filter((cls) => cls);
        setJoinClasses(filteredClasses);
        console.log("Final joined classes:", filteredClasses); // Debugging
      } else {
        console.warn("No joinclasses found for user.");
        setJoinClasses([]);
      }
    } catch (error) {
      console.error("Error fetching joinclasses:", error);
    } finally {
      setLoadingClasses(false);
    }
  };
  

  // Ambil assignments dari Firestore berdasarkan kelas yang diikuti
  const fetchAssignments = async (classIds: string[]) => {
    try {
      if (classIds.length === 0) {
        setAssignments([]);
        return;
      }

      const assignmentsRef = collection(db, "assignments");
      const q = query(assignmentsRef, where("classId", "in", classIds));
      const querySnapshot = await getDocs(q);

      const assignmentsData = querySnapshot.docs.map((doc) => ({
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
        fetchJoinClasses(user.uid);
      } else {
        setName("Guest");
        setJoinClasses([]);
        setAssignments([]);
        setLoadingClasses(false);
      }
    });

    return () => unsubscribe();
  }, [refresh]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA]">
      {/* Header */}
      <header className="w-screen max-w-[1280px] flex items-center justify-between text-black px-8 py-4 border-b-2 border-black bg-[#F4F6FA]">
        <h1 className="text-4xl font-bold">{pageTitle || `Selamat Datang, ${name}`}</h1>
        <div className="flex items-center space-x-1">
          <button
            className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700"
            onClick={() => setIsJoinClassOpen(true)}
          >
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
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        {loadingClasses ? (
          <p>Loading classes...</p>
        ) : joinclasses.length === 0 ? (
          <>
            <img
              src="/smile.png"
              alt="Smile"
              className="w-24 h-24 lg:w-36 lg:h-36 mb-4"
            />
            <button
              className="px-4 py-2 lg:px-6 lg:py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100"
              onClick={() => setIsJoinClassOpen(true)}
            >
              Join Class
            </button>
          </>
        ) : (
          <div className="w-full max-w-4xl space-y-4">
            {joinclasses.map((cls) => (
              <ClassCard key={cls.id} classId={cls.id} name={cls.name} desc={cls.desc} />
            ))}
            {assignments.length > 0 && (
              <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold">Assignment</h2>
                {assignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog JoinClass */}
      {isJoinClassOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[400px]">
            <JoinClass 
            onClose={() => setIsJoinClassOpen(false)} 
            onJoinSuccess={() => setRefresh(prev => !prev)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
