// @desc    Upload an image
// @route   POST /api/media/upload
exports.uploadImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Construct the public URL for the image
  // Assuming server runs on localhost:3000
  const protocol = req.protocol;
  const host = req.get('host');
  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    url: imageUrl // Assessment Requirement: Return access URL
  });
};