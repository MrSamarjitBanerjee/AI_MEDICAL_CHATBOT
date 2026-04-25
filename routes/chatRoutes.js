// Chat Routes - Clean
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { handleChat } = require('../controllers/chatController');

const router = express.Router();

router.post('/chat', authMiddleware, handleChat);

module.exports = router;

