"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary"; // Import fungsi upload

const AssignmentsSection = ({ classId }: { classId: string }) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null); // Menyimpan status tugas yang sedang diunggah

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const q = query(collection(db, "assignments"), where("classId", "==", classId));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data()["title "]?.trim() || doc.data().title?.trim() || "Judul Tidak Tersedia",
          description: doc.data().description || "Tidak ada deskripsi.",
          dueDate: doc.data().dueDate?.seconds
            ? new Date(doc.data().dueDate.seconds * 1000).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "Tanggal tidak tersedia",
          isSubmitted: doc.data().isSubmitted || false,
          fileUrl: doc.data().fileUrl || null,
        }));
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [classId]);

  // ✅ Fungsi untuk unggah file ke Cloudinary dan update Firebase
  const handleFileUpload = async (assignmentId: string, file: File) => {
    if (!file) {
      alert("Pilih file terlebih dahulu!");
      return;
    }

    setUploading(assignmentId); // Set status sedang upload
    try {
      const fileUrl = await uploadToCloudinary(file);
      if (!fileUrl) {
        alert("Gagal mengunggah file! Periksa konfigurasi Cloudinary.");
        setUploading(null);
        return;
      }

      // ✅ Update tugas di Firebase setelah file diunggah
      await updateDoc(doc(db, "assignments", assignmentId), {
        fileUrl,
        isSubmitted: true,
      });
  
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === assignmentId ? { ...assignment, fileUrl, isSubmitted: true } : assignment
        )
      );

      alert("Tugas berhasil dikumpulkan!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Terjadi kesalahan saat mengunggah file.");
    } finally {
      setUploading(null);
    }
  };
  

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      {/* Tombol Buat Tugas */}
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        + Buat
      </button>

      {/* Loading Indicator */}
      {loading ? (
        <p className="text-black mt-4">Loading tugas...</p>
      ) : assignments.length === 0 ? (
        <p className="text-black mt-4">Belum ada tugas</p>
      ) : (
        <div className="mt-4 space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300">
              {/* Judul Tugas */}
              <p className="text-xl font-bold text-black">{assignment.title}</p>

              {/* Informasi Kelas & Tanggal */}
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span className="italic">Kelas: {classId}</span>
                <span>Batas: {assignment.dueDate}</span>
              </div>

              {/* Deskripsi */}
              <p className="text-gray-700 mt-2">{assignment.description}</p>

              {/* Status Pengumpulan */}
              <p className={`mt-2 font-semibold ${assignment.isSubmitted ? "text-green-600" : "text-red-600"}`}>
                {assignment.isSubmitted ? "Terkumpul" : "Belum Dikumpulkan"}
              </p>

              {/* Jika sudah dikumpulkan, tampilkan link file */}
              {assignment.isSubmitted && assignment.fileUrl ? (
                <p className="mt-2">
                  <a
                    href={assignment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    📂 Lihat Tugas yang Dikirim
                  </a>
                </p>
              ) : (
                <div className="mt-2">
                  {/* Input File */}
                  <input
                    type="file"
                    onChange={(e) => e.target.files && handleFileUpload(assignment.id, e.target.files[0])}
                    className="border p-2 rounded-md text-gray-500 w-full"
                    disabled={uploading === assignment.id}
                  />

                  {/* Animasi loading */}
                  {uploading === assignment.id && <p className="text-blue-600 mt-2">Mengunggah...</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsSection;
