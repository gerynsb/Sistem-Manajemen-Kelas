"use client";

const SettingsPage = () => {
  return (
    <div className="flex flex-col p-8 bg-[#F4F6FA] min-h-screen w-full">
      {/* Profil Section */}
      <div className="flex items-center bg-white rounded-lg shadow-md p-6 mb-8 w-full">
        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
          {/* Profile Picture */}
          <span className="text-2xl text-gray-500">👤</span>
        </div>
        <div className="ml-6">
          <h1 className="text-2xl font-bold text-black">Nama Siswa</h1>
          <p className="text-black">NiS Siswa</p>
          <button className="text-blue-600 hover:underline text-sm mt-2">
            Edit
          </button>
        </div>
      </div>

      {/* Notifikasi Section */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <h2 className="text-xl font-bold text-black mb-6">Notifikasi</h2>
        <div className="space-y-8">
          {/* Kelas Notifications */}
          <div>
            <h3 className="font-semibold text-lg text-black mb-4">Kelas</h3>
            <ul className="space-y-4">
              {["Tugas dan postingan", "Nilai dari pengajar", "Pengingat batas waktu tugas"].map(
                (item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-black">{item}</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Komentar Notifications */}
          <div>
            <h3 className="font-semibold text-lg text-black mb-4">Komentar</h3>
            <ul className="space-y-4">
              {["Komentar pribadi tugas", "Komentar postingan diskusi"].map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-black">{item}</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
