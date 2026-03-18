import * as userStatisticsService from "../services/userStatisticsService.js";

/**
 * Lấy thống kê người dùng mới
 * @param {Object} params - { type, month?, year? }
 * @returns {Promise<NewUserChartDto>} Chart data cho Chart.js
 */
export const getNewUserStats = async ({ type = "WEEK", month, year } = {}) => {
  // Validate type
  const validTypes = ["WEEK", "MONTH", "YEAR"];
  if (!validTypes.includes(type)) {
    throw new Error("Loại thống kê không hợp lệ. Chỉ chấp nhận: WEEK, MONTH, YEAR");
  }

  // Validate month
  if (type === "MONTH" && month !== undefined) {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error("Tháng phải là số nguyên từ 1 đến 12");
    }
  }

  // Validate year
  const currentYear = new Date().getFullYear();
  if (year !== undefined) {
    if (!Number.isInteger(year) || year < 2000 || year > currentYear) {
      throw new Error(`Năm phải nằm trong khoảng 2000 đến ${currentYear}`);
    }
  }

  return await userStatisticsService.getNewUserStats({ type, month, year });
};

export default {
  getNewUserStats,
};
