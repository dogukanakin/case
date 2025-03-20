import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

// Define upload directories
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');
const FILES_DIR = path.join(UPLOADS_DIR, 'files');

// Ensure upload directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    // Decide the destination based on file mimetype
    const isImage = file.mimetype.startsWith('image/');
    cb(null, isImage ? IMAGES_DIR : FILES_DIR);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    // Generate a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.fieldname === 'image') {
    // Only allow jpg and png for images
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG and PNG image files are allowed.'));
    }
  } else if (file.fieldname === 'file') {
    // Only allow PDF for files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF files are allowed.'));
    }
  } else {
    cb(new Error('Unexpected field'));
  }
};

// Create multer upload middleware
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Helper function to get file URL
export const getFileUrl = (file: Express.Multer.File | undefined): string | null => {
  if (!file) return null;

  const isImage = file.mimetype.startsWith('image/');
  const relativePath = path.join(isImage ? 'images' : 'files', file.filename);
  
  return `/uploads/${relativePath}`;
}; 