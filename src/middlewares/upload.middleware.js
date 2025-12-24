const multer = require('multer');
const path = require('path');

// 1. Storage Configuration (Where to save the file)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save in the 'uploads' folder in root
  },
  filename: (req, file, cb) => {
    // Generate unique filename: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. File Filter (Validation)
const fileFilter = (req, file, cb) => {
  // Assessment Requirement: Support all image formats
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// 3. Initialize Multer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Assessment Requirement: Max 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;