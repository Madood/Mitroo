import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useStore } from '../store/useStore';

const { width, height } = Dimensions.get('window');

// Simple Avatar component
const Avatar = ({ user, size = 'md' }: { user: any; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    sm: 40,
    md: 56,
    lg: 80,
  };
  
  const fontSizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  
  return (
    <View style={[
      avatarStyles.container,
      {
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: sizeMap[size] / 2,
      }
    ]}>
      <Text style={[
        avatarStyles.text,
        { fontSize: fontSizeMap[size] }
      ]}>
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </Text>
    </View>
  );
};

const avatarStyles = StyleSheet.create({
  container: {
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export function CallScreen() {
  // Use actual store data
  const activeCall = useStore(state => state.activeCall);
  const endCall = useStore(state => state.endCall);
  const conversations = useStore(state => state.conversations);
  const currentUser = useStore(state => state.currentUser);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  
  useEffect(() => {
    if (activeCall?.status === 'active') {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [activeCall?.status]);
  
  // Return null if no active call or user
  if (!activeCall || !currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#111827" barStyle="light-content" />
        <View style={styles.centered}>
          <Text style={styles.noCallText}>No active call</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const otherUserId = activeCall.callerId === currentUser.id ? activeCall.receiverId : activeCall.callerId;
  
  // Find the conversation to get the other user's name
  const conversation = conversations.find(conv => 
    conv.participants.includes(otherUserId)
  );
  
  // For demo purposes, create a mock user
  const otherUser = {
    id: otherUserId,
    name: conversation?.name || 'Call Participant',
    email: 'user@example.com',
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleEndCall = () => {
    console.log('End call pressed');
    endCall(); // This will now work with the updated store
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#111827" barStyle="light-content" />
      
      {/* Remote video (full screen) */}
      <View style={styles.remoteVideoContainer}>
        {activeCall.status === 'active' && !isVideoOff && activeCall.type === 'video' ? (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoPlaceholderText}>Simulated video stream</Text>
            <View style={styles.videoSimulation} />
          </View>
        ) : (
          <View style={styles.audioCallContainer}>
            <Avatar user={otherUser} size="lg" />
            <Text style={styles.userName}>{otherUser.name}</Text>
            <Text style={styles.callStatus}>
              {activeCall.status === 'ringing' ? 'Calling...' : formatDuration(callDuration)}
            </Text>
            <Text style={styles.callType}>
              {activeCall.type === 'audio' ? 'Audio Call' : 'Video Call'}
            </Text>
          </View>
        )}
      </View>
      
      {/* Local video (picture-in-picture) - Only show for video calls */}
      {activeCall.status === 'active' && activeCall.type === 'video' && (
        <View style={styles.localVideoContainer}>
          {!isVideoOff ? (
            <View style={styles.localVideoPlaceholder}>
              <Text style={styles.localVideoText}>You</Text>
            </View>
          ) : (
            <View style={styles.localVideoAvatar}>
              <Avatar user={currentUser} size="md" />
            </View>
          )}
        </View>
      )}
      
      {/* Call controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              isMuted ? styles.controlButtonActive : styles.controlButtonInactive
            ]}
            onPress={() => setIsMuted(!isMuted)}
            accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
          >
            <Icon 
              name={isMuted ? "mic-off" : "mic"} 
              size={24} 
              color="#ffffff" 
            />
          </TouchableOpacity>
          
          {activeCall.type === 'video' && (
            <>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  isVideoOff ? styles.controlButtonActive : styles.controlButtonInactive
                ]}
                onPress={() => setIsVideoOff(!isVideoOff)}
                accessibilityLabel={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
              >
                <Icon 
                  name={isVideoOff ? "video-off" : "video"} 
                  size={24} 
                  color="#ffffff" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => console.log('Switch camera')}
                accessibilityLabel="Switch camera"
              >
                <Icon name="refresh-cw" size={24} color="#ffffff" />
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity
            style={[
              styles.controlButton,
              !isSpeakerOn ? styles.controlButtonActive : styles.controlButtonInactive
            ]}
            onPress={() => setIsSpeakerOn(!isSpeakerOn)}
            accessibilityLabel={isSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
          >
            <Icon name="volume-2" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
            accessibilityLabel="End call"
          >
            <Icon name="phone-off" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCallText: {
    color: '#ffffff',
    fontSize: 18,
  },
  remoteVideoContainer: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 16,
  },
  videoSimulation: {
    width: 256,
    height: 192,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
  },
  audioCallContainer: {
    alignItems: 'center',
  },
  userName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  callStatus: {
    color: '#d1d5db',
    fontSize: 16,
    marginTop: 8,
  },
  callType: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  localVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 120,
    height: 160,
    backgroundColor: '#374151',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  localVideoPlaceholder: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideoText: {
    color: '#ffffff',
    fontSize: 14,
  },
  localVideoAvatar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    padding: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonInactive: {
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
  },
  controlButtonActive: {
    backgroundColor: '#ef4444',
  },
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
});