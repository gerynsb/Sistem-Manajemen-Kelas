"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase"; // Import Firestore dan Auth
import { onAuthStateChanged } from "firebase/auth";

const ForumSection = ({ classId }: { classId: string }) => {
  const [postText, setPostText] = useState(""); // State untuk input post
  const [posts, setPosts] = useState<any[]>([]); // State untuk menyimpan daftar post
  const [user, setUser] = useState<{ uid: string; name: string } | null>(null); // State untuk user yang login

  // 🔥 Cek user yang login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ uid: currentUser.uid, name: currentUser.displayName || "Anonim" });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Fetch posts dari Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, "forumPosts"),
          where("classId", "==", classId),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const forumData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(forumData);
      } catch (error) {
        console.error("Error fetching forum posts:", error);
      }
    };

    fetchPosts();
  }, [classId]);

  // 🔥 Fungsi untuk memposting ke forum
  const handlePostSubmit = async () => {
    if (!postText.trim()) {
      alert("Post tidak boleh kosong!");
      return;
    }

    if (!user) {
      alert("Anda harus login untuk memposting!");
      return;
    }

    try {
      const newPost = {
        classId,
        userId: user.uid,
        userName: user.name,
        text: postText,
        timestamp: new Date(), // Waktu posting
      };

      await addDoc(collection(db, "forumPosts"), newPost); // Simpan ke Firestore
      setPosts((prev) => [newPost, ...prev]); // Update UI secara langsung
      setPostText(""); // Reset input
    } catch (error) {
      console.error("Error posting to forum:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full">
      {/* Input untuk menulis post */}
      <textarea
        className="w-full text-black p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Tuliskan sesuatu yang ingin dibagikan..."
        rows={3}
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
      <button
        onClick={handlePostSubmit}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!postText.trim()}
      >
        Post
      </button>

      {/* Menampilkan post yang sudah dikirim */}
      <div className="mt-4 space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">Belum ada postingan di forum.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-3 bg-gray-100 rounded-lg shadow-sm text-black">
              <p className="font-semibold">{post.userName}</p>
              <p className="text-gray-700">{post.text}</p>
              <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleString("id-ID")}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ForumSection;
