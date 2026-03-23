import { Layout } from "../../components/Layout.js";
import * as userController from "../../../controllers/userController.js";
import * as userService from "../../../services/userService.js";
import { showLoading, hideLoading, showToast } from "../../../core/utils/helpers.js";

/**
 * Settings Page
 */
export const SettingsPage = async () => {
  showLoading();

  try {
    const user = await userController.loadCurrentUser();
    hideLoading();

    if (!user) {
      return Layout(`
        <div class="text-center py-12">
          <p class="text-gray-600">Không thể tải thông tin người dùng</p>
        </div>
      `);
    }

    const content = `
      <div class="max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Cài đặt</h1>
          <p class="mt-2 text-gray-600">Quản lý tài khoản, bảo mật và cài đặt riêng tư của bạn</p>
        </div>

        <!-- Settings Navigation Tabs -->
        <div class="bg-white rounded-lg shadow-md mb-6 border border-gray-200">
          <div class="flex flex-wrap">
            <button class="settings-tab flex-1 px-4 py-3 text-center font-medium text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition active" data-tab="account">
              <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Tài khoản
            </button>
            <button class="settings-tab flex-1 px-4 py-3 text-center font-medium text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition" data-tab="security">
              <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Bảo mật
            </button>
            <button class="settings-tab flex-1 px-4 py-3 text-center font-medium text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition" data-tab="privacy">
              <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Riêng tư
            </button>
            <button class="settings-tab flex-1 px-4 py-3 text-center font-medium text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition" data-tab="notifications">
              <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              Thông báo
            </button>
          </div>
        </div>

        <!-- Tab Contents -->
        <!-- Account Tab -->
        <div id="account-tab" class="settings-content bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Thông tin tài khoản</h2>
          
          <div class="space-y-6">
            <!-- Account Info Item -->
            <div class="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
                <p class="text-sm text-gray-600 mt-1">Tên đăng nhập, email, thông tin cá nhân</p>
              </div>
              <a href="#/profile" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium">
                Chỉnh sửa
              </a>
            </div>

            <!-- Deactivate Account -->
            <div class="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Tạm dừng tài khoản</h3>
                <p class="text-sm text-gray-600 mt-1">Sau 30 ngày, tài khoản của bạn sẽ bị xóa vĩnh viễn</p>
              </div>
              <button class="px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium">
                Tạm dừng
              </button>
            </div>

            <!-- Delete Account -->
            <div class="flex items-center justify-between py-4">
              <div>
                <h3 class="text-lg font-medium text-red-600">Xóa tài khoản vĩnh viễn</h3>
                <p class="text-sm text-gray-600 mt-1">Không thể hoàn tác. Tất cả dữ liệu sẽ bị xóa</p>
              </div>
              <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
                Xóa
              </button>
            </div>
          </div>
        </div>

        <!-- Security Tab -->
        <div id="security-tab" class="settings-content hidden bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Bảo mật</h2>
          
          <div class="space-y-6">
            <!-- Change Password -->
            <div class="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Đổi mật khẩu</h3>
                <p class="text-sm text-gray-600 mt-1">Thay đổi mật khẩu của tài khoản</p>
              </div>
              <button id="changePasswordBtn" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium">
                Đổi mật khẩu
              </button>
            </div>

            <!-- Two-Factor Authentication -->
            <div class="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Xác thực hai yếu tố</h3>
                <p class="text-sm text-gray-600 mt-1">Bảo vệ tài khoản bằng xác thực 2FA</p>
              </div>
              <div class="flex items-center">
                <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  Chưa kích hoạt
                </span>
                <button class="ml-4 px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
                  Kích hoạt
                </button>
              </div>
            </div>

            <!-- Active Sessions -->
            <div class="flex items-center justify-between py-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Phiên hoạt động</h3>
                <p class="text-sm text-gray-600 mt-1">Quản lý các thiết bị và phiên đăng nhập</p>
              </div>
              <button class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                Xem
              </button>
            </div>
          </div>
        </div>

        <!-- Privacy Tab -->
        <div id="privacy-tab" class="settings-content hidden bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Cài đặt riêng tư</h2>
          
          <div class="space-y-6">
            <!-- Profile Visibility -->
            <div class="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Hiển thị hồ sơ</h3>
                <p class="text-sm text-gray-600 mt-1">Ai có thể xem hồ sơ của bạn</p>
              </div>
              <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Mọi người</option>
                <option>Bạn bè</option>
                <option>Chỉ tôi</option>
              </select>
            </div>

            <!-- Friend Requests Visibility -->
            <div class="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Hiển thị danh sách bạn</h3>
                <p class="text-sm text-gray-600 mt-1">Ai có thể thấy bạn bè của bạn</p>
              </div>
              <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Mọi người</option>
                <option>Bạn bè</option>
                <option>Chỉ tôi</option>
              </select>
            </div>

            <!-- Search Visibility -->
            <div class="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Cho phép tìm kiếm</h3>
                <p class="text-sm text-gray-600 mt-1">Cho phép tìm kiếm bạn trên nền tảng</p>
              </div>
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" class="w-5 h-5 text-blue-600" checked>
              </label>
            </div>

            <!-- Block Users -->
            <div class="flex items-center justify-between py-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Chặn người dùng</h3>
                <p class="text-sm text-gray-600 mt-1">Quản lý danh sách người dùng bị chặn</p>
              </div>
              <button class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                Xem danh sách
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications Tab -->
        <div id="notifications-tab" class="settings-content hidden bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Cài đặt thông báo</h2>
          
          <div class="space-y-6">
            <!-- Email Notifications -->
            <div class="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Thông báo qua email</h3>
                <p class="text-sm text-gray-600 mt-1">Nhận thông báo về hoạt động tài khoản</p>
              </div>
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" class="w-5 h-5 text-blue-600" checked>
              </label>
            </div>

            <!-- Push Notifications -->
            <div class="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Thông báo trên trình duyệt</h3>
                <p class="text-sm text-gray-600 mt-1">Nhận thông báo trực tiếp trên trình duyệt</p>
              </div>
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" class="w-5 h-5 text-blue-600" checked>
              </label>
            </div>

            <!-- Message Notifications -->
            <div class="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Thông báo tin nhắn</h3>
                <p class="text-sm text-gray-600 mt-1">Được thông báo khi có tin nhắn mới</p>
              </div>
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" class="w-5 h-5 text-blue-600" checked>
              </label>
            </div>

            <!-- Friend Request Notifications -->
            <div class="flex items-center justify-between py-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Thông báo lời mời kết bạn</h3>
                <p class="text-sm text-gray-600 mt-1">Được thông báo khi có lời mời kết bạn</p>
              </div>
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" class="w-5 h-5 text-blue-600" checked>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Change Password Modal -->
      <div id="changePasswordModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">Đổi mật khẩu</h2>
            <button id="closeChangePasswordModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form id="changePasswordForm" class="p-6 space-y-4">
            <!-- Old Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
              <input 
                type="password" 
                id="oldPassword"
                placeholder="Nhập mật khẩu hiện tại"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
              <input 
                type="password" 
                id="newPassword"
                placeholder="Nhập mật khẩu mới"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <p class="text-xs text-gray-500 mt-1">Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
              <input 
                type="password" 
                id="confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <!-- Button Group -->
            <div class="flex gap-3 pt-4 border-t border-gray-200">
              <button 
                type="button" 
                id="cancelChangePasswordBtn" 
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    const layoutContent = Layout(content);

    // Setup event listeners
    setTimeout(() => {
      setupSettingsPageHandlers();
    }, 100);

    return layoutContent;
  } catch (error) {
    hideLoading();
    return Layout(`
      <div class="text-center py-12">
        <p class="text-red-600">Lỗi: ${error.message}</p>
      </div>
    `);
  }
};

/**
 * Setup settings page handlers
 */
function setupSettingsPageHandlers() {
  const settingsTabs = document.querySelectorAll(".settings-tab");
  const settingsContents = document.querySelectorAll(".settings-content");
  const changePasswordBtn = document.getElementById("changePasswordBtn");
  const changePasswordModal = document.getElementById("changePasswordModal");
  const closeChangePasswordModalBtn = document.getElementById("closeChangePasswordModal");
  const cancelChangePasswordBtn = document.getElementById("cancelChangePasswordBtn");
  const changePasswordForm = document.getElementById("changePasswordForm");

  // Tab switching
  settingsTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.getAttribute("data-tab");

      // Remove active class and hide all contents
      settingsTabs.forEach((t) => {
        t.classList.remove("active", "border-b-blue-600");
        t.classList.add("border-b-transparent");
      });
      settingsContents.forEach((content) => {
        content.classList.add("hidden");
      });

      // Add active class and show selected content
      tab.classList.add("active", "border-b-blue-600");
      tab.classList.remove("border-b-transparent");
      document.getElementById(`${tabName}-tab`).classList.remove("hidden");
    });
  });

  // Change password modal
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", () => {
      changePasswordModal.classList.remove("hidden");
    });
  }

  if (closeChangePasswordModalBtn) {
    closeChangePasswordModalBtn.addEventListener("click", () => {
      changePasswordModal.classList.add("hidden");
      changePasswordForm.reset();
    });
  }

  if (cancelChangePasswordBtn) {
    cancelChangePasswordBtn.addEventListener("click", () => {
      changePasswordModal.classList.add("hidden");
      changePasswordForm.reset();
    });
  }

  // Close modal when clicking outside
  if (changePasswordModal) {
    changePasswordModal.addEventListener("click", (e) => {
      if (e.target === changePasswordModal) {
        changePasswordModal.classList.add("hidden");
        changePasswordForm.reset();
      }
    });
  }

  // Handle password change form submission
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const currentPassword = document.getElementById("oldPassword").value.trim();
      const password = document.getElementById("newPassword").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

      // Validation
      if (!currentPassword) {
        showToast("Vui lòng nhập mật khẩu hiện tại", "error");
        return;
      }

      if (!password) {
        showToast("Vui lòng nhập mật khẩu mới", "error");
        return;
      }

      if (password !== confirmPassword) {
        showToast("Mật khẩu xác nhận không khớp", "error");
        return;
      }

      if (currentPassword === password) {
        showToast("Mật khẩu mới phải khác mật khẩu hiện tại", "error");
        return;
      }

      // Check password length (6 - 32 characters)
      if (password.length < 6 || password.length > 32) {
        showToast("Mật khẩu phải có độ dài từ 6 đến 32 ký tự", "error");
        return;
      }

      await handleChangePassword(currentPassword, password, confirmPassword);
    });
  }
}

/**
 * Handle change password
 * @param {string} currentPassword - Old password
 * @param {string} password - New password
 */
async function handleChangePassword(currentPassword, password, confirmPassword) {
  try {
    showLoading();
    await userController.updatePassword(currentPassword, password, confirmPassword);
    hideLoading();
    showToast("Đổi mật khẩu thành công", "success");
    document.getElementById("changePasswordModal").classList.add("hidden");
    document.getElementById("changePasswordForm").reset();
  } catch (error) {
    hideLoading();
    showToast(error.message || "Lỗi khi đổi mật khẩu", "error");
  }
}

export default SettingsPage;
