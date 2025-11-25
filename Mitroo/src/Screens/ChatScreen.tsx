import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useStore } from '../store/useStore';

// Components
const Avatar = ({ user, size = 'md', showOnline = false }: { user: any; size?: 'sm' | 'md' | 'lg'; showOnline?: boolean }) => {
  const sizeMap = { sm: 32, md: 40, lg: 48 };
  const fontSizeMap = { sm: 14, md: 16, lg: 18 };
  
  return (
    <View style={[avatarStyles.container, { width: sizeMap[size], height: sizeMap[size] }]}>
      <Text style={[avatarStyles.text, { fontSize: fontSizeMap[size] }]}>
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </Text>
      {showOnline && user?.online && <View style={avatarStyles.onlineIndicator} />}
    </View>
  );
};

const MessageBubble = ({ message, isOwn }: { message: any; isOwn: boolean }) => {
  return (
    <View style={[
      messageBubbleStyles.container,
      isOwn ? messageBubbleStyles.ownMessage : messageBubbleStyles.otherMessage
    ]}>
      <Text style={[
        messageBubbleStyles.text,
        isOwn ? messageBubbleStyles.ownText : messageBubbleStyles.otherText
      ]}>
        {message.content}
      </Text>
      <Text style={[
        messageBubbleStyles.time,
        isOwn ? messageBubbleStyles.ownTime : messageBubbleStyles.otherTime
      ]}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

const InputBar = ({ onSend, onTyping }: { onSend: (message: string) => void; onTyping: () => void }) => {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };
  
  return (
    <View style={inputBarStyles.container}>
      <View style={inputBarStyles.inputContainer}>
        <TouchableOpacity style={inputBarStyles.attachmentButton}>
          <Icon name="plus" size={20} color="#6b7280" />
        </TouchableOpacity>
        <TextInput
          style={inputBarStyles.input}
          value={message}
          onChangeText={(text) => {
            setMessage(text);
            onTyping();
          }}
          placeholder="Type a message..."
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={500}
        />
        {message.trim() ? (
          <TouchableOpacity style={inputBarStyles.sendButton} onPress={handleSend}>
            <Icon name="send" size={20} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={inputBarStyles.emojiButton}>
            <Icon name="smile" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const TopBar = ({ 
  title, 
  subtitle, 
  onBack, 
  leftContent, 
  onVideoCall, 
  onVoiceCall 
}: { 
  title: string;
  subtitle: string;
  onBack: () => void;
  leftContent: React.ReactNode;
  onVideoCall?: () => void;
  onVoiceCall?: () => void;
}) => {
  return (
    <View style={topBarStyles.container}>
      <TouchableOpacity onPress={onBack} style={topBarStyles.backButton}>
        <Icon name="arrow-left" size={24} color="#374151" />
      </TouchableOpacity>
      
      <View style={topBarStyles.userInfo}>
        {leftContent}
        <View style={topBarStyles.textContainer}>
          <Text style={topBarStyles.title}>{title}</Text>
          <Text style={topBarStyles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      
      <View style={topBarStyles.actions}>
        {onVoiceCall && (
          <TouchableOpacity onPress={onVoiceCall} style={topBarStyles.actionButton}>
            <Icon name="phone" size={20} color="#374151" />
          </TouchableOpacity>
        )}
        {onVideoCall && (
          <TouchableOpacity onPress={onVideoCall} style={topBarStyles.actionButton}>
            <Icon name="video" size={20} color="#374151" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Styles
const avatarStyles = StyleSheet.create({
  container: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    backgroundColor: '#10b981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});

const messageBubbleStyles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    alignSelf: 'flex-start',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: '#e5e7eb',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: '#ffffff',
  },
  otherText: {
    color: '#374151',
  },
  time: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  ownTime: {
    color: '#dbeafe',
    textAlign: 'right',
  },
  otherTime: {
    color: '#6b7280',
  },
});

const inputBarStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f9fafb',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachmentButton: {
    padding: 4,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 8,
  },
});

const topBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

// Main ChatScreen Component
export function ChatScreen() {
  const currentUser = useStore(state => state.currentUser);
  const conversations = useStore(state => state.conversations);
  const messages = useStore(state => state.messages);
  const addMessage = useStore(state => state.addMessage);
  const setCurrentView = useStore(state => state.setCurrentView);
  const selectedConversationId = useStore(state => state.selectedConversationId);
  const initiateCall = useStore(state => state.initiateCall);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Use the selected conversation instead of just the first one
  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || conversations[0];
  const conversationMessages = messages.filter(msg => 
    msg.conversationId === selectedConversation?.id
  );
  
  // Find the other user from the conversation
  const otherUserId = selectedConversation?.participants?.find((p: string) => p !== currentUser?.id);
  
  // Mock user data for demo
  const otherUserData = {
    id: otherUserId || '2',
    name: selectedConversation?.name || 'John Doe',
    online: true,
    lastSeen: new Date(),
  };
  
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [conversationMessages]);
  
  const handleSend = (content: string) => {
    if (selectedConversation && currentUser) {
      addMessage({
        conversationId: selectedConversation.id,
        content,
        senderId: currentUser.id,
      });
    }
  };
  
  const handleTyping = () => {
    console.log('User is typing...');
  };
  
  const handleVideoCall = () => {
    console.log('Initiate video call to:', otherUserData.id);
    if (otherUserData.id) {
      initiateCall(otherUserData.id, 'video');
    }
  };
  
  const handleVoiceCall = () => {
    console.log('Initiate voice call to:', otherUserData.id);
    if (otherUserData.id) {
      initiateCall(otherUserData.id, 'audio');
    }
  };
  
  if (!selectedConversation || !currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <View style={styles.centered}>
          <Text style={styles.noConversationText}>Select a conversation to start messaging</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <TopBar
        title={otherUserData.name}
        subtitle={otherUserData.online ? 'Online' : `Last seen ${otherUserData.lastSeen.toLocaleTimeString()}`}
        onBack={() => setCurrentView('conversations')}
        leftContent={<Avatar user={otherUserData} size="sm" showOnline />}
        onVideoCall={handleVideoCall}
        onVoiceCall={handleVoiceCall}
      />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {conversationMessages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUser.id}
          />
        ))}
        <View style={styles.spacer} />
      </ScrollView>
      
      <InputBar onSend={handleSend} onTyping={handleTyping} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noConversationText: {
    color: '#6b7280',
    fontSize: 16,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  spacer: {
    height: 16,
  },
});