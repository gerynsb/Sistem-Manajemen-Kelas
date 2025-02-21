"use client";

const AssignmentCard = ({ assignment }: { assignment: any }) => {
  return (
    <div className="bg-white text-black p-4 rounded-lg shadow-md mt-2">
      <h3 className="text-md font-bold">{assignment.title}</h3>
      <p className="text-sm">{assignment.description}</p>
      <p className="text-sm text-gray-500">
        Deadline: {new Date(assignment.dueDate).toLocaleDateString()}
      </p>
    </div>
  );
};

export default AssignmentCard;
