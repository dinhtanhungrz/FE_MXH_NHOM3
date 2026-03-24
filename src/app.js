
import { router } from "./core/router/router.js";
import { authState } from "./state/authState.js";
import AdminPage from "./views/pages/admin/AdminPage.js";
import AdminUsersPage from "./views/pages/admin/AdminUsersPage.js";
import AdminAnalyticsPage from "./views/pages/admin/AdminAnalyticsPage.js";
import { setupNotification } from "./views/components/setupNotification.js";

// Import pages
import { HomePage } from "./views/pages/user/HomePage.js";
import { NewFeeds } from "./views/pages/user/NewFeeds.js";
import { LoginPage, initLoginPageEvents } from "./views/pages/user/LoginPage.js"; // Gộp import
import { ProfilePage } from "./views/pages/user/ProfilePage.js";
import { RegisterPage } from "./views/pages/user/RegisterPage.js";
import SettingsPage from "./views/pages/user/SettingsPage.js";
import { UserProfilePage, initUserProfilePageEvents } from "./views/pages/user/UserProfilePage.js";
import { FriendsListPage } from "./views/pages/user/FriendsListPage.js";
import { MutualFriendsPage } from "./views/pages/user/MutualFriendsPage.js";
import { MessagesPage, cleanupMessagesPage } from "./views/pages/user/MessagesPage.js";
import visitStatisticsController from "./controllers/visitStatisticsController.js";
import { OAuth2RedirectPage } from './views/pages/OAuth2RedirectPage.js'
import NotificationsPage from "./views/pages/user/NotificationsPage.js";

/**
 * 1. Đăng ký Routes
 */
function registerRoutes() {
  // Public routes
  router.addRoute("/", HomePage, { title: "Trang chủ" });
  router.addRoute("/newfeeds", NewFeeds, { title: "Dòng thời gian" });
  router.addRoute("/login", LoginPage, { title: "Đăng nhập" });
  router.addRoute("/register", RegisterPage, { title: "Đăng ký" });

  // OAuth2 redirect - Quan trọng: Phải khớp với Redirect URI ở Google Console
  router.addRoute("/oauth2/redirect", OAuth2RedirectPage, { 
    title: "Đang xác thực Google...",
    requiresAuth: false 
  });

  // Admin routes
  router.addRoute("/admin", AdminPage, { title: "Quản lý", requiresAuth: true, requiresAdmin: true });
  router.addRoute("/admin/users", AdminUsersPage, { title: "Người dùng", requiresAuth: true, requiresAdmin: true });
  router.addRoute("/admin/statistics", AdminAnalyticsPage, { title: "Thống kê", requiresAuth: true, requiresAdmin: true });

  // Protected routes
  router.addRoute("/profile", ProfilePage, { title: "Trang cá nhân", requiresAuth: true });
  router.addRoute("/settings", SettingsPage, { title: "Cài đặt", requiresAuth: true });
  router.addRoute("/friends", async (params) => await FriendsListPage(params), { title: "Bạn bè", requiresAuth: true });
  router.addRoute("/messages", MessagesPage, { title: "Tin nhắn", requiresAuth: true });
  
  router.addRoute("/user-profile/:id", async (params) => await UserProfilePage(params.id), { 
    title: "Hồ sơ người dùng", 
    requiresAuth: true 
  });
  router.addRoute("/notifications", NotificationsPage, {title: "Thông báo",requiresAuth: true});

  router.addRoute("/mutual-friends/:id", async (params) => await MutualFriendsPage(params), { 
    title: "Bạn chung", 
    requiresAuth: true 
  });

  console.log("✓ Routes registered");
}

/**
 * 2. Navigation Guards & Page Initialization
 */
function setupNavigationGuards() {
  router.beforeEach((to, from, next) => {
    if (from?.path === "/messages") {
      cleanupMessagesPage();
    }

    // Chặn người dùng đã login vào trang login/register
    const publicPages = ['/login', '/register'];
    if (publicPages.includes(to.path) && authState.isAuthenticated()) {
      return next("/");
    }
    next();
  });

  router.afterEach((to, from) => {
    window.scrollTo(0, 0);
    
    // Ghi nhận lượt truy cập lần đầu
    if (!from) visitStatisticsController.recordVisit();

    // Khởi tạo Event cho từng trang dựa trên Path
    initPageEvents(to);
  });
}
  let notificationInitialized = false;
/**
 * 3. Centralized Page Event Initializer
 */
function initPageEvents(route) {
  setTimeout(() => {
    const path = route.path;

    // Trang Login
    if (path === '/login' && typeof initLoginPageEvents === 'function') {
      initLoginPageEvents();
    }

    // Trang User Profile (Dynamic ID)
    if (path.startsWith('/user-profile/') && typeof initUserProfilePageEvents === 'function') {
      const userId = path.split("/").pop();
      initUserProfilePageEvents(userId);
    }
    
    // Thêm các trang khác tại đây...
    // Khởi tạo Notification trên tất cả trang (chỉ 1 lần)
    const btn = document.getElementById("notificationBtn");
    if (btn) {
      setupNotification();
    }
  }, 50); // Tăng nhẹ delay để đảm bảo DOM ổn định
}

/**
 * 4. Global Event Listeners
 */
function setupGlobalListeners() {
  // Lắng nghe click vào các link profile người dùng (Global Delegate)
  document.addEventListener("click", (e) => {
    const userLink = e.target.closest(".user-link");
    if (userLink && userLink.dataset.userId) {
      e.preventDefault();
      router.navigate(`/user-profile/${userLink.dataset.userId}`);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise Rejection:', event.reason);
  });
}

/**
 * Bootstrap App
 */
function initApp() {
  registerRoutes();
  setupNavigationGuards();
  
  // Khởi chạy router
  router.init();
  setupGlobalListeners();
  
  console.log("✓ Social Network App Ready");
}

// Khởi động
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
