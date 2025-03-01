// lib/cloudinary.ts
export const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "assignment"); 
  
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/daljxqepq/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (!data.secure_url) throw new Error("Gagal mendapatkan URL dari Cloudinary");
  
      return data.secure_url; // Mengembalikan URL file yang diunggah
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      return null;
    }
  };
  