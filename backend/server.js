// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');

const app = express();
const server = http.createServer(app);

// ===============================================================
// MIDDLEWARE
// ===============================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================================================
// MONGO CONNECTION (CLEAN + MODERN)
// ===============================================================
const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mitroo';

  try {
    console.log(`🔗 Connecting to MongoDB...`);
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected → ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.log(`❌ MongoDB Error: ${error.message}`);
    console.log(`⚠️ Running in DEMO mode (no database)`); 
  }
};

connectDB();

// ===============================================================
// ROUTES LOADING (CLEAN)
// ===============================================================
const loadRoutes = () => {
  try {
    app.use('/api/auth', require('./routes/authRoutes'));
    console.log('✅ Auth routes loaded');
  } catch (e) { console.log('❌ Auth route error:', e.message); }

  try {
    app.use('/api/users', require('./routes/userRoutes'));
    console.log('✅ User routes loaded');
  } catch (e) { console.log('❌ User route error:', e.message); }

  try {
    app.use('/api/conversations', require('./routes/conversationRoutes'));
    console.log('✅ Conversation routes loaded');
  } catch (e) { console.log('❌ Conversation route error:', e.message); }

  try {
    app.use('/api/messages', require('./routes/messageRoutes'));
    console.log('✅ Message routes loaded');
  } catch (e) { console.log('❌ Message route error:', e.message); }
};

loadRoutes();

// ===============================================================
// WEBSOCKET SETUP
// ===============================================================
try {
  const SocketHandler = require('./websocket/socketHandler');
  new SocketHandler(server);
  console.log('🔌 WebSocket initialized');
} catch (error) {
  console.log('⚠️ WebSocket disabled:', error.message);
}

// ===============================================================
// BASIC ROUTES
// ===============================================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Mitroo Chat API",
    version: "1.0.0",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Demo Mode",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      conversations: "/api/conversations",
      messages: "/api/messages"
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime() + "s",
    timestamp: new Date().toISOString()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    data: {
      server: {
        status: "running",
        port: process.env.PORT || 5000
      },
      database: {
        status: mongoose.connection.readyState === 1 ? "connected" : "demo"
      }
    }
  });
});

// ===============================================================
// DEMO MODE ENDPOINTS (SAFE + CLEAN)
// ===============================================================
app.post('/api/auth/demo-login', (req, res) => {
  const { email, password } = req.body;

  if (email === "demo@example.com" && password === "password") {
    return res.json({
      success: true,
      message: "Demo login successful",
      data: {
        user: {
          id: "demo-user-1",
          name: "Demo User",
          email: "demo@example.com"
        },
        token: "demo-jwt-token",
        tokenExpiresIn: "24h"
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid demo credentials"
  });
});

app.get('/api/demo/conversations', (_, res) => {
  res.json({
    success: true,
    conversations: [
      {
        id: "1",
        name: "John Doe",
        isGroup: false,
        lastMessage: {
          content: "Hey, how are you?",
          timestamp: new Date().toISOString()
        }
      },
      {
        id: "2",
        name: "Work Group",
        isGroup: true,
        lastMessage: {
          content: "Meeting at 3 PM",
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      }
    ]
  });
});

// ===============================================================
// 404 HANDLER (CLEAN)
// ===============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// ===============================================================
// START SERVER
// ===============================================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("\n==============================================");
  console.log("🚀 MITROO SERVER STARTED");
  console.log("==============================================");
  console.log(`📡 Local:   http://localhost:${PORT}`);
  console.log(`🌐 LAN:     http://0.0.0.0:${PORT}`);
  console.log(`❤️ Health:  http://localhost:${PORT}/health`);
  console.log("==============================================\n");
});

// ===============================================================
// GRACEFUL SHUTDOWN
// ===============================================================
process.on('SIGINT', async () => {
  console.log("\n🔻 Shutting down server...");
  await mongoose.connection.close();
  console.log("✅ MongoDB disconnected");
  process.exit(0);
});

module.exports = { app, server };
