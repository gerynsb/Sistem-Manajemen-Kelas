export const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "assignment"); // Ganti dengan upload preset yang sesuai
  
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/daljxqepq/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      return data.secure_url; // Mengembalikan URL file yang diunggah
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      return null;
    }
  };
  