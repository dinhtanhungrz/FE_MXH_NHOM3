import apiClient from "../core/api/apiClient.js";

export function getCommonFriends(userId, page, size = 10) {
  return apiClient.get(
    `/users/${userId}/mutual-friends?page=${page}&size=${size}`
  );
}

// bạn của user khác
export function getFriends(userId, page = 0) {
  return apiClient.get(`/users/${userId}/friends?page=${page}&size=10`);
}

// bạn của chính mình
export function getMyFriends(page = 0) {
  return apiClient.get(`/users/friends?page=${page}&size=10`);
}
// ===== FRIEND REQUEST =====

// 📩 Lấy danh sách lời mời
export function getFriendRequests() {
  return apiClient.get("/users/friend-requests");
}

// ➕ Gửi lời mời kết bạn
export function sendFriendRequest(userId) {
  return apiClient.post(`/users/friend-request/${userId}`);
}

// ❌ Hủy lời mời đã gửi
export function cancelFriendRequest(userId) {
  return apiClient.delete(`/users/cancel-request/${userId}`);
}

// ✅ Accept lời mời
export function acceptFriend(userId) {
  return apiClient.post(`/users/friend-request/${userId}/accept`);
}

// ❌ Reject lời mời
export function rejectFriend(userId) {
  return apiClient.delete(`/users/friend-request/reject/${userId}`);
}

// ❌ Unfriend
export function unfriend(userId) {
  return apiClient.delete(`/users/unfriend/${userId}`);
}
export function getFriendSuggestions(page = 0, size = 5) {
  return apiClient.get("/users/suggestions");
}