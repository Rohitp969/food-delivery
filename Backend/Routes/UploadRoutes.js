const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// ✅ Check if credentials are present
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error('❌ Cloudinary credentials missing in .env');
}

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Create storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'food-app',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'avif'], // ✅ AVIF added
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ✅ Upload Route with proper error handling
router.post('/upload', (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('❌ Multer Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: err.message || 'Upload failed' 
      });
    }
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }
    // Success
    console.log('✅ Image uploaded:', req.file.path);
    res.json({
      success: true,
      url: req.file.path,
    });
  });
});

module.exports = router;