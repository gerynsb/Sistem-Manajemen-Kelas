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
      <div className="border p-4 rounded shadow bg-white">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-gray-600">{desc}</p>
        <a
          href={`/classes/${classId}`}
          className="text-blue-500 hover:underline mt-2 block"
        >
          Lihat Selengkapnya
        </a>
      </div>
    );
  };
  
  export default ClassCard;
  