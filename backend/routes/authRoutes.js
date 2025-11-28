// routes/authRoutes.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// REGISTER
router.post('/register', authController.register);

// LOGIN
router.post('/login', authController.login);

// GET PROFILE
router.get('/profile', authMiddleware, authController.getProfile);

// UPDATE PROFILE
router.put('/profile', authMiddleware, authController.updateProfile);

// CHANGE PASSWORD
router.put('/change-password', authMiddleware, authController.changePassword);

// VERIFY TOKEN
router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      userId: req.userId,
      email: req.userEmail
    }
  });
});

module.exports = router;
