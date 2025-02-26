"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AssignmentsSection = ({ classId }: { classId: string }) => {
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const q = query(collection(db, "assignments"), where("classId", "==", classId));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, [classId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        + Buat
      </button>
      <div className="mt-4">
        {assignments.length === 0 ? (
          <p className="text-gray-500">Belum ada tugas</p>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} className="p-4 bg-gray-100 rounded-lg mt-2">
              <p className="font-bold">{assignment.title}</p>
              <p className="text-sm text-gray-500">{assignment.dueDate}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentsSection;
