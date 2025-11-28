import apiClient from './apiClient';

// =============================================
// CONVERSATIONS API FUNCTIONS
// =============================================

/**
 * Get all conversations for current user
 */
export const getConversations = async () => {
  try {
    const response = await apiClient.get('/conversations');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch conversations'
    );
  }
};

/**
 * Get conversation by ID
 */
export const getConversation = async (conversationId) => {
  try {
    const response = await apiClient.get(`/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch conversation'
    );
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (conversationData) => {
  try {
    const response = await apiClient.post('/conversations', conversationData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to create conversation'
    );
  }
};

/**
 * Update conversation
 */
export const updateConversation = async (conversationId, updateData) => {
  try {
    const response = await apiClient.put(`/conversations/${conversationId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update conversation'
    );
  }
};

/**
 * Delete conversation
 */
export const deleteConversation = async (conversationId) => {
  try {
    const response = await apiClient.delete(`/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to delete conversation'
    );
  }
};