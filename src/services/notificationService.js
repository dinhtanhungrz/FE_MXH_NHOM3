// services/notificationService.js
import apiClient from "../core/api/apiClient.js";
import { APP_CONFIG } from "../core/config/app.config.js";

const { NOTIFICATION } = APP_CONFIG.API_ENDPOINTS;

export const getNotificationsApi = () => {
  return apiClient.get(NOTIFICATION.BASE);
};

export const getUnreadCountApi = () => {
  return apiClient.get(NOTIFICATION.UNREAD_COUNT);
};

export const markAsReadApi = (id) => {
  return apiClient.patch(`${NOTIFICATION.READ}/${id}/read`);
};

export const markAllAsReadApi = () => {
  return apiClient.patch(NOTIFICATION.READ_ALL);
};