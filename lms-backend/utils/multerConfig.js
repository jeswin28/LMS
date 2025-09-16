// lms-backend/utils/multerConfig.js
const multer = require('multer');
const path = require('path');
const ErrorResponse = require('./errorResponse');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    const baseUploadDir = path.join(process.cwd(), 'uploads'); // Ensure this is the base for all uploads

    // Determine destination based on file fieldname or originalUrl
    if (file.fieldname === 'thumbnail') {
      uploadPath = path.join(baseUploadDir, 'thumbnails');
    } else if (file.fieldname === 'video') {
      uploadPath = path.join(baseUploadDir, 'videos');
    } else if (file.fieldname === 'resources') {
      uploadPath = path.join(baseUploadDir, 'resources');
    } else if (file.fieldname === 'submissionFile') { // As used in AssignmentController.submitAssignment
      uploadPath = path.join(baseUploadDir, 'submissions');
    } else {
      uploadPath = path.join(baseUploadDir, 'others');
    }

    ensureDirExists(uploadPath); // Create directory if it doesn't exist
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using Date.now() and original extension
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  // Define allowed mimetypes
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/gif', // Images
    'video/mp4', 'video/webm', 'video/quicktime', // Videos
    'application/pdf', // PDF
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word documents
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // Powerpoint
    'application/zip', 'application/x-zip-compressed', // Zip files
    'application/sql', // SQL files (for schema)
    'text/plain', // Plain text for code/notes
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ErrorResponse(`File type ${file.mimetype} not allowed`, 400), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_UPLOAD) || 10000000, // Default 10MB if not set
  },
});

module.exports = upload;