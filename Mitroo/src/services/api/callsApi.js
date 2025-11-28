import apiClient from './apiClient';

// =============================================
// CALLS API FUNCTIONS
// =============================================

/**
 * Initiate a call
 */
export const initiateCall = async (callData) => {
  try {
    const response = await apiClient.post('/calls/initiate', callData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to initiate call'
    );
  }
};

/**
 * Accept a call
 */
export const acceptCall = async (callId) => {
  try {
    const response = await apiClient.put(`/calls/${callId}/accept`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to accept call'
    );
  }
};

/**
 * End a call
 */
export const endCall = async (callId) => {
  try {
    const response = await apiClient.put(`/calls/${callId}/end`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to end call'
    );
  }
};

/**
 * Get call history
 */
export const getCallHistory = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get('/calls/history', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch call history'
    );
  }
};
