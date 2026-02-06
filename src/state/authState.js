import { storage } from "../core/utils/storage.js";
import { APP_CONFIG } from "../core/config/app.config.js";

/**
 * Auth State Management
 * Quản lý trạng thái authentication trong app
 */
class AuthState {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    this.listeners = [];

    // Load từ storage khi khởi tạo
    this.loadFromStorage();
  }

  /**
   * Load auth data từ localStorage
   */
  loadFromStorage() {
    this.accessToken = storage.get(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    this.refreshToken = storage.get(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    this.user = storage.get(APP_CONFIG.STORAGE_KEYS.USER_INFO);
  }

  /**
   * Set access token
   * @param {string} token - Access token
   */
  setAccessToken(token) {
    this.accessToken = token;
    storage.set(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
    this.notifyListeners();
  }

  /**
   * Get access token
   * @returns {string|null}
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Set refresh token
   * @param {string} token - Refresh token
   */
  setRefreshToken(token) {
    this.refreshToken = token;
    storage.set(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, token);
    this.notifyListeners();
  }

  /**
   * Get refresh token
   * @returns {string|null}
   */
  getRefreshToken() {
    return this.refreshToken;
  }

  /**
   * Set tokens (access + refresh)
   * @param {string} accessToken - Access token
   * @param {string} refreshToken - Refresh token
   */
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    storage.set(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    storage.set(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    this.notifyListeners();
  }

  /**
   * Set user info
   * @param {Object} user - User object
   */
  setUser(user) {
    this.user = user;
    storage.set(APP_CONFIG.STORAGE_KEYS.USER_INFO, user);
    this.notifyListeners();
  }

  /**
   * Get user info
   * @returns {Object|null}
   */
  getUser() {
    return this.user;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!(this.accessToken && this.refreshToken);
  }

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  isAdmin() {
    if (!this.user) return false;
    // Kiểm tra role là 'admin' hoặc 'superadmin'
    if (this.user.role === "admin") {
      return true;
    }
    // Hoặc kiểm tra trong mảng roles từ API
    if (Array.isArray(this.user.roles)) {
      return this.user.roles.includes("ROLE_ADMIN") || this.user.roles.includes("ROLE_SUPERADMIN");
    }
    return false;
  }

  /**
   * Check if user has permission
   * @param {string} permission - Permission name
   * @returns {boolean}
   */
  hasPermission(permission) {
    if (!this.user) return false;
    // Nếu là admin thì có tất cả quyền
    if (this.isAdmin()) return true;
    // Kiểm tra trong mảng permissions
    if (Array.isArray(this.user.permissions)) {
      return this.user.permissions.includes(permission);
    }
    return false;
  }

  /**
   * Clear all auth data (logout)
   */
  clear() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    storage.remove(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    storage.remove(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(APP_CONFIG.STORAGE_KEYS.USER_INFO);
    this.notifyListeners();
  }

  /**
   * Subscribe to auth state changes
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  }

  /**
   * Notify all listeners về state changes
   */
  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        user: this.user,
        isAuthenticated: this.isAuthenticated(),
      });
    });
  }
}

// Export singleton instance
export const authState = new AuthState();
export default authState;
