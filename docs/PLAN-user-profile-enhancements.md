# Kế hoạch nâng cấp Trang cá nhân người dùng (UserProfilePage)

Kế hoạch này tập trung vào việc hoàn thiện các tính năng tương tác bạn bè (Chấp nhận/Từ chối) và hiển thị bài viết của người khác với cơ chế kiểm tra quyền riêng tư.

## 0. Câu hỏi làm rõ (Socratic Gate)
- Endpoint chính xác để lấy danh sách status của một người dùng cụ thể là 
`/statuses/user/{userId}`
- Endpoint cho `ACCEPT` và `REJECT` lời mời kết bạn là 
`/users/friend-request/accept` và `/users/friend-request/reject`

## 1. Thay đổi cấu hình (`app.config.js`)
- [ ] Thêm `ACCEPT` và `REJECT` vào `API_ENDPOINTS.FRIEND`.
- [ ] Thêm `USER_POSTS` vào `API_ENDPOINTS.POST` (ví dụ: `/statuses/user/`).

## 2. Cập nhật Core Services
- [ ] **userService.js**: 
    - Mở comment và hoàn thiện `acceptFriendRequest` và `rejectFriendRequest`.
- [ ] **postService.js**:
    - Thêm `getUserPosts(userId)` để gọi API lấy bài viết của người khác.

## 3. Cập nhật Controllers
- [ ] **postController.js**:
    - Thêm `getUserPosts(userId)` để xử lý logic lấy bài viết và thông báo lỗi nếu cần.

## 4. Cập nhật giao diện (`UserProfilePage.js`)
- [ ] **Logic lấy dữ liệu**: Gọi `postController.getUserPosts(userId)` khi load trang.
- [ ] **Kiểm tra quyền xem (Visibility)**:
    - `PUBLIC`: Hiển thị cho tất cả.
    - `FRIENDS_ONLY`: Chỉ hiển thị nếu `relationshipStatus === 'FRIENDS'`.
    - `PRIVATE`: Không hiển thị cho người khác.
- [ ] **Tương tác bạn bè**:
    - Gắn sự kiện cho nút "Xác nhận" (Accept) và "Từ chối" (Reject).
    - Cập nhật UI ngay sau khi thực hiện hành động.

## 5. Xác minh (Verification)
- [ ] Kiểm tra việc hiển thị đúng bài viết theo quan hệ bạn bè.
- [ ] Kiểm tra tính năng Chấp nhận/Từ chối lời mời.
- [ ] Đảm bảo không có lỗi JS khi truy cập profile của người chưa là bạn.
