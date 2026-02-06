# Hướng dẫn mở rộng tính năng

## 📝 Ví dụ: Thêm tính năng Posts (Bài viết)

### Bước 1: Tạo Post Service

```javascript
// src/services/postService.js
import { apiClient } from '../core/api/apiClient.js';
import { postEndpoints } from '../core/api/endpoints.js';

export const getPosts = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${postEndpoints.list()}${queryString ? '?' + queryString : ''}`;
    return await apiClient.get(url);
};

export const createPost = async (postData) => {
    return await apiClient.post(postEndpoints.create(), postData);
};

export const getPost = async (postId) => {
    return await apiClient.get(postEndpoints.detail(postId));
};

export const updatePost = async (postId, postData) => {
    return await apiClient.put(postEndpoints.update(postId), postData);
};

export const deletePost = async (postId) => {
    return await apiClient.delete(postEndpoints.delete(postId));
};

export default {
    getPosts,
    createPost,
    getPost,
    updatePost,
    deletePost,
};
```

### Bước 2: Tạo Post Controller

```javascript
// src/controllers/postController.js
import * as postService from '../services/postService.js';
import { showToast } from '../core/utils/helpers.js';

export const loadPosts = async (params) => {
    try {
        const posts = await postService.getPosts(params);
        return posts;
    } catch (error) {
        console.error('Load posts error:', error);
        showToast('Không thể tải bài viết', 'error');
        return [];
    }
};

export const createNewPost = async (postData) => {
    try {
        const post = await postService.createPost(postData);
        showToast('Đăng bài thành công!', 'success');
        return post;
    } catch (error) {
        console.error('Create post error:', error);
        showToast(error.message || 'Đăng bài thất bại', 'error');
        return null;
    }
};

export const removePost = async (postId) => {
    try {
        await postService.deletePost(postId);
        showToast('Đã xóa bài viết', 'success');
        return true;
    } catch (error) {
        console.error('Delete post error:', error);
        showToast('Xóa bài viết thất bại', 'error');
        return false;
    }
};

export default {
    loadPosts,
    createNewPost,
    removePost,
};
```

### Bước 3: Tạo Post View Components

```javascript
// src/views/components/PostCard.js
import { formatRelativeTime } from '../../core/utils/helpers.js';
import { renderAvatar } from '../viewHelpers.js';

export const PostCard = (post) => {
    return `
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <!-- Post Header -->
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                    ${renderAvatar(post.author, 'w-12 h-12')}
                    <div>
                        <p class="font-semibold text-gray-900">${post.author.name}</p>
                        <p class="text-sm text-gray-500">${formatRelativeTime(post.createdAt)}</p>
                    </div>
                </div>
                <button class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                </button>
            </div>

            <!-- Post Content -->
            <p class="text-gray-800 mb-4">${post.content}</p>

            ${post.images && post.images.length > 0 ? `
                <img src="${post.images[0]}" alt="Post image" class="w-full rounded-lg mb-4" />
            ` : ''}

            <!-- Post Stats -->
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>${post.likesCount || 0} lượt thích</span>
                <span>${post.commentsCount || 0} bình luận</span>
            </div>

            <!-- Post Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <button 
                    onclick="handleLikePost('${post.id}')"
                    class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                    </svg>
                    <span class="font-medium">Thích</span>
                </button>
                <button 
                    onclick="handleCommentPost('${post.id}')"
                    class="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition px-4 py-2 rounded-lg hover:bg-green-50"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span class="font-medium">Bình luận</span>
                </button>
                <button class="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition px-4 py-2 rounded-lg hover:bg-purple-50">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                    <span class="font-medium">Chia sẻ</span>
                </button>
            </div>
        </div>
    `;
};

export default PostCard;
```

### Bước 4: Tạo Feed Page

```javascript
// src/views/pages/FeedPage.js
import { Layout } from '../components/Layout.js';
import { PostCard } from '../components/PostCard.js';
import * as postController from '../../controllers/postController.js';
import { showLoading, hideLoading } from '../../core/utils/helpers.js';
import { renderEmpty } from '../viewHelpers.js';

export const FeedPage = async () => {
    showLoading();
    
    const posts = await postController.loadPosts();
    
    hideLoading();

    const content = `
        <div class="max-w-2xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">Bảng tin</h1>
            
            ${posts.length > 0 
                ? posts.map(post => PostCard(post)).join('') 
                : renderEmpty('Chưa có bài viết nào')
            }
        </div>
    `;

    return Layout(content);
};

export default FeedPage;
```

### Bước 5: Đăng ký Route

```javascript
// src/app.js
import { FeedPage } from './views/pages/FeedPage.js';

router.addRoute('/feed', FeedPage, {
    title: 'Bảng tin - Social Network',
    requiresAuth: true,
});
```

---

## 📝 Ví dụ: Thêm tính năng Comments

### 1. Service Layer

```javascript
// src/services/commentService.js
import { apiClient } from '../core/api/apiClient.js';
import { commentEndpoints } from '../core/api/endpoints.js';

export const getComments = async (postId) => {
    return await apiClient.get(commentEndpoints.list(postId));
};

export const addComment = async (postId, content) => {
    return await apiClient.post(commentEndpoints.create(postId), { content });
};

export const deleteComment = async (commentId) => {
    return await apiClient.delete(commentEndpoints.delete(commentId));
};
```

### 2. Controller Layer

```javascript
// src/controllers/commentController.js
import * as commentService from '../services/commentService.js';
import { showToast } from '../core/utils/helpers.js';

export const loadComments = async (postId) => {
    try {
        return await commentService.getComments(postId);
    } catch (error) {
        showToast('Không thể tải bình luận', 'error');
        return [];
    }
};

export const createComment = async (postId, content) => {
    try {
        const comment = await commentService.addComment(postId, content);
        showToast('Đã bình luận', 'success');
        return comment;
    } catch (error) {
        showToast('Bình luận thất bại', 'error');
        return null;
    }
};
```

---

## 🔄 Pattern tổng quát

Khi thêm một tính năng mới, luôn tuân theo pattern:

```
1. Service Layer (src/services/)
   └─> Giao tiếp với API

2. Controller Layer (src/controllers/)
   └─> Business logic, xử lý lỗi, hiển thị toast

3. View Components (src/views/components/)
   └─> Render UI components

4. Page (src/views/pages/)
   └─> Tổng hợp components, gọi controller

5. Router (src/app.js)
   └─> Đăng ký route mới
```

## 🎯 Best Practices

1. **Separation of Concerns**: View không gọi Service trực tiếp
2. **Error Handling**: Luôn có try-catch trong Controller
3. **Loading States**: Hiển thị loading khi fetch data
4. **Toast Notifications**: Thông báo kết quả action cho user
5. **Reusable Components**: Tạo components nhỏ, tái sử dụng được
6. **Consistent Naming**: Tuân thủ naming convention
7. **Type Safety**: Document parameters và return types

## 📚 Tài liệu tham khảo

- Router API: `src/core/router/router.js`
- API Client: `src/core/api/apiClient.js`
- Helpers: `src/core/utils/helpers.js`
- View Helpers: `src/views/viewHelpers.js`
