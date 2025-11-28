import apiClient from './apiClient';

// =============================================
// MESSAGES API FUNCTIONS
// =============================================

/**
 * Get messages for a conversation
 */
export const getMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    const response = await apiClient.get(`/conversations/${conversationId}/messages`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch messages'
    );
  }
};

/**
 * Send a message
 */
export const sendMessage = async (messageData) => {
  try {
    const response = await apiClient.post('/messages', messageData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to send message'
    );
  }
};

/**
 * Delete a message
 */
export const deleteMessage = async (messageId) => {
  try {
    const response = await apiClient.delete(`/messages/${messageId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to delete message'
    );
  }
};