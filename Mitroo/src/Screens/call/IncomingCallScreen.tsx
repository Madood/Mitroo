import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useStore } from '../../store/useStore';

export function IncomingCallScreen() {
  const incomingCall = useStore(state => state.incomingCall);
  const acceptCall = useStore(state => state.acceptCall);
  const rejectCall = useStore(state => state.rejectCall);

  const [pulse] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true })
      ])
    ).start();
  }, []);

  if (!incomingCall) return null;

  const callerId = incomingCall.callerId;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Animated.View style={[styles.avatarWrapper, { transform: [{ scale: pulse }] }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{callerId.charAt(0).toUpperCase()}</Text>
          </View>
        </Animated.View>

        <Text style={styles.name}>{callerId}</Text>

        <Text style={styles.callType}>
          Incoming {incomingCall.type === 'video' ? 'video' : 'voice'} call...
        </Text>

        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={[styles.dot, { opacity: 0.7 }]} />
          <View style={[styles.dot, { opacity: 0.4 }]} />
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.reject} onPress={rejectCall}>
          <Icon name="phone-off" size={32} color="#fff" />
          <Text style={styles.actionText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accept} onPress={acceptCall}>
          <Icon name="phone" size={32} color="#fff" />
          <Text style={styles.actionText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40
  },

  center: {
    alignItems: 'center',
    marginTop: 40
  },

  avatarWrapper: {
    padding: 8
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center'
  },

  avatarText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold'
  },

  name: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: '600',
    color: '#fff'
  },

  callType: {
    fontSize: 18,
    color: '#cbd5e1',
    marginTop: 6
  },

  dotsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff'
  },

  actions: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  reject: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center'
  },

  accept: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center'
  },

  actionText: {
    marginTop: 6,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  }
});
