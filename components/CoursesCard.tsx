"use client";

const CoursesCard = ({
  courseTitle,
  classTitle,
  instructor,
  description,
}: {
  courseTitle: string;
  classTitle: string;
  instructor: string;
  description: string;
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
      <a
        href="#"
        className="text-blue-500 hover:underline text-sm mt-3 block flex items-center"
      >
        Lihat Selengkapnya →
      </a>
    </div>
  );
};

export default CoursesCard;
