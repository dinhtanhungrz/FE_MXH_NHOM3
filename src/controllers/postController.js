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
const getNewsFeed = async (page = 0, size = 10) => {
    try {
        const response = await fetch(`/api/statuses/newsfeed?page=${page}&size=${size}`, {
            headers: {
                Authorization: `Bearer ${authState.getToken()}`
            }
        });
        if (!response.ok) throw new Error("Failed to fetch newsfeed");
        const result = await response.json();
        return result.data.content; // Assuming `content` contains the posts
    } catch (error) {
        console.error("Error fetching newsfeed:", error);
        throw error;
    }
};


export default {
  createNewPost,
  getProfilePosts,
  getUserStatuses,
  getNewsFeed};
