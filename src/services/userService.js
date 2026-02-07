import { apiClient } from "../core/api/apiClient.js";
import { APP_CONFIG } from "../core/config/app.config.js";
import { replaceUrlParams } from "../core/utils/helpers.js";

/**
 * User Service
 * Xử lý tất cả các API calls liên quan đến user
 */

/**
 * Get current user info
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get(APP_CONFIG.API_ENDPOINTS.USER.ME);
  return response.data;
};

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
  const url = replaceUrlParams(APP_CONFIG.API_ENDPOINTS.USER.PROFILE, { id: userId });
  const response = await apiClient.get(url);
  return response;
};

/**
 * Update current user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (userData) => {
  const response = await apiClient.put(APP_CONFIG.API_ENDPOINTS.USER.PROFILE, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

/**
 * Upload avatar
 * @param {File} file - Avatar file
 * @returns {Promise<Object>}
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiClient.post(APP_CONFIG.API_ENDPOINTS.USER.AVATAR, formData);
  return response;
};

/**
 * Get all users (Admin only)
 * @returns {Promise<Array>} Array of all users
 */
export const getAllUsers = async () => {
  const response = await apiClient.get(APP_CONFIG.API_ENDPOINTS.USER.BASE);
  return response.data;
};

/**
 * Update user password
 * @param {string} currentPassword - current password
 * @param {string} password - New password
 * @param {string} confirmPassword - Confirm new password
 * @returns {Promise<Object>} Update response
 */
export const updatePassword = async (currentPassword, password, confirmPassword) => {
  const data = { currentPassword, password, confirmPassword };
  const response = await apiClient.put(APP_CONFIG.API_ENDPOINTS.USER.PASSWORD, data);
  return response;
};

/**
 * Block user (Admin only)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Update response
 */
export const blockUser = async (userId) => {
  const response = await apiClient.patch(APP_CONFIG.API_ENDPOINTS.USER.BLOCK + `/${userId}`);
  return response;
};

export default {
  getCurrentUser,
  getUserProfile,
  updateProfile,
  uploadAvatar,
  getAllUsers,
  updatePassword,
  blockUser,
};
