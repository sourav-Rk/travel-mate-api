import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { AppError } from '../utils/AppError';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Allowed types: JPEG, PNG, GIF, WebP', 400));
  }
};


/**
 * Multer configuration for memory storage
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export const uploadSingleImage = upload.single('image');

