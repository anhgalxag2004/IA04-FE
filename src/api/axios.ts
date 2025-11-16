import axios from "axios";

declare global {
  interface Window {
    __accessToken?: string | null;
  }
}

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    // Get accessToken from AuthContext
    // Because hooks can't be used here, read it from window (temporary solution)
    const accessToken = window.__accessToken;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      // Lấy refreshToken từ localStorage
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/user/refresh`,
            { refreshToken }
          );
          const { accessToken } = res.data;
          // Store accessToken on window (temporary solution)
          window.__accessToken = accessToken;
          // Gắn lại accessToken vào header và retry request
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout and redirect to login
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("email");
          window.__accessToken = null;
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
