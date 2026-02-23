const state = {
  posts: [],
};

export const postState = {
  getPosts() {
    return state.posts;
  },

  setPosts(posts) {
    state.posts = posts || [];
  },

  addPost(post) {
    if (!post) return;
    state.posts.unshift(post);
  },

  removePost(postId) {
    state.posts = state.posts.filter(p => p.id !== postId);
  },

  clear() {
    state.posts = [];
  }
};