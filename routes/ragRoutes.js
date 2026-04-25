// RAG Routes 
const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middlewares/authMiddleware');
const logger = require('../utils/logger');
const { uploadPDF, queryRAG } = require('../controllers/ragController');

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  }
});


router.use((req, res, next) => {
  logger.info(`RAG ${req.method} ${req.path} - User: ${req.user?.id || 'anonymous'}`);
  next();
});


router.post('/upload-pdf', authMiddleware, upload.single('file'), uploadPDF);


router.post('/query', authMiddleware, queryRAG);

module.exports = router;

