const express = require('express');
const router = express.Router();

// Demo messages data
const demoMessages = [
  {
    id: '1',
    content: 'Hello there!',
    senderId: '2',
    timestamp: new Date(Date.now() - 86400000),
    conversationId: '1',
  },
  {
    id: '2',
    content: 'Hi! How are you doing?',
    senderId: '1',
    timestamp: new Date(Date.now() - 43200000),
    conversationId: '1',
  },
  {
    id: '3',
    content: 'Hey, how are you?',
    senderId: '2',
    timestamp: new Date(),
    conversationId: '1',
  }
];

// Get messages for a conversation
router.get('/conversation/:conversationId', (req, res) => {
  const conversationId = req.params.conversationId;
  const messages = demoMessages.filter(msg => 
    msg.conversationId === conversationId
  );

  res.json({
    success: true,
    messages
  });
});

// Send a message
router.post('/', (req, res) => {
  const { content, senderId, conversationId } = req.body;

  if (!content || !senderId || !conversationId) {
    return res.status(400).json({
      success: false,
      message: 'Content, senderId, and conversationId are required'
    });
  }

  const newMessage = {
    id: Math.random().toString(36).substr(2, 9),
    content,
    senderId,
    conversationId,
    timestamp: new Date()
  };

  demoMessages.push(newMessage);

  res.json({
    success: true,
    message: newMessage
  });
});

module.exports = router;