import apiClient from "../core/api/apiClient.js";
import { chatEndpoints } from "../core/api/endpoints.js";

const buildPaginationQuery = (page = 0, size = 20) => `?page=${page}&size=${size}`;

export const getChatGroups = async (page = 0, size = 50) => {
  return apiClient.get(`${chatEndpoints.groups()}${buildPaginationQuery(page, size)}`);
};

export const getChatGroupById = async (groupId) => {
  return apiClient.get(chatEndpoints.detail(groupId));
};

export const createChatGroup = async ({ groupName, description = "", memberIds = [] }) => {
  return apiClient.post(chatEndpoints.groups(), {
    groupName,
    description,
    memberIds,
  });
};

export const getGroupMessages = async (groupId, page = 0, size = 50) => {
  return apiClient.get(`${chatEndpoints.groupMessages(groupId)}${buildPaginationQuery(page, size)}`);
};

export const sendMessage = async (groupId, content) => {
  return apiClient.post(chatEndpoints.messages(), {
    groupId,
    content,
  });
};

export default {
  getChatGroups,
  getChatGroupById,
  createChatGroup,
  getGroupMessages,
  sendMessage,
};
