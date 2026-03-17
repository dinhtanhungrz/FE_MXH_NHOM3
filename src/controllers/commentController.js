import * as commentService from "../services/commentService.js";
import { showToast } from "../core/utils/helpers.js";

/**
 * Comment Controller
 * Xử lý business logic cho comment operations
 */

export const getComments = async (statusId) => {
  try {
    const comments = await commentService.getComments(statusId);
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    showToast("Failed to fetch comments", "error");
    return [];
  }
};

export const addComment = async (statusId, content, parentId = null) => {
  try {
    const newComment = await commentService.postComment(statusId, content, parentId);
    return newComment;
  } catch (error) {
    console.error("Error adding comment:", error);
    showToast("Failed to add comment", "error");
    return null;
  }
};

export const updateComment = async (commentId, newContent) => {
  try {
    const updatedComment = await commentService.updateComment(commentId, newContent);
    return updatedComment;
  } catch (error) {
    console.error("Error updating comment:", error);
    showToast("Failed to update comment", "error");
    return null;
  }
};

export const deleteComment = async (commentId) => {
  try {
    await commentService.deleteComment(commentId);
    showToast("Đã xóa bình luận", "success");
  } catch (error) {
    console.error("Error deleting comment:", error);
    showToast("Failed to delete comment", "error");
  }
};

export default {
  getComments,
  addComment,
  updateComment,
  deleteComment,
};
