# Phân Tích Hệ Thống SPA Frontend & Chuyển Đổi Axios

## 📊 Tổng Quan Hệ Thống

### Kiến Trúc Ứng Dụng

- **Framework**: Vanilla JavaScript (ES6 Modules)
- **Pattern**: MVC (Model-View-Controller)
- **SPA Router**: Custom Router dựa trên hash navigation
- **HTTP Client**: ❌ Fetch API (Custom) → ✅ **Axios** (mới)

---

## 🔍 Phân Tích Chi Tiết Các Thành Phần

### 1. **API Client** (`src/core/api/apiClient.js`)

#### Trước (Fetch API Custom)

```
Lớp ApiClient tự viết với:
- Quản lý interceptor thủ công
- Xử lý timeout bằng AbortController
- Fetch API native
- 335 dòng code
- Xử lý lỗi và retry phức tạp
```

#### Sau (Axios)

```
Axios instance với:
- Interceptor tích hợp sẵn
- Timeout config đơn giản
- Request/Response interceptor
- ~140 dòng code
- Xử lý lỗi đơn giản và rõ ràng
```

**Ưu Điểm Chuyển Đổi:**

- ✅ Giảm 60% dòng code
- ✅ Đơn giản hơn và dễ bảo trì
- ✅ Interceptor chuẩn và đáng tin cậy
- ✅ Hỗ trợ token refresh tốt hơn
- ✅ Xử lý FormData tự động
- ✅ Có thể mở rộng dễ dàng

---

### 2. **Authentication Flow**

```
┌─────────────────────────────────────────────────────┐
│                   Request Flow                       │
└─────────────────────────────────────────────────────┘

1. [Request Interceptor]
   ├─ Lấy access token từ authState
   └─ Gắn vào Authorization header: "Bearer {token}"

2. [API Call]
   ├─ Gửi request với axios
   └─ Chờ response

3. [Response Interceptor - Success]
   ├─ Status 2xx → Trả về response.data
   └─ Client nhận dữ liệu

4. [Response Interceptor - 401 Error]
   ├─ Kiểm tra nếu chưa retry (_retry flag)
   ├─ Kiểm tra không phải login request
   ├─ Gọi refresh token API
   ├─ Cập nhật access token mới
   ├─ Retry request gốc
   └─ Nếu lỗi → Clear auth, redirect /login

5. [Other Errors]
   └─ Throw lỗi cho client
```

---

### 3. **State Management** (`src/state/authState.js`)

Hệ thống sử dụng centralized auth state:

- `getAccessToken()` - Lấy access token
- `getRefreshToken()` - Lấy refresh token
- `setAccessToken(token)` - Cập nhật access token
- `clear()` - Xóa auth state

---

### 4. **Services Layer**

#### authService.js

```javascript
Các hàm:
├─ login(username, password) → POST /auth/login
├─ register(userData) → POST /auth/register
├─ logout() → POST /auth/logout
└─ refreshToken(refreshToken) → POST /auth/refresh-token
```

#### userService.js

```javascript
Các hàm:
├─ getCurrentUser() → GET /users/me
├─ getUserProfile(userId) → GET /users/:id
├─ updateProfile(userData) → PUT /users/me
└─ uploadAvatar(file) → POST /users/me/avatar (FormData)
```

**Lợi Ích**: Services layer hoàn toàn không cần thay đổi vì axios API giống fetch API (get, post, put, patch, delete)

---

### 5. **Endpoints Helper** (`src/core/api/endpoints.js`)

```javascript
Cung cấp URL builders cho:
├─ authEndpoints: login, logout, refresh-token, register
├─ userEndpoints: me, profile, update
├─ postEndpoints: list, create, detail, update, delete (ready)
├─ commentEndpoints: list, create, delete (ready)
├─ likeEndpoints: like, unlike (ready)
└─ followEndpoints: follow, unfollow (ready)
```

---

## 🔄 So Sánh: Fetch vs Axios

| Tiêu Chí           | Fetch API                | Axios           |
| ------------------ | ------------------------ | --------------- |
| **Kích thước**     | ~335 lines (custom)      | ~140 lines      |
| **Timeout**        | AbortController thủ công | Config mặc định |
| **Interceptor**    | Thủ công array           | Tích hợp sẵn    |
| **Error Handling** | Phức tạp                 | Rõ ràng         |
| **FormData**       | Xử lý thủ công           | Tự động         |
| **Token Refresh**  | Tự viết logic            | Dễ dàng         |
| **Headers**        | Thủ công                 | Tự động merge   |
| **JSON**           | JSON.stringify thủ công  | Tự động         |
| **Browsers**       | Hỗ trợ hiện đại          | Hỗ trợ rộng     |

---

## 📦 Cấu Trúc File Sau Chuyển Đổi

```
src/
├── core/
│   ├── api/
│   │   ├── apiClient.js ✅ (NEW - Axios version)
│   │   └── endpoints.js (Không thay đổi)
│   ├── config/
│   │   └── app.config.js (Không thay đổi)
│   ├── router/
│   │   └── router.js (Không thay đổi)
│   └── utils/
│       ├── helpers.js (Không thay đổi)
│       └── storage.js (Không thay đổi)
│
├── services/
│   ├── authService.js (Không thay đổi - API giống)
│   └── userService.js (Không thay đổi - API giống)
│
├── controllers/
│   ├── authController.js (Không thay đổi)
│   └── userController.js (Không thay đổi)
│
├── views/
│   ├── components/ (Không thay đổi)
│   ├── pages/ (Không thay đổi)
│   └── viewHelpers.js (Không thay đổi)
│
├── state/
│   └── authState.js (Không thay đổi)
│
└── app.js (Không thay đổi)

package.json ✅ (Cập nhật - Thêm axios)
```

---

## 🚀 Các Thay Đổi Thực Hiện

### 1. package.json

```json
{
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

**Cài đặt**: `npm install axios`

---

### 2. apiClient.js - Chi Tiết Các Thay Đổi

#### Import (Mới)

```javascript
import axios from "axios";
```

#### Tạo Instance (Mới)

```javascript
const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});
```

#### Request Interceptor (Cải Thiện)

```javascript
// Trước: Custom class
apiClient.addRequestInterceptor(config => { ... })

// Sau: Axios tích hợp
apiClient.interceptors.request.use(config => { ... })
```

#### Response Interceptor (Đơn Giản)

```javascript
// Trước: executeResponseInterceptors() custom loop
// Sau: apiClient.interceptors.response.use() - chuẩn axios
```

#### Token Refresh Logic (Tương Tự)

```javascript
- subscribeTokenRefresh() - Đợi token refresh hoàn thành
- onTokenRefreshed() - Notify subscribers
- Retry request với token mới
```

---

## 📋 Tính Năng Được Bảo Đảm Hoạt Động

### ✅ Authentication

- [x] Login/Register
- [x] Token management (access + refresh)
- [x] Auto token refresh on 401
- [x] Logout

### ✅ User Management

- [x] Get current user info
- [x] Get user profile by ID
- [x] Update profile
- [x] Upload avatar (FormData)

### ✅ Error Handling

- [x] Network errors
- [x] Server errors (4xx, 5xx)
- [x] Timeout errors
- [x] Token refresh failures

### ✅ Future Ready

- [x] Post endpoints (ready to implement)
- [x] Comment endpoints (ready to implement)
- [x] Like endpoints (ready to implement)
- [x] Follow endpoints (ready to implement)

---

## 🔧 Cách Sử Dụng API Client

### Các phương thức có sẵn:

```javascript
import { apiClient } from "@/core/api/apiClient.js";

// GET
await apiClient.get("/users/me");

// POST
await apiClient.post("/auth/login", { username, password });

// PUT
await apiClient.put("/users/me", { name: "New Name" });

// PATCH
await apiClient.patch("/users/me", { bio: "Bio" });

// DELETE
await apiClient.delete("/posts/123");

// Custom config
await apiClient.get("/endpoint", { timeout: 5000 });
```

---

## 📝 Backward Compatibility

Tất cả các services không cần thay đổi vì:

1. Axios có các phương thức giống y hệt fetch wrapper (get, post, put, patch, delete)
2. Response structure tương tự (data, status, headers)
3. Error handling flow giống nhau
4. Token management logic được bảo toàn

---

## 🎯 Lợi Ích Chuyển Đổi

| Lợi Ích                | Chi Tiết                         |
| ---------------------- | -------------------------------- |
| **Giảm Complexity**    | Từ 335 → 140 dòng code           |
| **Chuẩn HTTP Client**  | Axios là industry standard       |
| **Better Maintenance** | Code quen thuộc, dễ debug        |
| **Performance**        | Optimized, caching, batchRequest |
| **Features**           | Upload progress, CSRF protection |
| **Community**          | Hỗ trợ lớn, documentation tốt    |
| **Testing**            | Dễ mock với axios-mock-adapter   |

---

## ⚠️ Lưu Ý Khi Deploy

1. **Cài đặt dependencies**: `npm install`
2. **Sử dụng bundler** (nếu cần):
   - Webpack
   - Vite (khuyên dùng)
   - Rollup
   - Parcel

3. **Trong HTML** (nếu không dùng bundler):

```html
<!-- Từ CDN -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

---

## 🧪 Testing API Calls

```javascript
// Ví dụ test login
try {
  const result = await apiClient.post("/auth/login", {
    username: "user@example.com",
    password: "password123",
  });
  console.log("Login successful:", result);
} catch (error) {
  console.error("Login failed:", error.message);
}
```

---

## 📚 Tham Khảo

- **Axios Docs**: https://axios-http.com/docs/intro
- **API Endpoints**: [app.config.js](src/core/config/app.config.js)
- **API Client**: [apiClient.js](src/core/api/apiClient.js)
- **Services**:
  - [authService.js](src/services/authService.js)
  - [userService.js](src/services/userService.js)

---

## ✨ Kết Luận

Chuyển đổi từ Fetch API custom sang Axios:

- ✅ Giảm code complexity
- ✅ Tăng maintainability
- ✅ Sử dụng industry standard
- ✅ Không ảnh hưởng tới services & controllers
- ✅ Bảo toàn tất cả functionality
- ✅ Ready for scaling & advanced features

**Status**: ✅ **Chuyển đổi hoàn tất**
