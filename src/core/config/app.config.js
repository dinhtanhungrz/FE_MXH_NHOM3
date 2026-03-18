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
      BASE: "/users",
      ME: "/users/me",
      PROFILE: "/users/profile",
      AVATAR: "/users/update-avatar",
      PASSWORD: "/users/password",
      BLOCK: "/users/block",
      FRIEND_REQUEST: "/users/friend-request/", // + userId
      CANCEL_REQUEST: "/users/cancel-request/", // + userId
      ACCEPT_REQUEST: "/users/friend-request/accept/", // + userId
      REJECT_REQUEST: "/users/friend-request/reject/", // + userId
      UNFRIEND: "/users/unfriend/", // + userId
    },

    FRIEND: {
      // LIST: "/users/friends",
      COMMON: "/friends/common/:targetId",
    },

    POST: {
      BASE: "/statuses",
      PROFILE: "/statuses/profile",
      USER: "/statuses/user/", // + userId
    },
    COMMENT: {
      BASE: "/comments",
      STATUS: "/comments/status/", // + statusId
    },
    // Like endpoints
    LIKE: {
      BASE: "/status-like",
      STATUS: "/status-like/:statusId",
    },
    // User statistics endpoints
    STATISTICS: {
      NEW_USERS: "/statistics/new-users", // + ?type=WEEK|MONTH|YEAR
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
