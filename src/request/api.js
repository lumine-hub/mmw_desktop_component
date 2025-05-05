import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api', // This will use the proxy defined in vite.config.js
  timeout: 10000
});

// Function to handle API response and extract data
const handleResponse = (response) => {
  if (response.status === 200) {
    if (response.data.code === 20000 || response.data.code === 40400) {
      return { data: response.data.data, userLeft: false };
    } else if (response.data.code === 404010) {
      return { data: null, userLeft: true };
    }
  }
  throw new Error(response.data.msg || 'API request failed');
};

// API service object
const healthMonitorApi = {
  // 获取人体存在状态
  getHumanExist: async (uid) => {
    try {
      const response = await api.get(`/deskcomponent/getHumanExist/uid/${uid}`);
      const result = handleResponse(response);

      if (result.userLeft) {
        return { status: null, userLeft: true };
      }

      return {
        status: result.data.status,
        userLeft: false
      };
    } catch (error) {
      console.error('Error fetching human exist status:', error);
      return { status: 4, userLeft: false }; // 默认返回"始终在"状态
    }
  },

  // 获取健康信息
  getHealthInfo: async (uid) => {
    try {
      const response = await api.get(`/deskcomponent/getHealthInfo/uid/${uid}`);
      const result = handleResponse(response);

      if (result.userLeft) {
        return { userLeft: true };
      }

      return {
        ...result.data,
        userLeft: false
      };
    } catch (error) {
      console.error('Error fetching health info:', error);
      return { userLeft: false };
    }
  }
};

export default healthMonitorApi;