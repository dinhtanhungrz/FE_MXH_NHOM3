# SPA Social Network - Frontend Architecture

## 📋 Tổng quan

Đây là một Single Page Application (SPA) sử dụng Client-Side Rendering (CSR), được xây dựng hoàn toàn bằng vanilla JavaScript ES6+, HTML và Tailwind CSS. Kiến trúc được thiết kế để dễ dàng mở rộng thành một mạng xã hội hoàn chỉnh.

## 🏗️ Kiến trúc

### MVC Pattern cho Front-End

```
┌─────────────┐
│    View     │ ──> Render UI, không gọi API trực tiếp
└──────┬──────┘
       │
┌──────▼──────┐
│ Controller  │ ──> Xử lý logic, điều phối giữa View và Service
└──────┬──────┘
       │
┌──────▼──────┐
│  Service    │ ──> Giao tiếp với API
└──────┬──────┘
       │
┌──────▼──────┐
│   API Core  │ ──> Axios instance, interceptor
└─────────────┘
```

## 📁 Cấu trúc thư mục

```
spa-frontend/
├── index.html                 # Entry point
├── src/
│   ├── core/                  # Core layer
│   │   ├── api/
│   │   │   ├── apiClient.js   # Axios instance & interceptors
│   │   │   └── endpoints.js   # API endpoints config
│   │   ├── config/
│   │   │   └── app.config.js  # App configuration
│   │   ├── router/
│   │   │   └── router.js      # SPA Router với route guard
│   │   └── utils/
│   │       ├── storage.js     # LocalStorage wrapper
│   │       └── helpers.js     # Utility functions
│   │
│   ├── services/              # Services layer
│   │   ├── authService.js     # Authentication service
│   │   └── userService.js     # User service
│   │
│   ├── controllers/           # Controllers layer
│   │   ├── authController.js  # Auth logic
│   │   └── userController.js  # User logic
│   │
│   ├── views/                 # Views layer
│   │   ├── components/
│   │   │   ├── Header.js      # Header component
│   │   │   ├── Sidebar.js     # Sidebar component
│   │   │   └── Layout.js      # Main layout wrapper
│   │   ├── pages/
│   │   │   ├── LoginPage.js   # Login page
│   │   │   ├── ProfilePage.js # Profile page
│   │   │   └── HomePage.js    # Home page
│   │   └── viewHelpers.js     # View utilities
│   │
│   ├── state/                 # State management
│   │   └── authState.js       # Auth state (token, user info)
│   │
│   └── app.js                 # Application bootstrap
│
└── README.md
```

## 🔄 Luồng hoạt động

### 1. Application Bootstrap

```
index.html
    ↓
app.js (khởi tạo router, auth state)
    ↓
Router.init() (đăng ký routes, bắt đầu routing)
    ↓
Render trang đầu tiên
```

### 2. Authentication Flow

#### Login
```
User submit form
    ↓
LoginPage → AuthController.login()
    ↓
AuthService.login() → API
    ↓
Lưu tokens vào AuthState + LocalStorage
    ↓
Router.navigate('/profile')
```

#### Auto Refresh Token
```
API request với accessToken hết hạn
    ↓
Axios interceptor catch 401
    ↓
Gọi AuthService.refreshToken()
    ↓
Cập nhật accessToken mới
    ↓
Retry request gốc
```

#### Logout
```
User click logout
    ↓
AuthController.logout()
    ↓
Xóa tokens khỏi state + storage
    ↓
Router.navigate('/login')
```

### 3. Route Guard Flow

```
User navigate to /profile
    ↓
Router check route.requiresAuth
    ↓
AuthState.isAuthenticated()?
    ├─ Yes → Render ProfilePage
    └─ No  → Redirect to /login
```

### 4. Page Rendering Flow

```
Router match route
    ↓
Call route.component() (e.g., ProfilePage)
    ↓
Controller fetch data từ Service
    ↓
Service gọi API
    ↓
Controller truyền data cho View
    ↓
View render HTML vào #app
```

## 🚀 Chạy dự án

### Yêu cầu
- Live Server extension (VS Code) hoặc HTTP server bất kỳ
- Browser hỗ trợ ES6 Modules

### Các bước

1. Clone/download dự án
2. Mở `index.html` bằng Live Server
3. Truy cập `http://localhost:5500` (hoặc port tương ứng)

## 🔑 API Configuration

Mặc định sử dụng API demo: `https://api-test-web.agiletech.vn`

Để thay đổi API endpoint, chỉnh sửa `src/core/config/app.config.js`:

```javascript
export const API_BASE_URL = 'https://your-api.com';
```

## 📦 Tính năng đã implement

✅ SPA Router với hash-based routing  
✅ Route guard (public/private routes)  
✅ Authentication (Login/Logout)  
✅ Token management (access + refresh)  
✅ Axios interceptor tự động refresh token  
✅ Profile page với user info  
✅ Layout system (Header/Sidebar/Content)  
✅ Component-based architecture  
✅ MVC pattern  

## 🎯 Mở rộng trong tương lai

Dự án được thiết kế sẵn để mở rộng các tính năng mạng xã hội:

### Posts
```javascript
// services/postService.js
export const getPosts = () => apiClient.get('/posts');
export const createPost = (data) => apiClient.post('/posts', data);

// controllers/postController.js
// views/pages/FeedPage.js
```

### Comments
```javascript
// services/commentService.js
export const getComments = (postId) => apiClient.get(`/posts/${postId}/comments`);
export const addComment = (postId, content) => apiClient.post(`/posts/${postId}/comments`, { content });
```

### Likes
```javascript
// services/likeService.js
export const likePost = (postId) => apiClient.post(`/posts/${postId}/like`);
export const unlikePost = (postId) => apiClient.delete(`/posts/${postId}/like`);
```

### Follow
```javascript
// services/followService.js
export const followUser = (userId) => apiClient.post(`/users/${userId}/follow`);
export const unfollowUser = (userId) => apiClient.delete(`/users/${userId}/follow`);
```

## 🛠️ Coding Conventions

- **File naming**: camelCase (authService.js, LoginPage.js)
- **ES Modules**: Sử dụng import/export
- **No inline script**: Tất cả JS trong files riêng
- **View layer**: Không chứa logic nghiệp vụ, chỉ render UI
- **No hard-code**: API URLs trong config
- **Separation of concerns**: View → Controller → Service → API

## 📝 Ví dụ thêm route mới

```javascript
// 1. Tạo service
// src/services/postService.js
export const getPosts = () => apiClient.get('/posts');

// 2. Tạo controller
// src/controllers/postController.js
export const loadPosts = async () => {
  const posts = await postService.getPosts();
  return posts;
};

// 3. Tạo view
// src/views/pages/FeedPage.js
export const FeedPage = async () => {
  const posts = await postController.loadPosts();
  return `<div class="feed">...</div>`;
};

// 4. Đăng ký route
// src/app.js
router.addRoute('/feed', FeedPage, { requiresAuth: true });
```

## 🐛 Troubleshooting

### CORS Error
- Đảm bảo chạy qua Live Server, không mở file trực tiếp
- Kiểm tra API có cho phép CORS

### Module not found
- Kiểm tra path trong import statement
- Đảm bảo `type="module"` trong script tag

### Token không tự động refresh
- Kiểm tra API endpoint refresh token
- Xem console log để debug interceptor

## 📄 License

MIT License - Free to use for learning and commercial projects.
