import { postService } from "../services/postService.js";
import { postState } from "../state/postState.js";

export const postController = {

  async loadPosts() {
    try {
      const posts = await postService.getList();
      postState.setPosts(posts);
      return posts;
    } catch (error) {
      console.error("Load posts failed:", error);
      throw error;
    }
  },

  async createPost(payload) {
    try {
      const newPost = await postService.create(payload);
      postState.addPost(newPost);
      return newPost;
    } catch (error) {
      console.error("Create post failed:", error);
      throw error;
    }
  },

  async deletePost(postId) {
    try {
      await postService.delete(postId);
      postState.removePost(postId);
    } catch (error) {
      console.error("Delete post failed:", error);
      throw error;
    }
  }

};