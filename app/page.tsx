"use client";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <img
        src="/smile.png"
        alt="Smile"
        className="w-36 h-36 mb-4"
      />
      <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100">
        Join Class
      </button>
    </div>
  );
};

export default HomePage;
