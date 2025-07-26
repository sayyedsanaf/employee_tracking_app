// utils/cloudinaryUploader.js
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'uploads',
        resource_type: options.resource_type || 'image',
        public_id: options.public_id || undefined, // optional custom filename
        ...options, // merge in extra Cloudinary options if provided
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
