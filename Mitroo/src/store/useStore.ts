// store/useStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser, loginUser, logoutUser, getStoredUser, isAuthenticated } from '../services/api/authApi';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export type View = 'login' | 'signup' | 'conversations' | 'chat' | 'settings' | 'call' | 'contacts' | 'conversation';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  online?: boolean;
  lastSeen?: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
  userId: string;
  contactUserId: string;
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

// =============================================================================
// DEMO DATA
// =============================================================================

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

const demoContacts: Contact[] = [
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://via.placeholder.com/150',
    online: true,
    userId: '1',
    contactUserId: '2',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://via.placeholder.com/150',
    online: false,
    userId: '1',
    contactUserId: '3',
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://via.placeholder.com/150',
    online: true,
    userId: '1',
    contactUserId: '4',
  },
];

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface AppState {
  // ===============================
  // STATE PROPERTIES
  // ===============================
  
  // Authentication State
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // UI State
  currentView: View;
  isLoading: boolean;
  selectedConversationId: string | null;
  
  // Data State
  conversations: Conversation[];
  messages: Message[];
  contacts: Contact[];
  activeCall: Call | null;
  incomingCall: Call | null;
  
  // ===============================
  // ACTION METHODS
  // ===============================
  
  // Authentication Actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
  initializeAuth: () => Promise<void>;
  
  // Navigation Actions
  setCurrentView: (view: View) => void;
  setSelectedConversation: (id: string) => void;
  
  // Conversation Actions
  addConversation: (conversation: Conversation) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  startConversation: (userId: string, type: 'direct' | 'group') => void;
  
  // Contact Actions
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  removeContact: (contactId: string) => void;
  updateContactStatus: (contactUserId: string, online: boolean) => void;
  getContactByUserId: (userId: string) => Contact | undefined;
  
  // Call Actions
  initiateCall: (userId: string, type: 'audio' | 'video') => void;
  endCall: () => void;
  answerCall: () => void;
  acceptCall: () => void;
  rejectCall: () => void;
  setIncomingCall: (call: Call | null) => void;
}

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ===============================
      // INITIAL STATE
      // ===============================
      currentUser: null,
      isAuthenticated: false,
      currentView: 'login',
      isLoading: false,
      selectedConversationId: null,
      conversations: demoConversations,
      messages: demoMessages,
      contacts: demoContacts,
      activeCall: null,
      incomingCall: null,

      // ===============================
      // AUTHENTICATION ACTIONS
      // ===============================

      initializeAuth: async () => {
        try {
          const authenticated = await isAuthenticated();
          if (authenticated) {
            const user = await getStoredUser();
            if (user) {
              set({
                currentUser: user,
                isAuthenticated: true,
                currentView: 'conversations',
                conversations: demoConversations,
                messages: demoMessages,
                contacts: demoContacts,
              });
            }
          }
        } catch (error) {
          console.log('Auth initialization error:', error);
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const result = await loginUser({ email, password });
          
          if (result.success) {
            const user = result.data.user;
            set({
              currentUser: user,
              isAuthenticated: true,
              isLoading: false,
              conversations: demoConversations,
              messages: demoMessages,
              contacts: demoContacts,
              currentView: 'conversations',
            });
            return true;
          } else {
            set({ isLoading: false });
            throw new Error(result.message || 'Login failed. Please check your credentials.');
          }
        } catch (error) {
          set({ isLoading: false });
          if (error instanceof Error) {
            throw error;
          } else {
            throw new Error('Login failed. Please try again.');
          }
        }
      },

      signup: async (email: string, password: string, name?: string) => {
        set({ isLoading: true });
        
        try {
          const result = await registerUser({ 
            email, 
            password, 
            name: name || email.split('@')[0] 
          });
          
          if (result.success) {
            const user = result.data.user;
            set({
              currentUser: user,
              isAuthenticated: true,
              isLoading: false,
              conversations: demoConversations,
              messages: demoMessages,
              contacts: [], // New users start with empty contacts
              currentView: 'conversations',
            });
            return true;
          } else {
            set({ isLoading: false });
            throw new Error(result.message || 'Registration failed. Please try again.');
          }
        } catch (error) {
          set({ isLoading: false });
          if (error instanceof Error) {
            throw error;
          } else {
            throw new Error('Registration failed. Please try again.');
          }
        }
      },

      logout: async () => {
        await logoutUser();
        set({
          currentUser: null,
          isAuthenticated: false,
          currentView: 'login',
          conversations: demoConversations,
          messages: demoMessages,
          contacts: [],
          activeCall: null,
          incomingCall: null,
          selectedConversationId: null,
        });
      },

      setCurrentUser: (user: User | null) => {
        set({ currentUser: user, isAuthenticated: !!user });
      },

      // ===============================
      // NAVIGATION ACTIONS
      // ===============================

      setCurrentView: (view: View) => {
        set({ currentView: view });
      },

      setSelectedConversation: (id: string) => {
        set({ selectedConversationId: id, currentView: 'chat' });
      },

      // ===============================
      // CONVERSATION ACTIONS
      // ===============================

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

      startConversation: (userId: string, type: 'direct' | 'group') => {
        const { currentUser, contacts, conversations } = get();
        
        if (!currentUser) return;

        // Check if conversation already exists
        const existingConversation = conversations.find(conv => 
          !conv.isGroup && 
          conv.participants.includes(userId) && 
          conv.participants.includes(currentUser.id)
        );

        if (existingConversation) {
          // Navigate to existing conversation
          set({ 
            selectedConversationId: existingConversation.id, 
            currentView: 'chat' 
          });
          return;
        }

        // Find contact details
        const contact = contacts.find(c => c.contactUserId === userId);
        if (!contact) {
          console.warn('Cannot start conversation with non-contact user');
          return;
        }

        // Create new conversation
        const newConversation: Conversation = {
          id: Math.random().toString(36).substr(2, 9),
          name: contact.name,
          participants: [currentUser.id, userId],
          isGroup: false,
          avatar: contact.avatar,
          updatedAt: new Date(),
        };

        set(state => ({
          conversations: [...state.conversations, newConversation],
          selectedConversationId: newConversation.id,
          currentView: 'chat',
        }));
      },

      // ===============================
      // CONTACT ACTIONS
      // ===============================

      setContacts: (contacts: Contact[]) => {
        set({ contacts });
      },

      addContact: (contact: Contact) => {
        set(state => ({
          contacts: [...state.contacts, contact]
        }));
      },

      removeContact: (contactId: string) => {
        set(state => ({
          contacts: state.contacts.filter(contact => contact.id !== contactId)
        }));
      },

      updateContactStatus: (contactUserId: string, online: boolean) => {
        set(state => ({
          contacts: state.contacts.map(contact =>
            contact.contactUserId === contactUserId
              ? { ...contact, online }
              : contact
          )
        }));
      },

      getContactByUserId: (userId: string) => {
        const state = get();
        return state.contacts.find(contact => contact.contactUserId === userId);
      },

      // ===============================
      // CALL ACTIONS
      // ===============================

      initiateCall: (userId: string, type: 'audio' | 'video') => {
        const { currentUser, contacts } = get();
        if (!currentUser) return;
        
        const contact = contacts.find(c => c.contactUserId === userId);
        if (!contact) {
          console.warn('Cannot call user not in contacts');
          return;
        }
        
        const call: Call = {
          id: Math.random().toString(36).substr(2, 9),
          callerId: currentUser.id,
          receiverId: userId,
          type,
          status: 'active',
        };
        
        set({ activeCall: call, currentView: 'call' });
      },

      endCall: () => {
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

      acceptCall: () => {
        const { incomingCall, contacts } = get();
        if (incomingCall) {
          const callerContact = contacts.find(c => c.contactUserId === incomingCall.callerId);
          if (!callerContact) {
            console.warn('Cannot accept call from user not in contacts');
            set({ incomingCall: null });
            return;
          }
          
          set({ 
            activeCall: { ...incomingCall, status: 'active' },
            incomingCall: null,
            currentView: 'call'
          });
        }
      },

      rejectCall: () => {
        set({ 
          incomingCall: null,
          currentView: 'conversations'
        });
      },

      setIncomingCall: (call: Call | null) => {
        const { contacts } = get();
        
        if (call) {
          const callerContact = contacts.find(c => c.contactUserId === call.callerId);
          if (!callerContact) {
            console.warn('Ignoring call from non-contact user');
            return;
          }
        }
        
        set({ incomingCall: call });
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
        contacts: state.contacts,
      }),
    }
  )
);

// =============================================================================
// REUSABLE SELECTOR HOOKS
// =============================================================================

// ===============================
// STATE SELECTORS
// ===============================

export const useCurrentUser = () => useStore(state => state.currentUser);
export const useIsAuthenticated = () => useStore(state => state.isAuthenticated);
export const useCurrentView = () => useStore(state => state.currentView);
export const useConversations = () => useStore(state => state.conversations);
export const useMessages = (conversationId?: string | null) => 
  useStore(state => 
    conversationId 
      ? state.messages.filter(msg => msg.conversationId === conversationId)
      : state.messages
  );
export const useContacts = () => useStore(state => state.contacts);
export const useOnlineContacts = () => 
  useStore(state => state.contacts.filter(contact => contact.online));
export const useContactByUserId = (userId: string) => 
  useStore(state => state.contacts.find(contact => contact.contactUserId === userId));
export const useActiveCall = () => useStore(state => state.activeCall);
export const useIncomingCall = () => useStore(state => state.incomingCall);
export const useSelectedConversationId = () => useStore(state => state.selectedConversationId);

// ===============================
// ACTION GROUP HOOKS
// ===============================

export const useAuthActions = () => useStore(state => ({
  login: state.login,
  signup: state.signup,
  logout: state.logout,
  initializeAuth: state.initializeAuth,
  setCurrentUser: state.setCurrentUser,
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
  startConversation: state.startConversation,
}));

export const useContactActions = () => useStore(state => ({
  setContacts: state.setContacts,
  addContact: state.addContact,
  removeContact: state.removeContact,
  updateContactStatus: state.updateContactStatus,
  getContactByUserId: state.getContactByUserId,
}));

export const useCallActions = () => useStore(state => ({
  initiateCall: state.initiateCall,
  endCall: state.endCall,
  answerCall: state.answerCall,
  acceptCall: state.acceptCall,
  rejectCall: state.rejectCall,
  setIncomingCall: state.setIncomingCall,
}));

// ===============================
// COMBINED UTILITY HOOKS
// ===============================

export const useContactManagement = () => {
  const contacts = useContacts();
  const { addContact, removeContact, updateContactStatus } = useContactActions();
  
  return {
    contacts,
    addContact,
    removeContact,
    updateContactStatus,
    onlineContacts: contacts.filter(contact => contact.online),
    offlineContacts: contacts.filter(contact => !contact.online),
  };
};

export const useCallWithContactValidation = () => {
  const { initiateCall } = useCallActions();
  const contacts = useContacts();
  
  const validatedInitiateCall = (userId: string, type: 'audio' | 'video') => {
    const contact = contacts.find(c => c.contactUserId === userId);
    if (!contact) {
      throw new Error('Cannot call user not in contacts');
    }
    initiateCall(userId, type);
  };
  
  return {
    initiateCall: validatedInitiateCall,
  };
};

export const useConversationManagement = () => {
  const conversations = useConversations();
  const selectedConversationId = useSelectedConversationId();
  const { startConversation, addMessage } = useConversationActions();
  
  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);
  const selectedConversationMessages = useMessages(selectedConversationId);
  
  return {
    conversations,
    selectedConversation,
    selectedConversationMessages,
    startConversation,
    addMessage,
  };
};

export const useUserStatus = () => {
  const currentUser = useCurrentUser();
  const contacts = useContacts();
  
  return {
    currentUser,
    isOnline: currentUser?.online || false,
    onlineContactsCount: contacts.filter(contact => contact.online).length,
    totalContactsCount: contacts.length,
  };
};

// ===============================
// SPECIALIZED SELECTORS
// ===============================

export const useConversationMessages = (conversationId: string | null) => {
  return useStore(state => 
    conversationId 
      ? state.messages.filter(msg => msg.conversationId === conversationId)
      : []
  );
};

export const useConversationById = (conversationId: string | null) => {
  return useStore(state => 
    conversationId 
      ? state.conversations.find(conv => conv.id === conversationId)
      : null
  );
};

export const useUnreadMessagesCount = (conversationId?: string) => {
  return useStore(state => {
    if (conversationId) {
      return state.messages.filter(msg => 
        msg.conversationId === conversationId 
        // Add your read/unread logic here
      ).length;
    }
    return state.messages.length;
  });
};