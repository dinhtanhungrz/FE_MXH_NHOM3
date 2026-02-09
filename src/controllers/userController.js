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

/**
 *  Get All Users (Admin only)
 *
 */
export const getAllUsers = async () => {
  try {
    const users = await userService.getAllUsers();
    return users;
  } catch (error) {
    console.error("Get all users error:", error);
    showToast("Không thể tải danh sách người dùng", "error");
    return [];
  }
};

/**
 * Update user password
 * @param {string} currentPassword - Old password
 * @param {string} password - New password
 * @param {string} confirmPassword - Confirm new password
 * @returns {Promise<boolean>} Success status
 */
export const updatePassword = async (currentPassword, password, confirmPassword) => {
  try {
    await userService.updatePassword(currentPassword, password, confirmPassword);
    return true;
  } catch (error) {
    console.error("Update password error:", error);
    showToast(error.message || "Cập nhật mật khẩu thất bại", "error");
    return false;
  }
};

/**
 * Block user (Admin only)
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const blockUser = async (userId) => {
  await userService.blockUser(userId);
  return true;
};

/**
 * Send friend request
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const sendFriendRequest = async (userId) => {
  console.log("Chạy");

  try {
    await userService.sendFriendRequest(userId);
    showToast("Đã gửi lời mời kết bạn", "success");
    return true;
  } catch (error) {
    console.error("Send friend request error:", error);
    showToast(error.message || "Gửi lời mời thất bại", "error");
    return false;
  }
};

// /**
//  * Cancel friend request
//  * @param {string} userId - User ID
//  * @returns {Promise<boolean>} Success status
//  */
// export const cancelFriendRequest = async (userId) => {
//   try {
//     await userService.cancelFriendRequest(userId);
//     showToast("Đã hủy lời mời kết bạn", "success");
//     return true;
//   } catch (error) {
//     console.error("Cancel friend request error:", error);
//     showToast(error.message || "Hủy lời mời thất bại", "error");
//     return false;
//   }
// };

// /**
//  * Accept friend request
//  * @param {string} userId - User ID
//  * @returns {Promise<boolean>} Success status
//  */
// export const acceptFriendRequest = async (userId) => {
//   try {
//     await userService.acceptFriendRequest(userId);
//     showToast("Đã chấp nhận lời mời kết bạn", "success");
//     return true;
//   } catch (error) {
//     console.error("Accept friend request error:", error);
//     showToast(error.message || "Chấp nhận lời mời thất bại", "error");
//     return false;
//   }
// };

// /**
//  * Reject friend request
//  * @param {string} userId - User ID
//  * @returns {Promise<boolean>} Success status
//  */
// export const rejectFriendRequest = async (userId) => {
//   try {
//     await userService.rejectFriendRequest(userId);
//     showToast("Đã từ chối lời mời kết bạn", "success");
//     return true;
//   } catch (error) {
//     console.error("Reject friend request error:", error);
//     showToast(error.message || "Từ chối lời mời thất bại", "error");
//     return false;
//   }
// };

// /**
//  * Remove friend
//  * @param {string} userId - User ID
//  * @returns {Promise<boolean>} Success status
//  */
// export const removeFriend = async (userId) => {
//   try {
//     await userService.removeFriend(userId);
//     showToast("Đã xóa bạn bè", "success");
//     return true;
//   } catch (error) {
//     console.error("Remove friend error:", error);
//     showToast(error.message || "Xóa bạn bè thất bại", "error");
//     return false;
//   }
// };

export default {
  loadCurrentUser,
  loadUserProfile,
  updateUserProfile,
  uploadUserAvatar,
  getUser,
  getAllUsers,
  updatePassword,
  blockUser,
  sendFriendRequest,
  // cancelFriendRequest,
  // acceptFriendRequest,
  // rejectFriendRequest,
  // removeFriend,
  // getFriendStatus,
};
