// Chat Controller - Production ready
const ChatMessage = require('../models/ChatMessage');
const { getResponse } = require('../services/llmService');
const logger = require('../utils/logger');

const handleChat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user.id; // From auth middleware

    logger.info(`Chat message from user ${userId}: ${message?.substring(0, 50)}...`);

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get LLM response
    const systemPrompt = 'You are a helpful medical assistant. Provide accurate information and suggest consulting professionals for serious issues.';
    const aiReply = await getResponse(history.length > 0 ? history : message, systemPrompt);

    

    res.json({ reply: aiReply });
  } catch (error) {
    logger.error(`Chat error for user ${req.user?.id}: ${error.message}`);
    next(error);
  }
};

module.exports = { handleChat };

