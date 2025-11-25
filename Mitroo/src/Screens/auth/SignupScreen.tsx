import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useStore } from '../../store/useStore';

type SignupStep = 'register' | 'verify';

interface SignupScreenProps {
  onSwitchToLogin?: () => void;
}

export function SignupScreen({ onSwitchToLogin }: SignupScreenProps) {
  const [step, setStep] = useState<SignupStep>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const signup = useStore(state => state.signup);
  const setCurrentView = useStore(state => state.setCurrentView);
  
  const handleRegister = async () => {
    setError('');
    
    // Validation
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await signup(email, password, name);
      if (success) {
        setStep('verify');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerification = async () => {
    setError('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demo purposes, any 6-digit code works
      // In a real app, you'd verify against the backend
      setCurrentView('conversations');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  const handleResendCode = () => {
    setError('');
    Alert.alert('Success', 'Verification code resent!');
  };

  const handleVerificationCodeChange = (text: string) => {
    // Only allow numbers and limit to 6 digits
    const numbersOnly = text.replace(/[^0-9]/g, '');
    setVerificationCode(numbersOnly.slice(0, 6));
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        {step === 'register' ? (
          <>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Icon name="user" size={32} color="#ffffff" />
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join Mitroo to start messaging</Text>
            </View>
            
            <View style={styles.form}>
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="user" size={20} color="#9ca3af" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="John Doe"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>
              
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
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="lock" size={20} color="#9ca3af" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
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
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={styles.buttonText}>Creating Account...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={styles.linkText}>Already have an account? Sign in</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setStep('register')}
              style={styles.backButton}
            >
              <Icon name="arrow-left" size={16} color="#6b7280" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Icon name="mail" size={32} color="#ffffff" />
              </View>
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a verification code to{'\n'}
                <Text style={styles.emailText}>{email}</Text>
              </Text>
            </View>
            
            <View style={styles.form}>
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Verification Code</Text>
                <TextInput
                  style={styles.verificationInput}
                  value={verificationCode}
                  onChangeText={handleVerificationCodeChange}
                  placeholder="123456"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  maxLength={6}
                  textAlign="center"
                />
              </View>
              
              <TouchableOpacity
                style={[styles.button, (isLoading || verificationCode.length !== 6) && styles.buttonDisabled]}
                onPress={handleVerification}
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={styles.buttonText}>Verifying...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Verify Email</Text>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={styles.linkText}>Didn't receive the code? Resend</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.demoContainer}>
              <Text style={styles.demoText}>Demo: Use any 6-digit code (e.g., 123456)</Text>
            </View>
          </>
        )}
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
    backgroundColor: '#8b5cf6',
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  emailText: {
    fontWeight: '600',
    color: '#374151',
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
    textAlign: 'center',
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
  verificationInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '600',
    letterSpacing: 8,
  },
  button: {
    backgroundColor: '#8b5cf6',
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
    color: '#8b5cf6',
    fontSize: 16,
  },
  demoContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  demoText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 16,
  },
});