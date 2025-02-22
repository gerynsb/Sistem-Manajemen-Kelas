"use client";

const AssignmentPageCard = ({
  title,
  status,
  classTitle,
  dueDate,
  description,
}: {
  title: string;
  status: string;
  classTitle: string;
  dueDate: string;
  description: string;
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      {/* Status Assignment */}
      <h2 className={`text-md font-bold mb-1 ${status === "Terkumpul" ? "text-green-700" : "text-red-600"}`}>
        {status}
      </h2>

      {/* Judul Assignment */}
      <h3 className="text-lg font-bold text-black">{title}</h3>

      {/* Info Kelas dan Batas Waktu */}
      <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
        <span className="font-semibold">{classTitle}</span>
        <span>Batas: {dueDate}</span>
      </div>

      {/* Deskripsi */}
      <p className="text-gray-700 text-sm mt-2">{description}</p>

      {/* Tombol Lihat Selengkapnya */}
      <a
        href="#"
        className="text-blue-500 hover:underline text-sm mt-3 block"
      >
        Lihat Selengkapnya →
      </a>
    </div>
  );
};

export default AssignmentPageCard;
