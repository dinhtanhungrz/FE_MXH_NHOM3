import { apiClient } from "../core/api/apiClient.js";
import { APP_CONFIG } from "../core/config/app.config.js";
import authState from "../state/authState.js";

/**
 * Authentication Service
 * Xử lý tất cả các API calls liên quan đến authentication
 */

/**
 * Login
 * @param {string} username - Username hoặc email
 * @param {string} password - Password
 * @returns {Promise<Object>} User data và tokens
 */
export const login = async (username, password) => {
  const response = await apiClient.post(APP_CONFIG.API_ENDPOINTS.AUTH.LOGIN, {
    username,
    password,
  });
  return response;
};

/**
 * Register
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>}
 */
export const register = async (userData) => {
  const response = await apiClient.post(APP_CONFIG.API_ENDPOINTS.AUTH.REGISTER, userData);
  return response;
};

/**
 * Logout
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const refresh_token = authState.getRefreshToken();
    if (refresh_token) {
      await apiClient.post(APP_CONFIG.API_ENDPOINTS.AUTH.LOGOUT, {
        refreshToken: refresh_token,
      });
    } else {
      await apiClient.post(APP_CONFIG.API_ENDPOINTS.AUTH.LOGOUT);
    }
  } catch (error) {
    // Even if API fails, we still clear local auth
    console.error("Logout API error:", error);
  }
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New tokens
 */
export const refreshToken = async (refreshToken) => {
  const response = await apiClient.post(APP_CONFIG.API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
    refreshToken,
  });
  return response;
};

/**
 * Get current user info
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get(APP_CONFIG.API_ENDPOINTS.USER.ME);
  return response;
};

export default {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
};
