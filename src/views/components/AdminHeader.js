import { authState } from "../../state/authState.js";
import * as authController from "../../controllers/authController.js";
import { router } from "../../core/router/router.js";

/**
 * Setup Admin Header Event Handlers
 */
function setupAdminHeaderHandlers() {
  // Toggle notifications dropdown
  const notificationBtn = document.querySelector("#notification-btn");
  if (notificationBtn) {
    notificationBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById("notification-dropdown");
      if (dropdown) {
        dropdown.classList.toggle("hidden");
      }
    });
  }

  // Toggle user dropdown menu
  const userMenuBtn = document.querySelector("#admin-user-menu button");
  if (userMenuBtn) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById("admin-user-dropdown");
      if (dropdown) {
        dropdown.classList.toggle("hidden");
      }
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    const userMenu = document.getElementById("admin-user-menu");
    const userDropdown = document.getElementById("admin-user-dropdown");
    const notifBtn = document.querySelector("#notification-btn");
    const notifDropdown = document.getElementById("notification-dropdown");

    if (userMenu && userDropdown && !userMenu.contains(event.target)) {
      userDropdown.classList.add("hidden");
    }
    if (
      notifBtn &&
      notifDropdown &&
      !notifBtn.contains(event.target) &&
      !event.target.closest("#notification-dropdown")
    ) {
      notifDropdown.classList.add("hidden");
    }
  });

  // Close dropdowns when pressing Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const userDropdown = document.getElementById("admin-user-dropdown");
      const notifDropdown = document.getElementById("notification-dropdown");
      if (userDropdown) userDropdown.classList.add("hidden");
      if (notifDropdown) notifDropdown.classList.add("hidden");
    }
  });

  // Handle logout button
  const logoutBtn = document.querySelector("#admin-user-dropdown button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (confirm("Bạn có chắc muốn đăng xuất?")) {
        try {
          await authController.logout();
          router.navigate("/login");
        } catch (error) {
          console.error("Logout error:", error);
          alert("Có lỗi khi đăng xuất!");
        }
      }
    });
  }

  addAdminHeaderAnimationStyles();
}

/**
 * Add animation styles for admin header
 */
function addAdminHeaderAnimationStyles() {
  if (document.getElementById("admin-header-animation-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "admin-header-animation-styles";
  style.textContent = `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    #admin-user-dropdown:not(.hidden),
    #notification-dropdown:not(.hidden) {
      animation: fadeInDown 0.2s ease-in-out;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Admin Header Component
 */
export const AdminHeader = () => {
  const user = authState.getUser();
  const userName = user?.username || user?.name || user?.email || "Admin";
  const userAvatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=dc2626&color=fff`;

  // Setup event handlers
  setTimeout(() => {
    setupAdminHeaderHandlers();
  }, 0);

  return `
    <header class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div class="flex items-center justify-between h-16 px-6">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="#/admin" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-800">Admin Panel</span>
          </a>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <div class="relative">
            <button 
              id="notification-btn"
              class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              aria-label="Notifications"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span class="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">3</span>
            </button>

            <!-- Notification Dropdown -->
            <div 
              id="notification-dropdown"
              class="hidden absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 class="text-sm font-semibold text-gray-700">Thông báo</h3>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <div class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                  <p class="text-sm font-medium text-gray-800">Người dùng mới đăng ký</p>
                  <p class="text-xs text-gray-500 mt-1">5 người dùng mới hôm nay</p>
                </div>
                <div class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                  <p class="text-sm font-medium text-gray-800">Báo cáo vi phạm</p>
                  <p class="text-xs text-gray-500 mt-1">2 báo cáo chưa xử lý</p>
                </div>
                <div class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition">
                  <p class="text-sm font-medium text-gray-800">Cập nhật hệ thống</p>
                  <p class="text-xs text-gray-500 mt-1">Hệ thống đã được cập nhật thành công</p>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 text-center">
                <a href="#/admin/notifications" class="text-sm text-blue-600 hover:text-blue-700 font-medium">Xem tất cả</a>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div id="admin-user-menu" class="relative">
            <button 
              class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="User menu"
            >
              <img 
                src="${userAvatar}"
                alt="${userName}"
                class="w-8 h-8 rounded-full object-cover"
              />
              <span class="text-sm font-medium text-gray-700">${userName}</span>
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </button>

            <!-- User Dropdown -->
            <div 
              id="admin-user-dropdown"
              class="hidden absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              <div class="px-4 py-4 border-b border-gray-200">
                <p class="text-sm font-semibold text-gray-800">${userName}</p>
                <p class="text-xs text-gray-500 mt-1">${user?.email || "admin@example.com"}</p>
              </div>
              <div class="py-2">
                <a href="#/admin/profile" class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Hồ sơ của tôi</span>
                </a>
                <a href="#/admin/settings" class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>Cài đặt</span>
                </a>
              </div>
              <div class="border-t border-gray-200 py-2">
                <button class="w-full text-left flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;
};

export default AdminHeader;
