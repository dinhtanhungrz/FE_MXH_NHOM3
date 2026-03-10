import apiClient from "../core/api/apiClient.js";
import { likeEndpoints } from "../core/api/endpoints.js";

export function likeStatus(statusId) {
  return apiClient.post(likeEndpoints.like(statusId));
}

export function unlikeStatus(statusId) {
  return apiClient.delete(likeEndpoints.unlike(statusId));
}

export function getLikeStatus(statusId) {
  return apiClient.get(likeEndpoints.getStatus(statusId));
}