import * as userService from "../services/userService.js";
import { authState } from "../state/authState.js";
import { showToast } from "../core/utils/helpers.js";

/**
 * User Controller
 * Xử lý business logic cho user operations
 */

/**
 * Load current user profile
 * @returns {Promise<Object|null>} User data
 */
export const loadCurrentUser = async () => {
  try {
    const userData = await userService.getCurrentUser();

    // Update auth state với user info
    authState.setUser(userData);

    return userData;
  } catch (error) {
    console.error("Load user error:", error);
    showToast("Không thể tải thông tin người dùng", "error");
    return null;
  }
};

/**
 * Load user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User profile data
 */
export const loadUserProfile = async (userId) => {
  try {
    const userData = await userService.getUserProfile(userId);
    return userData;
  } catch (error) {
    console.error("Load user profile error:", error);
    showToast("Không thể tải thông tin người dùng", "error");
    return null;
  }
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<boolean>} Success status
 */
export const updateUserProfile = async (userData) => {
  try {
    const updatedUser = await userService.updateProfile(userData);

    // Update auth state
    authState.setUser(updatedUser);

    showToast("Cập nhật thông tin thành công!", "success");
    return true;
  } catch (error) {
    console.error("Update profile error:", error);
    showToast(error.message || "Cập nhật thất bại", "error");
    return false;
  }
};

/**
 * Upload user avatar
 * @param {File} file - Avatar file
 * @returns {Promise<boolean>} Success status
 */
export const uploadUserAvatar = async (file) => {
  try {
    const response = await userService.uploadAvatar(file);

    // Update user avatar in state
    const currentUser = authState.getUser();
    if (currentUser) {
      authState.setUser({
        ...currentUser,
        avatar: response.avatarUrl || response.avatar,
      });
    }

    showToast("Cập nhật ảnh đại diện thành công!", "success");
    return true;
  } catch (error) {
    console.error("Upload avatar error:", error);
    showToast(error.message || "Upload ảnh thất bại", "error");
    return false;
  }
};

/**
 * Get user from auth state
 * @returns {Object|null}
 */
export const getUser = () => {
  return authState.getUser();
};

export default {
  loadCurrentUser,
  loadUserProfile,
  updateUserProfile,
  uploadUserAvatar,
  getUser,
};
