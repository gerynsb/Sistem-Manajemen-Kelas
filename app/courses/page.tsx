"use client";

import Header from "@/components/Header";

const CoursesPage = () => {
  return (
    <div className="min-h-screen flex bg-[#F4F6FA]">
      {/* Sidebar otomatis diambil dari layout */}

      {/* Konten Utama */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header pageTitle="Courses" />

        {/* Main Content */}
        <div className="flex flex-1 flex-col items-center justify-center text-black">
          <h1 className="text-3xl font-bold">Welcome to Courses Page</h1>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
