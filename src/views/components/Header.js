import { authState } from "../../state/authState.js";
import * as authController from "../../controllers/authController.js";
import { router } from "../../core/router/router.js";
import { hideLoading, showConfirm, showLoading } from "../../core/utils/helpers.js";
/**
 * Header Component
 */
export const Header = () => {
  const user = authState.getUser();

  const userName = user?.username || user?.name || user?.email || "User";
  const userAvatar =
    user?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`;

  // Setup event handlers sau khi DOM render
  setTimeout(() => {
    setupHandlerHeader();
  }, 0);

  return `
        <header class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div class="flex items-center justify-between h-16 px-6">
                <!-- Logo -->
                <div class="flex items-center">
                    <a href="#/" class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <span class="text-xl font-bold text-gray-800">Social Net</span>
                    </a>
                </div>

                <!-- Search Bar (Desktop) -->
                <div class="hidden md:flex flex-1 max-w-md mx-8">
                    <div class="relative w-full">
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm..." 
                            class="w-full px-4 py-2 pl-10 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>

                <!-- Right Menu -->
                <div class="flex items-center space-x-4">
                    <!-- Notifications -->
                    <button id="notifications-btn" class="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition" title="Thông báo">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <!-- Messages -->
                    <button id="messages-btn" class="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition" title="Tin nhắn">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                    </button>

                    <!-- User Menu -->
                    <div class="relative" id="user-menu">
                        <button 
                            id="user-menu-btn"
                            class="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition"
                            title="Người dùng"
                        >
                            <img 
                                src="${userAvatar}" 
                                alt="${userName}"
                                class="w-8 h-8 rounded-full object-cover"
                            />
                            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        <!-- Dropdown Menu -->
                        <div 
                            id="user-dropdown" 
                            class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                        >
                            <a href="#/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
                                <div class="flex items-center space-x-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    <span>Trang cá nhân</span>
                                </div>
                            </a>
                            
                            <a href="#/settings" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
                                <div class="flex items-center space-x-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    <span>Cài đặt</span>
                                </div>
                            </a>
                            
                            <hr class="my-2 border-gray-200" />
                            
                            <button 
                                id="logout-btn"
                                class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                            >
                                <div class="flex items-center space-x-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                    </svg>
                                    <span>Đăng xuất</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    `;
};

/**
 * Setup Header Event Handlers
 */
function setupHandlerHeader() {
  // Toggle user dropdown menu
  const userMenuBtn = document.querySelector("#user-menu button");
  if (userMenuBtn) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById("user-dropdown");
      if (dropdown) {
        dropdown.classList.toggle("hidden");
      }
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    const userMenu = document.getElementById("user-menu");
    const dropdown = document.getElementById("user-dropdown");

    if (userMenu && dropdown && !userMenu.contains(event.target)) {
      dropdown.classList.add("hidden");
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const dropdown = document.getElementById("user-dropdown");
      if (dropdown) {
        dropdown.classList.add("hidden");
      }
    }
  });

  // Handle logout button
  const logoutBtn = document.querySelector("#user-dropdown button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const isOk = await showConfirm({
        title: "Đăng xuất",
        message: "Bạn có chắc muốn đăng xuất?",
        confirmText: "Đồng ý",
        cancelText: "Huỷ",
      });
      if (isOk) {
        try {
          showLoading();
          await authController.logout();
          hideLoading();
          router.navigate("/login");
        } catch (error) {
          console.error("Logout error:", error);
          alert("Có lỗi khi đăng xuất!");
        }
      }
    });
  }

  // Add animation styles
  addHeaderAnimationStyles();
}

/**
 * Add animation styles for header dropdown
 */
function addHeaderAnimationStyles() {
  if (document.getElementById("header-animation-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "header-animation-styles";
  style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        #user-dropdown:not(.hidden) {
            animation: fadeIn 0.2s ease-in-out;
        }
    `;
  document.head.appendChild(style);
}

export default Header;
