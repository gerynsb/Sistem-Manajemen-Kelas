import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc, doc, updateDoc, arrayUnion, collection, query, where, getDocs } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fungsi untuk join class
export const joinClass = async (userId, classCode) => {
  try {
    // Cari kelas berdasarkan kode kelas
    const classQuery = query(
      collection(db, "classes"),
      where("code", "==", classCode)
    );
    const querySnapshot = await getDocs(classQuery);

    if (querySnapshot.empty) {
      throw new Error("Kode kelas tidak ditemukan!");
    }

    const classDoc = querySnapshot.docs[0];
    const classId = classDoc.id;

    // Update dokumen kelas untuk menambahkan user ke array `students`
    await updateDoc(doc(db, "classes", classId), {
      students: arrayUnion(userId),
    });

    // Update dokumen user untuk menambahkan kelas ke array `joinedClasses`
    await updateDoc(doc(db, "users", userId), {
      joinedClasses: arrayUnion(classId),
    });

    return "Berhasil bergabung ke kelas!";
  } catch (error) {
    throw new Error(error.message || "Terjadi kesalahan.");
  }
};
