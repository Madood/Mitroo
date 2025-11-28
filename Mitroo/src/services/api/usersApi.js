import apiClient from './apiClient';

// =============================================
// USERS API FUNCTIONS
// =============================================

/**
 * Get all users (for contacts/search)
 */
export const getUsers = async (searchQuery = '') => {
  try {
    const params = searchQuery ? { search: searchQuery } : {};
    const response = await apiClient.get('/users', { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch users'
    );
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch user'
    );
  }
};