const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

class SocketHandler {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    
    this.connectedUsers = new Map(); // userId -> socketId
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    // Authentication middleware for WebSocket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const user = await User.findById(decoded.userId);
        
        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }

        socket.userId = user._id.toString();
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.user.name} connected with ID: ${socket.id}`);
      
      // Store user connection
      this.connectedUsers.set(socket.userId, socket.id);
      
      // Join user to their personal room for notifications
      socket.join(socket.userId);

      // ======================
      // MESSAGE EVENTS
      // ======================
      
      socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.user.name} joined conversation: ${conversationId}`);
      });

      socket.on('leave_conversation', (conversationId) => {
        socket.leave(conversationId);
        console.log(`User ${socket.user.name} left conversation: ${conversationId}`);
      });

      socket.on('send_message', async (data) => {
        try {
          const { conversationId, content } = data;
          
          // Create new message
          const message = new Message({
            conversationId,
            senderId: socket.userId,
            content,
            type: 'text'
          });

          await message.save();

          // Populate message with sender info
          await message.populate('senderId', 'name email');

          // Update conversation's last message and timestamp
          await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            updatedAt: new Date()
          });

          // Emit to all users in the conversation
          this.io.to(conversationId).emit('new_message', {
            success: true,
            data: { message }
          });

          // Emit conversation update to all participants
          const conversation = await Conversation.findById(conversationId);
          conversation.participants.forEach(participant => {
            this.io.to(participant.toString()).emit('conversation_updated', {
              conversationId,
              lastMessage: message
            });
          });

        } catch (error) {
          socket.emit('message_error', {
            success: false,
            message: 'Failed to send message'
          });
          console.error('Send message error:', error);
        }
      });

      socket.on('typing_start', (data) => {
        const { conversationId } = data;
        socket.to(conversationId).emit('user_typing', {
          userId: socket.userId,
          userName: socket.user.name,
          conversationId
        });
      });

      socket.on('typing_stop', (data) => {
        const { conversationId } = data;
        socket.to(conversationId).emit('user_stop_typing', {
          userId: socket.userId,
          conversationId
        });
      });

      // ======================
      // CALL EVENTS
      // ======================

      socket.on('call_user', (data) => {
        const { receiverId, callType, conversationId } = data;
        const receiverSocketId = this.connectedUsers.get(receiverId);
        
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit('incoming_call', {
            callerId: socket.userId,
            callerName: socket.user.name,
            callType,
            conversationId,
            callId: Date.now().toString() // Simple call ID generation
          });
        }
      });

      socket.on('accept_call', (data) => {
        const { callId, callerId } = data;
        const callerSocketId = this.connectedUsers.get(callerId);
        
        if (callerSocketId) {
          this.io.to(callerSocketId).emit('call_accepted', {
            callId,
            receiverId: socket.userId
          });
        }
      });

      socket.on('reject_call', (data) => {
        const { callId, callerId } = data;
        const callerSocketId = this.connectedUsers.get(callerId);
        
        if (callerSocketId) {
          this.io.to(callerSocketId).emit('call_rejected', {
            callId,
            receiverId: socket.userId
          });
        }
      });

      socket.on('end_call', (data) => {
        const { callId, receiverId } = data;
        const receiverSocketId = this.connectedUsers.get(receiverId);
        
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit('call_ended', {
            callId,
            endedBy: socket.userId
          });
        }
      });

      // ======================
      // PRESENCE EVENTS
      // ======================

      socket.on('user_online', () => {
        // Broadcast to user's contacts that they're online
        socket.broadcast.emit('user_status_changed', {
          userId: socket.userId,
          status: 'online'
        });
      });

      // ======================
      // DISCONNECTION
      // ======================

      socket.on('disconnect', () => {
        console.log(`User ${socket.user.name} disconnected`);
        this.connectedUsers.delete(socket.userId);
        
        // Broadcast offline status
        socket.broadcast.emit('user_status_changed', {
          userId: socket.userId,
          status: 'offline'
        });
      });
    });
  }

  // Utility method to send notifications to specific user
  sendToUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Utility method to broadcast to all users
  broadcast(event, data) {
    this.io.emit(event, data);
  }
}

module.exports = SocketHandler;