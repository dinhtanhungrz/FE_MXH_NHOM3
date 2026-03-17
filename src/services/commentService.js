import { apiClient } from "../core/api/apiClient.js";
import { APP_CONFIG } from "../core/config/app.config.js";

/**
 * Comment Service
 * Xử lý các API liên quan đến bình luận
 */
export const getComments = async (statusId) => {
  const response = await apiClient.get(`${APP_CONFIG.API_ENDPOINTS.COMMENT.STATUS}${statusId}`);
  return response.data;
};

export const postComment = async (statusId, content, parentId = null) => {
  const response = await apiClient.post(APP_CONFIG.API_ENDPOINTS.COMMENT.BASE, {
    statusId,
    content,
    parentId,
  });
  return response.data;
};

export const updateComment = async (id, content) => {
  const response = await apiClient.put(`${APP_CONFIG.API_ENDPOINTS.COMMENT.BASE}/${id}`, {
    content,
  });
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await apiClient.delete(`${APP_CONFIG.API_ENDPOINTS.COMMENT.BASE}/${id}`);
  return response.data;
};

export default {
  getComments,
  postComment,
  updateComment,
  deleteComment,
};
