import * as authService from "../services/authService.js";
import { authState } from "../state/authState.js";
import { showToast } from "../core/utils/helpers.js";
import { getUsernameFromToken } from "../core/utils/jwt.js";
import { APP_CONFIG } from "../core/config/app.config.js";

/**
 * Auth Controller
 * Xử lý business logic cho authentication
 */
export const loginWithGoogle = async (googleToken) => {
    try {
        // 1. Gọi API đến Server thật của bạn
        const url = `${APP_CONFIG.API_BASE_URL}${APP_CONFIG.API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: googleToken }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Đăng nhập Google thất bại");
        }

        const data = await response.json(); 
        // Giả sử data trả về dạng: { accessToken: "...", refreshToken: "...", user: {...} }

        // 2. Lưu vào AuthState (Class bạn đã viết)
        // Việc này giúp toàn bộ App biết user đã login thành công
        authState.setTokens(data.accessToken, data.refreshToken);
        authState.setUser(data.user);

        return data;
    } catch (error) {
        console.error("Lỗi tại authController:", error);
        throw error;
    }
};

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

    // inspect server response for detailed validation messages
    if (error.response) {
      console.error("Server response:", error.response.data);
      const data = error.response.data;
      let toastMsg = data?.message || error.message || "Đăng ký thất bại";

      // common case: validation errors array
      if (data?.errors && Array.isArray(data.errors)) {
        toastMsg = data.errors
          .map((e) => {
            if (e.field) {
              return `${e.field}: ${e.defaultMessage || e.message}`;
            }
            return e.message || JSON.stringify(e);
          })
          .join("; ");
      }

      showToast(toastMsg, "error");
    } else {
      showToast(error.message || "Đăng ký thất bại", "error");
    }
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
