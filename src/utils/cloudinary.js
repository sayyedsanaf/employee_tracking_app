// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMultipleToCloudinary = async (files) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "locations" }, (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        })
        .end(file.buffer);
    });
  });

  return Promise.all(uploadPromises);
};

export { cloudinary, uploadMultipleToCloudinary };
