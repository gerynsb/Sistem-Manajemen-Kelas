const ClassCard = ({
    classId,
    name,
    desc,
  }: {
    classId: string;
    name: string;
    desc: string;
  }) => {
    return (
      <div className="border p-4 rounded-lg shadow bg-white">
        <h1 className="text-2xl font-bold text-black mb-4">{name}</h1>
        <p className="text-gray-600">{desc}</p>
        <a
          href={`/classes/${classId}`}
          className="text-blue-500 hover:underline mt-2 block"
        >
          Lihat Selengkapnya →
        </a>
      </div>
    );
  };
  
  export default ClassCard;
  