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
export default {
  createNewPost,
};
