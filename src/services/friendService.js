import api from "../core/api/api.js";

export async function getCommonFriends(userId, page, size = 10) {
  return await api.get(`/users/${userId}/mutual-friends?page=${page}&size=${size}`);
}