// services/apiClient.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// =============================================
// API CLIENT WITH PROPER HTTP METHODS
// =============================================
const API_BASE_URL = 'http://192.168.100.12:5000/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = options.method || 'GET';
    
    console.log(`🌐 Making ${method} request to: ${url}`);
    
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const config = {
        method: method,
        headers: headers,
      };

      // Only add body for methods that support it (not GET or HEAD)
      if (options.body && method !== 'GET' && method !== 'HEAD') {
        config.body = options.body;
      }

      console.log(`📦 Request config:`, { method, url, body: options.body });

      const response = await fetch(url, config);

      console.log(`📨 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ Error response:`, errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Success:`, data);
      return data;

    } catch (error) {
      console.log('❌ API Request failed:', error.message);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient();
export default apiClient;