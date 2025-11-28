const express = require('express');
const router = express.Router();

// Demo conversations data
const demoConversations = [
  {
    id: '1',
    name: 'John Doe',
    participants: ['1', '2'],
    isGroup: false,
    avatar: 'https://via.placeholder.com/150',
    lastMessage: {
      id: '1',
      content: 'Hey, how are you?',
      senderId: '2',
      timestamp: new Date(),
      conversationId: '1',
    },
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Team Chat',
    participants: ['1', '2', '3'],
    isGroup: true,
    avatar: 'https://via.placeholder.com/150',
    lastMessage: {
      id: '2',
      content: 'Meeting at 3 PM',
      senderId: '3',
      timestamp: new Date(Date.now() - 3600000),
      conversationId: '2',
    },
    updatedAt: new Date(Date.now() - 3600000),
  }
];

// Get all conversations for a user
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const conversations = demoConversations.filter(conv =>
    conv.participants.includes(userId)
  );

  res.json({
    success: true,
    conversations
  });
});

// Get conversation by ID
router.get('/:id', (req, res) => {
  const conversation = demoConversations.find(conv => conv.id === req.params.id);
  
  if (conversation) {
    res.json({
      success: true,
      conversation
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Conversation not found'
    });
  }
});

// Create new conversation
router.post('/', (req, res) => {
  const { participants, name, isGroup = false } = req.body;

  if (!participants || participants.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Participants are required'
    });
  }

  const newConversation = {
    id: Math.random().toString(36).substr(2, 9),
    name: name || participants.join(', '),
    participants,
    isGroup,
    avatar: 'https://via.placeholder.com/150',
    updatedAt: new Date()
  };

  demoConversations.push(newConversation);

  res.json({
    success: true,
    conversation: newConversation
  });
});

module.exports = router;