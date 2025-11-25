import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useStore } from '../store/useStore';

// Simple TopBar component
const TopBar = ({ 
  title, 
  rightContent 
}: { 
  title: string;
  rightContent?: React.ReactNode;
}) => {
  return (
    <View style={topBarStyles.container}>
      <Text style={topBarStyles.title}>{title}</Text>
      {rightContent && (
        <View style={topBarStyles.rightContent}>
          {rightContent}
        </View>
      )}
    </View>
  );
};

const topBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

// Simple ConversationItem component with call buttons
const ConversationItem = ({ 
  conversation, 
  currentUserId, 
  onClick,
  onVoiceCall,
  onVideoCall
}: { 
  conversation: any; 
  currentUserId: string; 
  onClick: () => void;
  onVoiceCall: () => void;
  onVideoCall: () => void;
}) => {
  // For demo - get the other participant
  const otherParticipantId = conversation.participants.find((p: string) => p !== currentUserId);
  const otherUser = {
    id: otherParticipantId,
    name: conversation.name || 'Unknown User',
    lastMessage: conversation.lastMessage?.content || 'No messages yet',
    timestamp: conversation.lastMessage?.timestamp || new Date(),
    unread: false,
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <TouchableOpacity style={conversationItemStyles.container} onPress={onClick}>
      <View style={conversationItemStyles.avatar}>
        <Text style={conversationItemStyles.avatarText}>
          {otherUser.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={conversationItemStyles.content}>
        <View style={conversationItemStyles.header}>
          <Text style={conversationItemStyles.name} numberOfLines={1}>
            {otherUser.name}
          </Text>
          <Text style={conversationItemStyles.time}>
            {formatTime(otherUser.timestamp)}
          </Text>
        </View>
        
        <Text style={conversationItemStyles.message} numberOfLines={2}>
          {otherUser.lastMessage}
        </Text>
      </View>
      
      {/* Call Buttons */}
      <View style={conversationItemStyles.callButtons}>
        <TouchableOpacity 
          style={conversationItemStyles.callButton}
          onPress={onVoiceCall}
        >
          <Icon name="phone" size={16} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={conversationItemStyles.callButton}
          onPress={onVideoCall}
        >
          <Icon name="video" size={16} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const conversationItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  callButtons: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  callButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Empty State Component
const EmptyState = ({ onFindContacts }: { onFindContacts: () => void }) => {
  return (
    <View style={emptyStateStyles.container}>
      <Icon name="message-square" size={64} color="#d1d5db" />
      <Text style={emptyStateStyles.title}>No conversations yet</Text>
      <Text style={emptyStateStyles.description}>
        Find contacts and start messaging
      </Text>
      <TouchableOpacity style={emptyStateStyles.button} onPress={onFindContacts}>
        <Icon name="user-plus" size={20} color="#ffffff" />
        <Text style={emptyStateStyles.buttonText}>Find Contacts</Text>
      </TouchableOpacity>
    </View>
  );
};

const emptyStateStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Main ConversationsScreen Component
export function ConversationsScreen() {
  const currentUser = useStore(state => state.currentUser);
  const conversations = useStore(state => state.conversations);
  const setCurrentView = useStore(state => state.setCurrentView);
  const logout = useStore(state => state.logout);
  const setSelectedConversation = useStore(state => state.setSelectedConversation);
  const initiateCall = useStore(state => state.initiateCall);
  
  const selectConversation = (conversationId: string) => {
    console.log('Selected conversation:', conversationId);
    setSelectedConversation(conversationId);
  };

  const handleVoiceCall = (conversationId: string, userId: string | undefined) => {
    if (!userId) {
      console.log('Cannot make call: user ID not found');
      return;
    }
    console.log('Initiating voice call to:', userId);
    initiateCall(userId, 'audio');
  };

  const handleVideoCall = (conversationId: string, userId: string | undefined) => {
    if (!userId) {
      console.log('Cannot make call: user ID not found');
      return;
    }
    console.log('Initiating video call to:', userId);
    initiateCall(userId, 'video');
  };

  if (!currentUser) return null;

  // Sort conversations by last message timestamp or fallback to current date
  const sortedConversations = [...conversations].sort((a, b) => {
    const timeA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : new Date().getTime();
    const timeB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : new Date().getTime();
    return timeB - timeA;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <TopBar
        title="Mitroo"
        rightContent={
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setCurrentView('contacts' as any)}
            >
              <Icon name="user-plus" size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setCurrentView('settings' as any)}
            >
              <Icon name="settings" size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={logout}
            >
              <Icon name="log-out" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        }
      />
      
      {conversations.length === 0 ? (
        <EmptyState onFindContacts={() => setCurrentView('contacts' as any)} />
      ) : (
        <ScrollView style={styles.conversationsList}>
          {sortedConversations.map(conversation => {
            // Find the other user ID for calls - handle undefined case
            const otherUserId = conversation.participants.find((p: string) => p !== currentUser.id);
            
            return (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                currentUserId={currentUser.id}
                onClick={() => selectConversation(conversation.id)}
                onVoiceCall={() => handleVoiceCall(conversation.id, otherUserId)}
                onVideoCall={() => handleVideoCall(conversation.id, otherUserId)}
              />
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  conversationsList: {
    flex: 1,
  },
});