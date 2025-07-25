import multer from "multer";
import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    console.log(err)
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
  // Handle Multer file upload errors
   if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: `Unexpected file field: ${err.field}.`,
        suggestion: 'Please check the field name in the form data',
      });
    }

  // Handle other known errors (e.g., custom error classes)
  if (err.statusCode && err.message) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Fallback for unexpected errors
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
};

export default errorHandler;
