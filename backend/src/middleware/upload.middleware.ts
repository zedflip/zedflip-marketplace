import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
  }
};

// Upload configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 10, // Max 10 files
  },
});

// Single image upload
export const uploadSingle = upload.single('image');

// Multiple images upload (for listings)
export const uploadMultiple = upload.array('images', 10);

// Avatar upload
export const uploadAvatar = upload.single('avatar');

export default upload;
