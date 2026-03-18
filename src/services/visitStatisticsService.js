import apiClient from "../core/api/apiClient.js";
import { APP_CONFIG } from "../core/config/app.config.js";

/**
 * Ghi nhận 1 lượt truy cập — gọi khi app khởi động / refresh
 * Silent fail: không block UX nếu lỗi
 */
export const recordVisit = async () => {
  try {
    await apiClient.post(APP_CONFIG.API_ENDPOINTS.VISITS.RECORD_VISIT);
  } catch (_) {
    // intentionally silent
    console.log("Error Api: ", _.message);
  }
};

/**
 * Lấy thống kê lượt truy cập
 * @param {Object} params - { type, month?, year? }
 * @returns {Promise<VisitChartDto>} { labels, datasets }
 */
export const getVisitStats = async ({ type = "WEEK", month, year } = {}) => {
  const queryParams = new URLSearchParams({ type });

  if (type === "MONTH") {
    if (month !== undefined) queryParams.append("month", month);
    if (year !== undefined) queryParams.append("year", year);
  }

  if (type === "YEAR") {
    if (year !== undefined) queryParams.append("year", year);
  }

  const response = await apiClient.get(
    `${APP_CONFIG.API_ENDPOINTS.VISITS.STATISTICS}?${queryParams.toString()}`,
  );

  const { code, message, data } = response;

  if (code !== 200) {
    throw new Error(message || "Lỗi khi lấy thống kê lượt truy cập");
  }

  return data; // { labels, datasets }
};

export default {
  recordVisit,
  getVisitStats,
};
