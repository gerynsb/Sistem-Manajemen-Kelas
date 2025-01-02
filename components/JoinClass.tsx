"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase"; // Pastikan mengimpor auth dan db dari Firebase
import { doc, updateDoc, arrayUnion, getDocs, collection, query, where } from "firebase/firestore"; // Import Firestore functions

const JoinClass = ({ onClose }: { onClose: () => void }) => {
  const [classCode, setClassCode] = useState(""); // State untuk kode kelas
  const [message, setMessage] = useState(""); // State untuk pesan sukses/gagal
  const [messageType, setMessageType] = useState<"success" | "error" | "">(""); // State untuk jenis pesan
  const [loading, setLoading] = useState(false); // State untuk loading

  const handleJoinClass = async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const user = auth.currentUser; // Dapatkan user yang sedang login
      if (!user) {
        throw new Error("Anda harus login untuk bergabung ke kelas.");
      }

      const userId = user.uid;

      // Query ke koleksi Classes untuk mencari dokumen dengan field code yang sesuai
      const classesQuery = query(
        collection(db, "Classes"),
        where("code", "==", classCode)
      );
      const querySnapshot = await getDocs(classesQuery);

      if (querySnapshot.empty) {
        throw new Error("Kode kelas tidak ditemukan.");
      }

      // Ambil dokumen pertama yang sesuai dengan query
      const classDoc = querySnapshot.docs[0];
      const classId = classDoc.id; // ID dokumen kelas

      // Tambahkan userId ke field students di dokumen kelas
      await updateDoc(doc(db, "Classes", classId), {
        students: arrayUnion(userId),
      });

      // Tambahkan classId ke field joinedClasses di dokumen user
      await updateDoc(doc(db, "users", userId), {
        joinedClasses: arrayUnion(classId),
      });

      setMessageType("success");
      setMessage(`Berhasil bergabung ke kelas dengan kode: ${classCode}`);
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black relative">
      {/* Tanda X untuk Close */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        &times;
      </button>
      <h1 className="text-xl text-black font-bold text-center mb-4">Join Class</h1>
      <input
        type="text"
        placeholder="Masukkan kode kelas"
        value={classCode}
        onChange={(e) => setClassCode(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
      />
      <button
        onClick={handleJoinClass}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
        disabled={loading}
      >
        {loading ? "Loading..." : "Join"}
      </button>
      {message && (
        <p
          className={`mt-2 text-sm text-center ${
            messageType === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default JoinClass;
