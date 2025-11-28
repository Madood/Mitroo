import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('No auth token available for WebSocket connection');
      return;
    }

    // Connect to WebSocket server
    socketRef.current = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
      auth: {
        token: token
      }
    });

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      
      // Notify server that user is online
      socketRef.current.emit('user_online');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Message events
  const onNewMessage = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('new_message', callback);
    }
  };

  const onTyping = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('user_typing', callback);
    }
  };

  const onStopTyping = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('user_stop_typing', callback);
    }
  };

  // Call events
  const onIncomingCall = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('incoming_call', callback);
    }
  };

  const onCallAccepted = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('call_accepted', callback);
    }
  };

  const onCallRejected = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('call_rejected', callback);
    }
  };

  const onCallEnded = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('call_ended', callback);
    }
  };

  // Presence events
  const onUserStatusChanged = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('user_status_changed', callback);
    }
  };

  // Emit methods
  const joinConversation = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('join_conversation', conversationId);
    }
  };

  const leaveConversation = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('leave_conversation', conversationId);
    }
  };

  const sendMessage = (messageData) => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', messageData);
    }
  };

  const startTyping = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('typing_start', { conversationId });
    }
  };

  const stopTyping = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('typing_stop', { conversationId });
    }
  };

  const callUser = (callData) => {
    if (socketRef.current) {
      socketRef.current.emit('call_user', callData);
    }
  };

  const acceptCall = (callData) => {
    if (socketRef.current) {
      socketRef.current.emit('accept_call', callData);
    }
  };

  const rejectCall = (callData) => {
    if (socketRef.current) {
      socketRef.current.emit('reject_call', callData);
    }
  };

  const endCall = (callData) => {
    if (socketRef.current) {
      socketRef.current.emit('end_call', callData);
    }
  };

  // Remove event listeners
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    isConnected,
    onlineUsers,
    // Event listeners
    onNewMessage,
    onTyping,
    onStopTyping,
    onIncomingCall,
    onCallAccepted,
    onCallRejected,
    onCallEnded,
    onUserStatusChanged,
    // Emit methods
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    callUser,
    acceptCall,
    rejectCall,
    endCall,
    // Utility
    off
  };
};