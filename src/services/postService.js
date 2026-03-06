import { apiClient } from "../core/api/apiClient.js";
import { APP_CONFIG } from "../core/config/app.config.js";

/**
 * Post Service
 * Xử lý tất cả các API calls liên quan đến bài viết
 */

/**
 * Create a new post
 * @param {string} content - Post content
 * @param {string} visibility - Post visibility (PUBLIC, FRIENDS, PRIVATE)
 * @param {FileList|File[]} images - Images for the post
 * @returns {Promise<Object>} Created post data
 */
export const createPost = async (content, visibility, images) => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("visibility", visibility);

  // Append all images
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
  }

  const response = await apiClient.post(APP_CONFIG.API_ENDPOINTS.POST.BASE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getProfilePosts = async () => {
  const response = await apiClient.get(APP_CONFIG.API_ENDPOINTS.POST.PROFILE);
  return response.data;
};

export const getUserPosts = async (userId, params = {}) => {
  const response = await apiClient.get(APP_CONFIG.API_ENDPOINTS.POST.USER + userId, { params });
    return response;
};

export default {
  createPost,
  getProfilePosts,
  getUserPosts,
};
