// controllers/notificationController.js
import {
  getNotificationsApi,
  getUnreadCountApi,
  markAsReadApi,
} from "../services/notificationService.js";

export default {
  async getNotifications() {
    const res = await getNotificationsApi();
    return res.data;
  },

  async getUnreadCount() {
    const res = await getUnreadCountApi();
    return res.data;
  },

  async markAsRead(id) {
    await markAsReadApi(id);
  },
};