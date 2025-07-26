// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, + Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// export default upload;

// middleware/upload.js
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), // stores file in RAM
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB limit
});

export default upload;
