// services/notificationService.js
import { APP_CONFIG } from "../core/config/app.config.js";

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.TIMEOUT,
});

export const getNotificationsApi = () => {
  return api.get("/notifications");
};

export const getUnreadCountApi = () => {
  return api.get("/notifications/unread-count");
};

export const markAsReadApi = (id) => {
  return api.post(`/notifications/read/${id}`);
};