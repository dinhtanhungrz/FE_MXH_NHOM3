// Use axios from global scope (loaded from CDN in index.html)
import { APP_CONFIG } from "../config/app.config.js";
import { authState } from "../../state/authState.js";

/**
 * API Client using Axios
 * Hỗ trợ interceptor để xử lý authentication và token refresh
 */

// Create axios instance with base config
const apiClient = window.axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track token refresh state
let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Subscribe to token refresh
 * @param {Function} callback - Callback khi token được refresh
 */
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

/**
 * Notify all subscribers when token is refreshed
 * @param {string} token - New access token
 */
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Request Interceptor: Thêm access token vào header
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = authState.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor: Xử lý response và handle 401 errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Trả về data từ response
    return response.data;
  },
  async (error) => {
    const originalConfig = error.config;

    // Nếu là 401 và không phải request login/refresh-token
    if (
      error.response?.status === 401 &&
      originalConfig &&
      !originalConfig.url.includes("/auth/login") &&
      !originalConfig.url.includes("/auth/refresh-token") &&
      !originalConfig._retry
    ) {
      // Nếu đang refresh token, chờ và retry
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalConfig.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalConfig));
          });
        });
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = authState.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Gọi refresh token API
        const response = await window.axios.post(
          `${APP_CONFIG.API_BASE_URL}${APP_CONFIG.API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const newAccessToken = response.data.data.accessToken || response.data.data.access_token;

        // Update token trong state
        authState.setAccessToken(newAccessToken);

        // Update authorization header
        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;

        // Notify subscribers
        onTokenRefreshed(newAccessToken);
        isRefreshing = false;

        // Retry original request
        return apiClient(originalConfig);
      } catch (refreshError) {
        isRefreshing = false;

        // Clear auth state và redirect to login
        authState.clear();
        window.location.hash = "#/login";

        return Promise.reject(refreshError);
      }
    }

    // Nếu là lỗi từ server, throw error
    if (error.response) {
      const customError = new Error(error.response.data?.message || "Request failed");
      customError.status = error.response.status;
      customError.response = error.response;
      return Promise.reject(customError);
    }

    // Network error hoặc timeout
    return Promise.reject(error);
  },
);

export { apiClient };
export default apiClient;
