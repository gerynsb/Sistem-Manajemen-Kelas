"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ParticipantsSection = ({ classId }: { classId: string }) => {
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const q = query(collection(db, "users"), where("joinedclasses", "array-contains", classId));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setParticipants(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, [classId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {participants.length === 0 ? (
        <p className="text-gray-500">Belum ada peserta</p>
      ) : (
        participants.map((participant) => (
          <div key={participant.id} className="p-4 bg-gray-100 rounded-lg mt-2 flex justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
              <p className="font-bold">{participant.name}</p>
            </div>
            <p className="text-sm text-gray-500">{participant.role || "Siswa"}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ParticipantsSection;
