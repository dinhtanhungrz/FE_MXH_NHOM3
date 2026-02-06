import { AdminLayout } from "../../components/AdminLayout.js";
import { showLoading, hideLoading, showToast } from "../../../core/utils/helpers.js";
import userController from "../../../controllers/userController.js";

/**
 * Admin Users Management Page
 */
export default async function AdminUsersPage() {
  showLoading();

  try {
    // Lấy danh sách tất cả người dùng
    const users = await userController.getAllUsers();
    hideLoading();

    if (!Array.isArray(users)) {
      return AdminLayout("Không thể tải danh sách người dùng");
    }

    const content = `
        <div class="space-y-6">
            <!-- Page Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
                    <p class="mt-1 text-gray-600">Tổng số người dùng: <strong>${users.length}</strong></p>
                </div>
                <div class="flex gap-2">
                    <input 
                        type="text" 
                        id="searchInput" 
                        placeholder="Tìm kiếm người dùng..."
                        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button id="refreshBtn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Làm mới
                    </button>
                </div>
            </div>

            <!-- Users Table -->
            <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Tên đăng nhập</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Tên đầy đủ</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Vai trò</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Trạng thái</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Hoạt động</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Hành động</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody" class="divide-y divide-gray-200">
                            ${renderUsersTable(users)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div id="deleteModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-sm w-full">
                <div class="p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa người dùng</h2>
                    <p class="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.</p>
                    <div class="flex gap-3">
                        <button id="cancelDeleteBtn" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                            Hủy
                        </button>
                        <button id="confirmDeleteBtn" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Details Modal -->
        <div id="userDetailsModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-gray-900">Chi tiết người dùng</h2>
                    <button id="closeDetailsModal" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div id="userDetailsContent" class="p-6">
                    <!-- Content will be filled dynamically -->
                </div>
            </div>
        </div>
    `;

    const layoutContent = AdminLayout(content);

    // Setup event listeners
    setTimeout(() => {
      //   setupUsersPageHandlers(users);
    }, 100);

    return layoutContent;
  } catch (error) {
    hideLoading();
    showToast(error.message || "Lỗi khi tải danh sách người dùng", "error");
    return AdminLayout("Lỗi khi tải danh sách người dùng");
  }
}

/**
 * Render users table rows
 * @param {Array} users - List of users
 */
function renderUsersTable(users) {
  return users
    .map(
      (user) => `
    <tr class="hover:bg-gray-50 transition">
        <td class="px-6 py-4 text-sm text-gray-900">${user.id}</td>
        <td class="px-6 py-4 text-sm text-gray-900 font-medium">${user.username}</td>
        <td class="px-6 py-4 text-sm text-gray-600">${user.email || "-"}</td>
        <td class="px-6 py-4 text-sm text-gray-900">${user.fullName || "-"}</td>
        <td class="px-6 py-4 text-sm">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              user.roles.includes("ROLE_ADMIN")
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }">
                ${user.roles.includes("ROLE_ADMIN") ? "Admin" : "User"}
            </span>
        </td>
        <td class="px-6 py-4 text-sm">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              user.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }">
                ${user.enabled ? "Kích hoạt" : "Vô hiệu"}
            </span>
        </td>
        <td class="px-6 py-4 text-sm text-gray-600">${formatDate(user.createdAt)}</td>
        <td class="px-6 py-4 text-sm space-x-2">
            <button 
                class="viewDetailsBtn px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs font-medium"
                data-user-id="${user.id}"
            >
                Xem
            </button>
            <button 
                class="toggleStatusBtn px-3 py-1 ${user.enabled ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"} rounded hover:opacity-80 transition text-xs font-medium"
                data-user-id="${user.id}"
                data-enabled="${user.enabled}"
            >
                ${user.enabled ? "Vô hiệu" : "Kích hoạt"}
            </button>
            <button 
                class="deleteUserBtn px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs font-medium"
                data-user-id="${user.id}"
                data-username="${user.username}"
            >
                Xóa
            </button>
        </td>
    </tr>
  `,
    )
    .join("");
}

/**
 * Format date
 * @param {string} dateString - ISO date string
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
