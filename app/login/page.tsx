"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // Import react-hot-toast
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions
import { auth, db } from "@/lib/firebase"; // Import Firebase auth and Firestore

const LoginPage = () => {
  const [userType, setUserType] = useState("Student"); // Default user type
  const [email, setEmail] = useState(""); // State untuk email/NIS/NIP
  const [password, setPassword] = useState(""); // State untuk password
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Login ke Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Periksa apakah data user ada di Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Jika user tidak ada di Firestore, tambahkan data default
        await setDoc(userRef, {
          email: user.email,
          name: email.split("@")[0], // Set nama default dari email
          role: userType.toLowerCase(), // Set role berdasarkan tipe user
        });
        console.log("User document created in Firestore");
      }

      // Berhasil login, tampilkan toast success
      toast.success("Login successful!");
      router.push("/"); // Redirect ke HomePage
    } catch (error) {
      // Gagal login, tampilkan toast error
      toast.error("Invalid email or password");
      console.error("Login error:", error);
    }
  };

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
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              placeholder={userType === "Student" ? "NIS" : "NIP"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-[#e6e0e9] text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

export default LoginPage;
