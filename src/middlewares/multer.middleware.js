// // middlewares/multer.middleware.js
// import multer from 'multer';
// import path from 'path';


// // Store in memory for Cloudinary upload
// const storage = multer.memoryStorage();

// // File filter to accept images only
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only JPEG, JPG, or PNG files are allowed'));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
// });

// export default upload;

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, + Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export default upload;