import apiClient from "../core/api/apiClient.js";

export function getCommonFriends(userId, page, size = 10) {
  return apiClient.get(
    `/users/${userId}/mutual-friends?page=${page}&size=${size}`
  );
}