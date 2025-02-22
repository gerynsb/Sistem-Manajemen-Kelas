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
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-full"> {/* Lebar maksimum */}
      <h2 className="text-lg font-bold text-black">{title}</h2>

      <div className="flex justify-between text-gray-500 text-sm mt-2">
        <span>{classTitle}</span>
        <span>Batas: {dueDate}</span>
      </div>

      <p className={`text-sm font-semibold mt-2 ${status === "Terkumpul" ? "text-green-600" : "text-red-600"}`}>
        {status}
      </p>

      <p className="text-gray-700 text-sm mt-2">{description}</p>

      <a
        href="#"
        className="text-blue-500 hover:underline text-sm mt-3 block flex items-center"
      >
        Lihat Selengkapnya →
      </a>
    </div>
  );
};

export default AssignmentPageCard;
