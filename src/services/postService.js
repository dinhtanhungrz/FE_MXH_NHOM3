import apiClient from "../core/api/apiClient.js";
import { postEndpoints } from "../core/api/endpoints.js";

export const postService = {

  async getList() {
    const response = await apiClient.get(
      postEndpoints.list()
    );
    return response.data;
  },

  async create(payload) {
    const response = await apiClient.post(
      postEndpoints.create(),
      payload
    );
    return response.data;
  },

  async getDetail(postId) {
    const response = await apiClient.get(
      postEndpoints.detail(postId)
    );
    return response.data;
  },

  async update(postId, payload) {
    const response = await apiClient.put(
      postEndpoints.update(postId),
      payload
    );
    return response.data;
  },

  async delete(postId) {
    const response = await apiClient.delete(
      postEndpoints.delete(postId)
    );
    return response.data;
  }

};