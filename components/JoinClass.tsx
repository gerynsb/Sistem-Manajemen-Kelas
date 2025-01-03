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
      const normalizedClassCode = classCode.trim().toLowerCase(); // Normalisasi ke huruf kecil

      console.log("User ID:", userId);
      console.log("Class Code Entered:", classCode);
      console.log("Normalized Class Code:", normalizedClassCode);

      // Debugging: Query seluruh dokumen di koleksi classes
      const allclassesSnapshot = await getDocs(collection(db, "classes"));
      console.log("All classes Data for Debugging:");
      allclassesSnapshot.docs.forEach((doc) => {
        console.log(`Class ID: ${doc.id}, Data:`, doc.data());
      });

      // Query spesifik dengan kode kelas
      const classesQuery = query(
        collection(db, "classes"),
        where("code", "==", normalizedClassCode)
      );

      console.log("Executing query with code:", normalizedClassCode);
      const querySnapshot = await getDocs(classesQuery);
      console.log("Query Snapshot Docs:", querySnapshot.docs.map((doc) => doc.data()));

      if (querySnapshot.empty) {
        console.log("Class code not found in database.");
        throw new Error("Kode kelas tidak ditemukan.");
      }

      // Dokumen ditemukan
      const classDoc = querySnapshot.docs[0];
      const classId = classDoc.id;
      console.log("Found Class ID:", classId);

      // Tambahkan user ke kelas
      await updateDoc(doc(db, "classes", classId), {
        students: arrayUnion(userId),
      });

      // Tambahkan kelas ke user
      await updateDoc(doc(db, "users", userId), {
        joinedclasses: arrayUnion(classId),
      });

      setMessageType("success");
      setMessage(`Berhasil bergabung ke kelas dengan kode: ${normalizedClassCode}`);
    } catch (error) {
      console.error("Error during joining class:", error);
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan");
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
