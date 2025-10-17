// import axios from 'axios';

// // Create an axios instance
// const api = axios.create({
//   baseURL: 'http://localhost:5000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add request interceptor for auth tokens if needed
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    // Try to get user token from localStorage
    const userToken = localStorage.getItem('userToken') || localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    // Use user token if available, otherwise admin token
    const token = userToken || adminToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed. Please login again.');
      // Optional: Redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;