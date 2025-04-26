import axios from 'axios';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,  // Set timeout if necessary
  headers: {
    'Content-Type': 'application/json',
    // You can add additional headers like authentication tokens here if needed
  },
});

export default axiosInstance;
