import axios from "axios";

export const uploadImageToCloudinary = async (file) => {
  const CLOUD_NAME = "cv1pmbl0"; 
  const UPLOAD_PRESET = "qontak_sales";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Gagal upload gambar ke Cloudinary:", error);
    throw error;
  }
};