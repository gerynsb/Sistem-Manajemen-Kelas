"use client";

const Header = () => {
  return (
    <header className="flex items-center justify-between text-black px-8 py-4 border-b-2 border-black bg-[#F4F6FA] w-full" style={{ marginLeft: "10px", marginRight: "900px"}}>
      {/* Heading */}
      <h1 className="text-4xl font-bold">Selamat Datang, ....</h1>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        {/* Button Add */}
        <button className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700">
          +
        </button>
        {/* Notification Icon */}
        <button className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">
          🔔
        </button>
        {/* Profile and Log Out */}
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-2 shadow-md">
          {/* Profile Placeholder */}
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-1">
            <span>👤</span>
          </div>
          {/* Log Out Button */}
          <button className="flex items-center justify-center px-4 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700">
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
