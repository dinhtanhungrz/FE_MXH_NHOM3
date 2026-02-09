import { router } from "./core/router/router.js";
import { authState } from "./state/authState.js";
import AdminPage from "./views/pages/admin/AdminPage.js";
import AdminUsersPage from "./views/pages/admin/AdminUsersPage.js";

// Import pages
import { HomePage } from "./views/pages/user/HomePage.js";
import { LoginPage } from "./views/pages/user/LoginPage.js";
import { ProfilePage } from "./views/pages/user/ProfilePage.js";
import { RegisterPage } from "./views/pages/user/RegisterPage.js";
import SettingsPage from "./views/pages/user/SettingsPage.js";
import { UserProfilePage, initUserProfilePageEvents } from "./views/pages/user/UserProfilePage.js";

/**
 * Application Bootstrap
 * Entry point của ứng dụng
 */

// Register routes
function registerRoutes() {
  // Public routes
  router.addRoute("/", HomePage, {
    title: "Trang chủ - Social Network",
    requiresAuth: false,
  });

  router.addRoute("/login", LoginPage, {
    title: "Đăng nhập - Social Network",
    requiresAuth: false,
  });

  router.addRoute("/register", RegisterPage, {
    title: "Đăng ký - Social Network",
    requiresAuth: false,
  });

  router.addRoute("/admin", AdminPage, {
    title: "Quản lý - Social Network",
    requiresAuth: true,
    requiresAdmin: true,
  });

  router.addRoute("/admin/users", AdminUsersPage, {
    title: "Quản lý người dùng - Social Network",
    requiresAuth: true,
    requiresAdmin: true,
  });

  // Protected routes
  router.addRoute("/profile", ProfilePage, {
    title: "Trang cá nhân - Social Network",
    requiresAuth: true,
  });

  router.addRoute("/user-profile/:id", async (params) => {
    return await UserProfilePage(params.id);
  }, {
    title: "Trang cá nhân người dùng - Social Network",
    requiresAuth: true,
  });

  router.addRoute("/settings", SettingsPage, {
    title: "Cài đặt - Social Network",
    requiresAuth: true,
  });

  // Placeholder routes (sẵn sàng mở rộng)
  router.addRoute(
    "/friends",
    async () => {
      return `
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">Bạn bè</h1>
                    <p class="text-gray-600">Tính năng đang phát triển...</p>
                </div>
            </div>
        `;
    },
    {
      title: "Bạn bè - Social Network",
      requiresAuth: true,
    },
  );

  router.addRoute(
    "/messages",
    async () => {
      return `
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">Tin nhắn</h1>
                    <p class="text-gray-600">Tính năng đang phát triển...</p>
                </div>
            </div>
        `;
    },
    {
      title: "Tin nhắn - Social Network",
      requiresAuth: true,
    },
  );

  router.addRoute(
    "/notifications",
    async () => {
      return `
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">Thông báo</h1>
                    <p class="text-gray-600">Tính năng đang phát triển...</p>
                </div>
            </div>
        `;
    },
    {
      title: "Thông báo - Social Network",
      requiresAuth: true,
    },
  );

  console.log("✓ Routes registered");
}

// Setup navigation guards
function setupNavigationGuards() {
  // Before each navigation
  router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from?.path || "null"} to ${to.path}`);

    // Nếu đã login và cố truy cập trang login, redirect về home
    if (to.path === "/login" && authState.isAuthenticated()) {
      console.log("Already authenticated, redirecting to home");
      next("/");
      return;
    }

    next();
  });

  // After each navigation
  router.afterEach((to, from) => {
    console.log(`Navigated to ${to.path}`);

    // Scroll to top
    window.scrollTo(0, 0);

    // Initialize event listeners for user profile page
    if (to.path && to.path.startsWith("/user-profile/")) {
      const userId = to.path.split("/").pop();
      setTimeout(() => {
        initUserProfilePageEvents(userId);
      }, 0);
    }
  });

  console.log("✓ Navigation guards setup");
}

// Setup auth state listener
function setupAuthListener() {
  authState.subscribe((state) => {
    console.log("Auth state changed:", {
      isAuthenticated: state.isAuthenticated,
      user: state.user?.username || null,
    });

    // Có thể trigger UI updates tại đây nếu cần
  });

  console.log("✓ Auth listener setup");
}

// Initialize application
function initApp() {
  console.log("🚀 Initializing Social Network App...");

  // Register routes
  registerRoutes();

  // Setup guards
  setupNavigationGuards();

  // Setup auth listener
  setupAuthListener();

  // Initialize router (start listening to hash changes)
  router.init();

  console.log("✓ App initialized successfully");
  console.log("Current auth state:", {
    isAuthenticated: authState.isAuthenticated(),
    user: authState.getUser(),
  });
}

// Start app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Export for debugging
window.__APP__ = {
  router,
  authState,
};

console.log("App debug available at window.__APP__");
