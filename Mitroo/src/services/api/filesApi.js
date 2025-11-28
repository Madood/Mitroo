import apiClient from './apiClient';

// =============================================
// FILES API FUNCTIONS
// =============================================

/**
 * Upload a file
 */
export const uploadFile = async (file, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to upload file'
    );
  }
};