const express = require('express');
const upload = require('../middlewares/upload.middleware');
const { uploadImage } = require('../controllers/media.controller');

const router = express.Router();

// Route: POST /api/media/upload
// 'image' is the key name expected in the form-data
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
