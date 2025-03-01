"use client";

import Link from "next/link";

const CoursesCard = ({
  courseTitle,
  classTitle,
  instructor,
  description,
  classId, // ✅ Pastikan classId ada dalam props
}: {
  courseTitle: string;
  classTitle: string;
  instructor: string;
  description: string;
  classId: string; // ✅ Tambahkan classId agar bisa digunakan di Link
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Judul Mata Pelajaran */}
      <h2 className="text-lg font-bold text-gray-700">{courseTitle}</h2>

      {/* Info Kelas dan Instruktur */}
      <p className="text-gray-500 text-sm">
        <span className="text-sm mt-2">{classTitle}</span> &nbsp; &nbsp; &nbsp; &nbsp; {instructor}
      </p>

      {/* Deskripsi Singkat */}
      <p className="text-gray-700 text-sm mt-2">{description}</p>

      {/* Tombol Lihat Selengkapnya */}
      <Link href={`/classes/${classId}`} passHref>
        <p className="text-blue-600 hover:underline text-sm mt-2 cursor-pointer">
          Lihat Selengkapnya →
        </p>
      </Link>
    </div>
  );
};

export default CoursesCard;
