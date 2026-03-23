import apiClient from "../core/api/apiClient.js";
import { APP_CONFIG } from "../core/config/app.config.js";

/**
 * Lấy thống kê người dùng mới
 * @param {Object} params - { type, month?, year? }
 * @returns {Promise<NewUserChartDto>} { labels, datasets }
 */
export const getNewUserStats = async ({ type = "WEEK", month, year } = {}) => {
  const queryParams = new URLSearchParams({ type });

  if (type === "MONTH") {
    if (month !== undefined) queryParams.append("month", month);
    if (year !== undefined) queryParams.append("year", year);
  }

  if (type === "YEAR") {
    if (year !== undefined) queryParams.append("year", year);
  }

  const response = await apiClient.get(
    `${APP_CONFIG.API_ENDPOINTS.STATISTICS.NEW_USERS}?${queryParams.toString()}`,
  );

  // apiClient trả về response.data trực tiếp (ApiResponse<T>)
  const { code, message, data } = response;

  if (code !== 200) {
    throw new Error(message || "Lỗi khi lấy thống kê người dùng");
  }

  return data; // { labels, datasets }
};

export default {
  getNewUserStats,
};
