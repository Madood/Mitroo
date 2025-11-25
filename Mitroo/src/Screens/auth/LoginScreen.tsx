import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useStore } from '../../store/useStore';

interface LoginScreenProps {
  onSwitchToSignup?: () => void;
}

export function LoginScreen({ onSwitchToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useStore(state => state.login);
  const setCurrentView = useStore(state => state.setCurrentView);
  
  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        setCurrentView('conversations');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="mail" size={32} color="#ffffff" />
          </View>
          <Text style={styles.title}>Welcome to Mitroo</Text>
          <Text style={styles.subtitle}>Sign in to start messaging</Text>
        </View>
        
        <View style={styles.form}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Icon name="mail" size={20} color="#9ca3af" style={styles.icon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock" size={20} color="#9ca3af" style={styles.icon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.buttonText}>Signing in...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity onPress={onSwitchToSignup}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.demoContainer}>
          <Text style={styles.demoText}>Demo: Use any email with any password</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    padding: 32,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#3b82f6',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    gap: 16,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  icon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 16,
  },
  demoContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  demoText: {
    color: '#6b7280',
    fontSize: 14,
  },
});