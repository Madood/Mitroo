// store/useStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type View = 'login' | 'signup' | 'conversations' | 'chat' | 'settings' | 'call' | 'contacts';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  online?: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  conversationId: string;
}

export interface Conversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: Message;
  isGroup: boolean;
  avatar?: string;
  updatedAt?: Date;
}

export interface Call {
  id: string;
  callerId: string;
  receiverId: string;
  type: 'audio' | 'video';
  status: 'ringing' | 'active' | 'ended';
}

interface AppState {
  // Authentication
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // UI State
  currentView: View;
  isLoading: boolean;
  selectedConversationId: string | null;
  
  // Data
  conversations: Conversation[];
  messages: Message[];
  activeCall: Call | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  setCurrentView: (view: View) => void;
  setCurrentUser: (user: User | null) => void;
  setSelectedConversation: (id: string) => void;
  addConversation: (conversation: Conversation) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  initiateCall: (userId: string, type: 'audio' | 'video') => void;
  endCall: () => void;
  answerCall: () => void;
}

// Demo data
const demoUsers: User[] = [
  { 
    id: '1', 
    email: 'user@example.com', 
    name: 'Demo User',
    online: true,
    lastSeen: new Date()
  },
];

const demoConversations: Conversation[] = [
  {
    id: '1',
    name: 'John Doe',
    participants: ['1', '2'],
    isGroup: false,
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
    lastMessage: {
      id: '2',
      content: 'Meeting at 3 PM',
      senderId: '3',
      timestamp: new Date(Date.now() - 3600000),
      conversationId: '2',
    },
    updatedAt: new Date(Date.now() - 3600000),
  },
];

const demoMessages: Message[] = [
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
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      currentView: 'login',
      isLoading: false,
      selectedConversationId: null,
      conversations: [],
      messages: [],
      activeCall: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const user = demoUsers[0] || {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          online: true,
          lastSeen: new Date(),
        };
        
        set({
          currentUser: user,
          isAuthenticated: true,
          isLoading: false,
          conversations: demoConversations,
          messages: demoMessages,
          currentView: 'conversations',
        });
        
        return true;
      },

      signup: async (email: string, password: string, name?: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: name || email.split('@')[0],
          online: true,
          lastSeen: new Date(),
        };
        
        set({
          currentUser: user,
          isAuthenticated: true,
          isLoading: false,
          conversations: demoConversations,
          messages: demoMessages,
          currentView: 'conversations',
        });
        
        return true;
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          currentView: 'login',
          conversations: [],
          messages: [],
          activeCall: null,
          selectedConversationId: null,
        });
      },

      setCurrentView: (view: View) => {
        set({ currentView: view });
      },

      setCurrentUser: (user: User | null) => {
        set({ currentUser: user, isAuthenticated: !!user });
      },

      setSelectedConversation: (id: string) => {
        set({ selectedConversationId: id, currentView: 'chat' });
      },

      addConversation: (conversation: Conversation) => {
        set(state => ({
          conversations: [...state.conversations, conversation],
        }));
      },

      addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => {
        const newMessage: Message = {
          ...message,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
        };
        
        set(state => ({
          messages: [...state.messages, newMessage],
          conversations: state.conversations.map(conv => 
            conv.id === message.conversationId 
              ? { 
                  ...conv, 
                  lastMessage: newMessage,
                  updatedAt: new Date()
                }
              : conv
          ),
        }));
      },

      setConversations: (conversations: Conversation[]) => {
        set({ conversations });
      },

      setMessages: (messages: Message[]) => {
        set({ messages });
      },

      initiateCall: (userId: string, type: 'audio' | 'video') => {
        const { currentUser } = get();
        if (!currentUser) return;
        
        const call: Call = {
          id: Math.random().toString(36).substr(2, 9),
          callerId: currentUser.id,
          receiverId: userId,
          type,
          status: 'active', // Set to active for immediate testing
        };
        
        set({ activeCall: call, currentView: 'call' });
        
        console.log('Call initiated:', call);
      },

      endCall: () => {
        console.log('Ending call...');
        set({ 
          activeCall: null, 
          currentView: 'conversations' 
        });
      },

      answerCall: () => {
        set(state => ({
          activeCall: state.activeCall ? { ...state.activeCall, status: 'active' } : null
        }));
      },
    }),
    {
      name: 'mitroo-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        conversations: state.conversations,
        messages: state.messages,
      }),
    }
  )
);

// Selectors for better performance
export const useCurrentUser = () => useStore(state => state.currentUser);
export const useIsAuthenticated = () => useStore(state => state.isAuthenticated);
export const useCurrentView = () => useStore(state => state.currentView);
export const useConversations = () => useStore(state => state.conversations);
export const useMessages = (conversationId?: string) => 
  useStore(state => 
    conversationId 
      ? state.messages.filter(msg => msg.conversationId === conversationId)
      : state.messages
  );
export const useActiveCall = () => useStore(state => state.activeCall);
export const useSelectedConversationId = () => useStore(state => state.selectedConversationId);

// Action hooks
export const useAuthActions = () => useStore(state => ({
  login: state.login,
  signup: state.signup,
  logout: state.logout,
}));

export const useUIActions = () => useStore(state => ({
  setCurrentView: state.setCurrentView,
  setSelectedConversation: state.setSelectedConversation,
}));

export const useConversationActions = () => useStore(state => ({
  addConversation: state.addConversation,
  addMessage: state.addMessage,
  setConversations: state.setConversations,
  setMessages: state.setMessages,
}));

export const useCallActions = () => useStore(state => ({
  initiateCall: state.initiateCall,
  endCall: state.endCall,
  answerCall: state.answerCall,
}));