// services/authApi.js
import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// =============================================
// AUTHENTICATION API FUNCTIONS
// =============================================

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  try {
    console.log('📝 Registering user with data:', userData);
    
    const response = await apiClient.post('/auth/register', userData);
    
    if (response.success) {
      const { token, user } = response.data;
      await AsyncStorage.multiSet([
        ['authToken', token],
        ['userData', JSON.stringify(user)]
      ]);
      console.log('✅ User registered successfully:', user.email);
    }
    
    return response;
  } catch (error) {
    console.log('❌ Registration failed:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Login user
 */
export const loginUser = async (credentials) => {
  try {
    console.log('🔐 Logging in user:', credentials.email);
    
    const response = await apiClient.post('/auth/login', credentials);
    
    if (response.success) {
      const { token, user } = response.data;
      await AsyncStorage.multiSet([
        ['authToken', token],
        ['userData', JSON.stringify(user)]
      ]);
      console.log('✅ User logged in successfully:', user.email);
    }
    
    return response;
  } catch (error) {
    console.log('❌ Login failed:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response;
  } catch (error) {
    throw new Error(
      error.message || 'Failed to fetch user profile'
    );
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/auth/profile', profileData);
    
    if (response.success) {
      const { user } = response.data;
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    }
    
    return response;
  } catch (error) {
    throw new Error(
      error.message || 'Failed to update profile'
    );
  }
};

/**
 * Change user password
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return response;
  } catch (error) {
    throw new Error(
      error.message || 'Failed to change password'
    );
  }
};

/**
 * Verify token validity
 */
export const verifyToken = async () => {
  try {
    const response = await apiClient.get('/auth/verify');
    return response;
  } catch (error) {
    throw new Error(
      error.message || 'Token verification failed'
    );
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await AsyncStorage.multiRemove(['authToken', 'userData']);
  } catch (error) {
    console.log('Logout error:', error);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const userData = await AsyncStorage.getItem('userData');
    return !!(token && userData);
  } catch {
    return false;
  }
};

/**
 * Get stored user data
 */
export const getStoredUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

/**
 * Get auth token
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch {
    return null;
  }
};