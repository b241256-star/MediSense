// routes/chatRoutes.js
const express = require('express');
const router  = express.Router();
const { getChatHistory, sendMessage, clearChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// GET  /api/chat/history  ← Load saved chat messages
router.get('/history', protect, getChatHistory);

// POST /api/chat/message  ← Send message, get AI reply
router.post('/message', protect, sendMessage);

// DELETE /api/chat/clear  ← Clear all chat history
router.delete('/clear', protect, clearChatHistory);

module.exports = router;
