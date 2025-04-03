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
  // Get heart rate data
  getHeartRate: async (uid) => {
    try {
      const response = await api.get(`/hr/getWaveform/uid/${uid}`);
      const result = handleResponse(response);
      
      if (result.userLeft) {
        return { value: null, userLeft: true };
      }
      
      // Extract the last heart rate value from the waveform array
      if (result.data.heart_waveform && result.data.heart_waveform.length > 0) {
        return { 
          value: result.data.heart_waveform[result.data.heart_waveform.length - 1], 
          userLeft: false 
        };
      }
      return { value: null, userLeft: false };
    } catch (error) {
      console.error('Error fetching heart rate:', error);
      return { value: null, userLeft: false };
    }
  },
  
  // Get arrhythmia status
  getArrhythmiaStatus: async (uid) => {
    try {
      const response = await api.get(`/arr/getWaveform/uid/${uid}`);
      const result = handleResponse(response);
      
      if (result.userLeft) {
        return { value: false, userLeft: true };
      }
      
      // Convert numeric value to boolean
      // 0 = false, 1 = true, -1 = noise (we'll treat noise as false for simplicity)
      return { 
        value: result.data.isArrhythmia === 1, 
        userLeft: false 
      };
    } catch (error) {
      console.error('Error fetching arrhythmia status:', error);
      return { value: false, userLeft: false };
    }
  },
  
  // Get body status
  getBodyStatus: async (uid) => {
    try {
      const response = await api.get(`/humov/getStatus/uid/${uid}`);
      const result = handleResponse(response);
      
      if (result.userLeft) {
        return { 
          status: 'User Left', 
          isWarning: false, 
          warningInfo: 'User has left the monitoring area',
          warningId: null,
          userLeft: true 
        };
      }
      
      // Map the status code to a readable string
      let statusText = 'Unknown';
      switch (result.data.status) {
        case 1:
          statusText = 'Side Lying';
          break;
        case 2:
          statusText = 'Supine';
          break;
        case 3:
          statusText = 'In Bed';
          break;
        case 4:
          statusText = 'Out of Bed';
          break;
        default:
          statusText = 'Unknown';
      }
      
      return {
        status: statusText,
        isWarning: result.data.isWarning,
        warningInfo: result.data.waringInfo,
        warningId: result.data.WarningId,
        userLeft: false
      };
    } catch (error) {
      console.error('Error fetching body status:', error);
      return {
        status: 'Unknown',
        isWarning: false,
        warningInfo: '',
        warningId: null,
        userLeft: false
      };
    }
  },
  
  // Get breathing status
  getBreathingStatus: async (uid) => {
    try {
      const response = await api.get(`/br/getWarning/uid/${uid}`);
      const result = handleResponse(response);
      
      if (result.userLeft) {
        return { 
          status: 'User Left', 
          isInBed: false,
          userLeft: true 
        };
      }
      
      let breathingStatus = 'Normal';
      if (result.data.breath_warning_id === 21) {
        breathingStatus = 'Apnea';
      } else if (result.data.breath_warning_id === 22) {
        breathingStatus = 'COPD';
      }
      
      return {
        status: breathingStatus,
        isInBed: result.data.is_in_bed,
        userLeft: false
      };
    } catch (error) {
      console.error('Error fetching breathing status:', error);
      return {
        status: 'Normal',
        isInBed: false,
        userLeft: false
      };
    }
  }
};

export default healthMonitorApi;