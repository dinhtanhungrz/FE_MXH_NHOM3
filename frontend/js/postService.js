const PostService = {
    getNewsFeed(page = 0, size = 10) {
        return axios.get(`/api/posts?page=${page}&size=${size}`);
    },
    createPost(content, imageFile) {
        const formData = new FormData();
        formData.append("content", content);
        if (imageFile) formData.append("image", imageFile);
        return axios.post("/api/posts", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },
    toggleLike(postId) {
        return axios.post(`/api/posts/${postId}/like`);
    },
    getComments(postId) {
        return axios.get(`/api/posts/${postId}/comments`);
    },
    addComment(postId, content) {
        return axios.post(`/api/posts/${postId}/comments`, { content });
    },
    deletePost(postId) {
        return axios.delete(`/api/posts/${postId}`);
    }
};