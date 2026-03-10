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