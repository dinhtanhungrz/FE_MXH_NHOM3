import * as authService from "../services/authService.js";
import { authState } from "../state/authState.js";
import { showToast } from "../core/utils/helpers.js";
import { getUsernameFromToken } from "../core/utils/jwt.js";

/**
 * Auth Controller
 * Xử lý business logic cho authentication
 */

/**
 * Handle login
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<boolean>} Success status
 */
export const login = async (username, password) => {
  try {
    const response = await authService.login(username, password);

    // Lưu tokens từ response
    const accessToken = response.data.accessToken || response.data.access_token;
    const refreshToken = response.data.refreshToken || response.data.refresh_token;
    const roles = response.data.role || []; // role là mảng từ API

    if (!accessToken || !refreshToken) {
      throw new Error("Không nhận được token từ server");
    }

    // Lưu tokens
    authState.setTokens(accessToken, refreshToken);

    // Tạo user object từ role và thông tin trong token
    // Nếu role chứa "ROLE_ADMIN" hoặc "ROLE_SUPERADMIN" thì là admin
    const isAdmin = roles.includes("ROLE_ADMIN") || roles.includes("ROLE_SUPERADMIN");
    const userRole = isAdmin ? "admin" : "user";

    // Lấy username từ token
    const tokenUsername = getUsernameFromToken(accessToken);

    // Tạo user object tạm thời (sẽ được cập nhật khi gọi getCurrentUser)
    const tempUser = {
      role: userRole,
      roles: roles,
      username: tokenUsername || username,
    };

    // Lưu user tạm thời
    authState.setUser(tempUser);

    // Gọi API để lấy thông tin user đầy đủ
    try {
      const userResponse = await authService.getCurrentUser();
      if (userResponse?.data) {
        // Cập nhật user object với thông tin đầy đủ từ API
        const fullUser = {
          ...userResponse.data,
          role: userRole,
          roles: roles,
        };
        authState.setUser(fullUser);
      }
    } catch (userError) {
      console.error("Error fetching user info:", userError);
      // Vẫn lưu user tạm thời nếu không lấy được thông tin đầy đủ
    }

    showToast("Đăng nhập thành công!", "success");
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    showToast(error.message || "Đăng nhập thất bại", "error");
    return false;
  }
};

/**
 * Handle logout
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always clear local auth
    authState.clear();
    showToast("Đã đăng xuất", "info");
  }
};

/**
 * Handle register
 * @param {string} username - Username
 * @param {string} email - Email
 * @param {string} password - Password
 * @param {string|null} birthday - Birthday (optional, format: YYYY-MM-DD)
 * @param {string|null} phone - Phone (optional)
 * @returns {Promise<boolean>} Success status
 */
export const register = async (
  username,
  email,
  password,
  confirmPassword,
  birthday = null,
  phone = null,
) => {
  try {
    const userData = {
      username,
      email,
      password,
      confirmPassword,
      role: "ROLE_USER",
    };

    // Thêm các trường optional nếu có
    if (birthday) {
      userData.birthday = birthday;
    }
    if (phone) {
      userData.phone = phone;
    }

    const response = await authService.register(userData);

    showToast("Đăng ký thành công! Vui lòng đăng nhập.", "success");
    return true;
  } catch (error) {
    console.error("Register error:", error);
    showToast(error.message || "Đăng ký thất bại", "error");
    return false;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return authState.isAuthenticated();
};

/**
 * Get current user from state
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  return authState.getUser();
};

export default {
  login,
  logout,
  register,
  isAuthenticated,
  getCurrentUser,
};
