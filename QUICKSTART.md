# 🚀 Quick Start Guide

## Chạy dự án trong 3 bước

### Bước 1: Cài đặt Live Server

**VS Code:**
1. Mở VS Code
2. Vào Extensions (Ctrl+Shift+X)
3. Tìm "Live Server" của Ritwick Dey
4. Click Install

**Hoặc dùng HTTP server khác:**
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

### Bước 2: Mở project

1. Giải nén folder `spa-frontend`
2. Mở folder trong VS Code
3. Right-click vào `index.html`
4. Chọn "Open with Live Server"

### Bước 3: Truy cập ứng dụng

Trình duyệt sẽ tự động mở tại: `http://localhost:5500`

---

## 🔐 Test với Demo Account

API demo: `https://api-test-web.agiletech.vn`

**Thông tin đăng nhập:**
- Username: `testuser`
- Password: `password123`

*(Lưu ý: Thông tin này chỉ là ví dụ, cần kiểm tra API documentation để có thông tin đăng nhập chính xác)*

---

## 📂 Cấu trúc dự án

```
spa-frontend/
├── index.html              # Entry point
├── src/
│   ├── app.js             # Bootstrap application
│   ├── core/              # Core functionality
│   │   ├── api/           # API client & endpoints
│   │   ├── config/        # Configuration
│   │   ├── router/        # SPA Router
│   │   └── utils/         # Utilities
│   ├── state/             # State management
│   ├── services/          # API services
│   ├── controllers/       # Business logic
│   └── views/             # UI components & pages
│       ├── components/    # Reusable components
│       └── pages/         # Page components
├── README.md              # Full documentation
└── EXTENSION_GUIDE.md     # How to extend features
```

---

## ✅ Checklist hoạt động

- [ ] Mở được trang chủ
- [ ] Form login hiển thị đúng
- [ ] Đăng nhập thành công
- [ ] Redirect đến trang profile
- [ ] Header & Sidebar hiển thị
- [ ] Logout hoạt động
- [ ] Redirect về login sau logout

---

## 🐛 Troubleshooting

### CORS Error
**Vấn đề:** Console hiển thị CORS error  
**Giải pháp:** 
- Đảm bảo chạy qua Live Server, không mở file trực tiếp
- Kiểm tra API có cho phép CORS từ localhost

### Module not found
**Vấn đề:** "Failed to load module script"  
**Giải pháp:**
- Kiểm tra đường dẫn import
- Đảm bảo tất cả file .js tồn tại
- Clear browser cache (Ctrl+Shift+Delete)

### Không thể login
**Vấn đề:** Login form submit nhưng không chuyển trang  
**Giải pháp:**
1. Mở Console (F12)
2. Xem lỗi gì được log ra
3. Kiểm tra API endpoint trong `app.config.js`
4. Test API trực tiếp bằng Postman/curl

### Token không tự động refresh
**Vấn đề:** Sau khi token hết hạn, bị logout  
**Giải pháp:**
- Kiểm tra endpoint refresh token trong config
- Xem log trong Console để debug interceptor
- Verify refresh token được lưu đúng trong localStorage

---

## 📝 Next Steps

1. **Đọc README.md** để hiểu kiến trúc chi tiết
2. **Đọc EXTENSION_GUIDE.md** để học cách mở rộng
3. **Customize** API endpoint trong `src/core/config/app.config.js`
4. **Thêm tính năng mới** theo pattern MVC

---

## 💡 Tips

- Mở DevTools Console (F12) để xem logs
- Sử dụng `window.__APP__` để debug (router, authState)
- Check Network tab để xem API requests
- Sử dụng Vue DevTools hoặc React DevTools? Không cần! Đây là vanilla JS

---

## 🆘 Cần hỗ trợ?

1. Check console errors
2. Đọc documentation trong code
3. Xem ví dụ trong EXTENSION_GUIDE.md
4. Debug với `console.log()` 😊

Happy coding! 🎉
