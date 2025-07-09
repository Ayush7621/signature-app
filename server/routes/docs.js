const express = require('express');
const multer = require('multer');
const Document = require('../models/Document');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Upload PDF Route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('📥 Upload route hit');
    console.log('File:', req.file);
    console.log('Body:', req.body);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const doc = new Document({
      userId: req.body.userId,
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path
    });

    await doc.save();
    res.status(201).json({ message: 'File uploaded', document: doc });
  } catch (err) {
    console.error('❌ Upload Error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// List all uploaded PDFs
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find().sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

module.exports = router;