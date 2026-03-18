import * as postService from "../services/postService.js";
import { showToast } from "../core/utils/helpers.js";

/**
 * Post Controller
 * Xử lý business logic cho post operations
 */

/**
 * Create new post
 * @param {string} content - Post content
 * @param {string} visibility - Post visibility
 * @param {FileList|File[]} images - Post images
 * @returns {Promise<boolean>} Success status
 */
export const createNewPost = async (content, visibility, images) => {
  try {
    // Validation
    if (!content || content.trim().length === 0) {
      showToast("Vui lòng nhập nội dung bài viết", "error");
      return false;
    }

    if (content.trim().length > 5000) {
      showToast("Nội dung không được vượt quá 5000 ký tự", "error");
      return false;
    }

    // Create post with service
    const newPost = await postService.createPost(content, visibility, images);

    showToast("Đăng bài viết thành công!", "success");
    return newPost;
  } catch (error) {
    console.error("Create post error:", error);
    showToast(error.message || "Đăng bài viết thất bại", "error");
    return false;
  }
};

/**
 * Update post — content, visibility, thêm/xóa ảnh
 * @param {number} statusId
 * @param {Object} payload - { content?, visibility?, deleteImageIds?, newImages? }
 * @returns {Promise<boolean>}
 */
export const updatePost = async (statusId, payload) => {
  try {
    // Validate: phải có ít nhất 1 thay đổi
    const hasChange =
      payload.content !== undefined ||
      payload.visibility !== undefined ||
      (payload.deleteImageIds && payload.deleteImageIds.length > 0) ||
      (payload.newImages && payload.newImages.length > 0);

    if (!hasChange) {
      showToast("Không có thay đổi nào để lưu", "error");
      return false;
    }

    // Validate content nếu có
    if (payload.content !== undefined && payload.content.trim().length > 3000) {
      showToast("Nội dung không được vượt quá 3000 ký tự", "error");
      return false;
    }

    await postService.updatePost(statusId, payload);
    showToast("Cập nhật bài viết thành công!", "success");
    return true;
  } catch (error) {
    showToast(error.message || "Cập nhật bài viết thất bại", "error");
    return false;
  }
};

export const deletePost = async (statusId) => {
  try {
    await postService.deletePost(statusId);
    showToast("Đã xóa bài viết", "success");
    return true;
  } catch (error) {
    showToast(error.message || "Xóa bài viết thất bại", "error");
    return false;
  }
};

export const getProfilePosts = async () => {
  try {
    const posts = await postService.getProfilePosts();
    return posts;
  } catch (error) {
    console.error("Get profile posts error:", error);
    showToast(error.message || "Lấy bài viết thất bại", "error");
    return [];
  }
};

export const getUserStatuses = async (userId) => {
  try {
    const posts = await postService.getUserPosts(userId);
    return posts;
  } catch (error) {
    console.error("Get user posts error:", error);
    showToast(error.message || "Lấy bài viết thất bại", "error");
    return [];
  }
};

export const getNewFeedsPublicAndFriends = async () => {
  try {
    const posts = await postService.getNewFeedsPublicAndFriends();
    return posts;
  } catch (error) {
    console.error("Get feed statuses error:", error);
    showToast(error.message || "Lấy bài viết thất bại", "error");
    return [];
  }
};

export default {
  createNewPost,
  updatePost,
  deletePost,
  getProfilePosts,
  getUserStatuses,
  getNewFeedsPublicAndFriends,
};
