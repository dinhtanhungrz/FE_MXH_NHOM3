import { authState } from "../../state/authState.js";
import * as authController from "../../controllers/authController.js";
import { router } from "../../core/router/router.js";
import { hideLoading, showConfirm, showLoading } from "../../core/utils/helpers.js";
import { NotificationBell } from "./NotificationBell.js";

/**
* Header Component
*/
export const Header = () => {
const user = authState.getUser();
const isAuthenticated = authState.isAuthenticated();
const userName = isAuthenticated ? user?.username || user?.name || user?.email || "User" : "Guest";
const userAvatar = isAuthenticated
? (user?.avatarUrl ||
`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`)
: `https://ui-avatars.com/api/?name=Guest&background=ccc&color=000`;

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
                <div
                    class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <span class="text-xl font-bold text-gray-800">Social Net</span>
            </a>
        </div>

        <!-- Search Bar (Desktop) -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
            <div class="relative w-full">
                <input type="text" placeholder="Tìm kiếm..."
                    class="w-full px-4 py-2 pl-10 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
        </div>

        <!-- Right Menu -->
        <div class="flex items-center space-x-4">
            <!-- Notifications -->
            ${isAuthenticated ? NotificationBell() : ''}
            <!-- Messages -->
            ${isAuthenticated ? `
            <button id="messages-btn"
                class="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
                title="Tin nhắn">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                    </path>
                </svg>
            </button>
            ` : ''}

            <!-- User Menu -->
            <div class="relative" id="user-menu">
                <button id="user-menu-btn"
                    class="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition"
                    title="Người dùng">
                    <img src="${userAvatar}" alt="${userName}" class="w-8 h-8 rounded-full object-cover" />
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <!-- Dropdown Menu -->
                <div id="user-dropdown"
                    class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    ${
                    isAuthenticated
                    ? `
                    <a href="#/profile" class="block px-4 py-2 hover:bg-gray-100">
                        Trang cá nhân
                    </a>

                    <a href="#/settings" class="block px-4 py-2 hover:bg-gray-100">
                        Cài đặt
                    </a>

                    <hr class="my-2 border-gray-200" />

                    <button id="logout-btn" class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                        Đăng xuất
                    </button>
                    `
                    : `
                    <button id="login-btn" class="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50">
                        Đăng nhập
                    </button>
                    `
                    }
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
// Login (guest)
const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
loginBtn.addEventListener("click", () => {
router.navigate("/login");
});
}
const messagesBtn = document.getElementById("messages-btn");
if (messagesBtn) {
messagesBtn.addEventListener("click", () => {
router.navigate("/messages");
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