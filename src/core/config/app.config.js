// Application configuration
export const APP_CONFIG = {
  // API Base URL
  API_BASE_URL: "http://localhost:8080/api",

  // API Endpoints
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REFRESH_TOKEN: "/auth/refresh-token",
      REGISTER: "/auth/register",
    },

    USER: {
      ME: "/users/me",
      PROFILE: "/users/profile",
    },
  },

  // Storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    USER_INFO: "user_info",
  },

  // Default route
  DEFAULT_ROUTE: "#/",
  LOGIN_ROUTE: "#/login",
  PROFILE_ROUTE: "#/profile",

  // Request timeout
  TIMEOUT: 30000, // 30 seconds
};

export default APP_CONFIG;
