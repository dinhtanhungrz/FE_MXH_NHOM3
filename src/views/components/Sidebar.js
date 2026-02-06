import { authState } from "../../state/authState.js";

/**
 * Sidebar Component
 */
export const Sidebar = () => {
  const currentHash = window.location.hash;
  const user = authState.getUser();

  const menuItems = [
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>`,
      label: "Trang chủ",
      href: "#/",
      active: currentHash === "#/" || currentHash === "",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>`,
      label: "Trang cá nhân",
      href: "#/profile",
      active: currentHash === "#/profile",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>`,
      label: "Bạn bè",
      href: "#/friends",
      active: currentHash === "#/friends",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>`,
      label: "Tin nhắn",
      href: "#/messages",
      active: currentHash === "#/messages",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>`,
      label: "Thông báo",
      href: "#/notifications",
      active: currentHash === "#/notifications",
    },
  ];

  return `
        <div class="py-4">
            <!-- User Info -->
            <div class="px-4 mb-6">
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img 
                        src="${user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "User")}&background=3b82f6&color=fff`}" 
                        alt="${user?.username || "User"}"
                        class="w-10 h-10 rounded-full object-cover"
                    />
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-800 truncate">
                            ${user?.username || user?.name || "User"}
                        </p>
                        <p class="text-xs text-gray-500 truncate">
                            @${user?.username || "username"}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Navigation Menu -->
            <nav class="space-y-1 px-2">
                ${menuItems
                  .map(
                    (item) => `
                    <a 
                        href="${item.href}"
                        class="flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                          item.active
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${item.icon}
                        </svg>
                        <span class="font-medium">${item.label}</span>
                    </a>
                `,
                  )
                  .join("")}
            </nav>

            <!-- Shortcuts -->
            <div class="mt-8 px-4">
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Lối tắt
                </h3>
                <div class="space-y-2">
                    <a href="#/groups" class="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <span class="text-sm font-medium">Nhóm</span>
                    </a>

                    <a href="#/events" class="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                        <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <span class="text-sm font-medium">Sự kiện</span>
                    </a>

                    <a href="#/saved" class="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                        <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                        </div>
                        <span class="text-sm font-medium">Đã lưu</span>
                    </a>
                </div>
            </div>

            <!-- Footer -->
            <div class="mt-8 px-4 text-xs text-gray-400">
                <p>© 2025 Social Network</p>
                <p class="mt-1">Version 1.0.0</p>
            </div>
        </div>
    `;
};

export default Sidebar;
