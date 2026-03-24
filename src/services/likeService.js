import apiClient from "../core/api/apiClient.js";
import { likeEndpoints } from "../core/api/endpoints.js";

export async function likeStatus(statusId) {
  const res = await apiClient.post(likeEndpoints.like(statusId));
  return res;
}

export async function unlikeStatus(statusId) {
  const res = await apiClient.delete(likeEndpoints.unlike(statusId));
  return res;
}

export function getLikeStatus(statusId) {
  return apiClient.get(likeEndpoints.getStatus(statusId));
}