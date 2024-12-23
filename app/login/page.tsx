"use client";

import { useState } from "react";

const SignUpPage = () => {
  const [userType, setUserType] = useState("Student"); // Default user type

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
      <div className="rounded-xl flex w-[90%] max-w-[900px]">
        {/* Kiri: Text Section */}
        <div className="flex-1 bg-[#F4F6FA] p-10 rounded-l-xl flex flex-col justify-center items-center">
          <h1 className="text-6xl font-bold text-black leading-snug text-center">
            Welcome to <br /> SMKD.
          </h1>
        </div>

        {/* Kanan: Form Section */}
        <div className="flex-1 p-10">
          {/* Toggle Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setUserType("Student")}
              className={`w-1/2 py-2 text-sm font-medium border ${
                userType === "Student"
                  ? "bg-purple-200 text-black"
                  : "bg-white text-gray-500"
              } rounded-l-full`}
            >
              Student
            </button>
            <button
              onClick={() => setUserType("Teacher")}
              className={`w-1/2 py-2 text-sm font-medium border ${
                userType === "Teacher"
                  ? "bg-purple-200 text-black"
                  : "bg-white text-gray-500"
              } rounded-r-full`}
            >
              Teacher
            </button>
          </div>

          {/* Input Form */}
          <form className="space-y-6">
            <input
              type="text"
              placeholder={userType === 'Student' ? 'NIS' : 'NIP'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#e6e0e9] text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#e6e0e9] text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
            />

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                I forgot my password
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#3366FF] text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
