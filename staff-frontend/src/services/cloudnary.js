import axios from 'axios'

const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "roms_images");
  formData.append("cloud_name", "dcsmtagf7");

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dcsmtagf7/image/upload",
    formData
  );

  return res.data.secure_url;
};

export default uploadImageToCloudinary ;
