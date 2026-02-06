/**
 * Admin Sidebar Component
 */
export const AdminSidebar = () => {
  const currentHash = window.location.hash;

  const menuItems = [
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>`,
      label: "Bảng điều khiển",
      href: "#/admin",
      active: currentHash === "#/admin" || currentHash === "",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>`,
      label: "Quản lý người dùng",
      href: "#/admin/users",
      active: currentHash === "#/admin/users",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
      label: "Duyệt bài viết",
      href: "#/admin/posts",
      active: currentHash === "#/admin/posts",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 5v2M8 7a4 4 0 118 0M8 19a4 4 0 118 0M5 7a2 2 0 114 0M5 19a2 2 0 114 0M3 7a1 1 0 112 0m0 12a1 1 0 11-2 0"></path>`,
      label: "Báo cáo vi phạm",
      href: "#/admin/reports",
      active: currentHash === "#/admin/reports",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>`,
      label: "Quản lý nội dung",
      href: "#/admin/content",
      active: currentHash === "#/admin/content",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>`,
      label: "Thống kê",
      href: "#/admin/analytics",
      active: currentHash === "#/admin/analytics",
    },
  ];

  const settingsItems = [
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>`,
      label: "Cài đặt hệ thống",
      href: "#/admin/settings",
      active: currentHash === "#/admin/settings",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
      label: "Nhật ký hoạt động",
      href: "#/admin/logs",
      active: currentHash === "#/admin/logs",
    },
  ];

  return `
    <div class="py-4 h-full overflow-y-auto">
      <!-- Navigation Menu -->
      <nav class="space-y-1 px-3">
        <h2 class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Quản lý
        </h2>
        ${menuItems
          .map(
            (item) => `
          <a 
            href="${item.href}"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              item.active
                ? "bg-red-50 text-red-600 border-r-4 border-red-600"
                : "text-gray-700 hover:bg-gray-100"
            }"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${item.icon}
            </svg>
            <span class="font-medium text-sm">${item.label}</span>
          </a>
        `,
          )
          .join("")}
      </nav>

      <!-- Settings Section -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <nav class="space-y-1 px-3">
          <h2 class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Cài đặt
          </h2>
          ${settingsItems
            .map(
              (item) => `
            <a 
              href="${item.href}"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                item.active
                  ? "bg-red-50 text-red-600 border-r-4 border-red-600"
                  : "text-gray-700 hover:bg-gray-100"
              }"
            >
              <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${item.icon}
              </svg>
              <span class="font-medium text-sm">${item.label}</span>
            </a>
          `,
            )
            .join("")}
        </nav>
      </div>

      <!-- Quick Stats -->
      <div class="mt-8 px-3">
        <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border border-red-100">
          <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
            Thống kê nhanh
          </h3>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Người dùng</span>
              <span class="font-bold text-gray-800">1,234</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Bài viết</span>
              <span class="font-bold text-gray-800">5,678</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Báo cáo</span>
              <span class="font-bold text-red-600">23</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 px-4 py-4 border-t border-gray-200">
        <p class="text-xs text-gray-500 text-center">
          <span class="block">Admin Panel v1.0</span>
          <span class="block mt-1">© 2025 Social Network</span>
        </p>
      </div>
    </div>
  `;
};

export default AdminSidebar;
