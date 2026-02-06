import { AdminLayout } from "../../components/AdminLayout.js";

/**
 * Admin Page
 * Trang quản lý admin chính
 */
export const AdminPage = async () => {
  // Placeholder content
  const dashboardContent = `
        <div class="space-y-6">
            <!-- Page Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
                    <p class="mt-1 text-gray-600">Chào mừng đến với hệ thống quản lý admin</p>
                </div>
                <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
                    Xuất báo cáo
                </button>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm font-medium">Tổng người dùng</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">1,234</p>
                            <p class="text-green-600 text-xs font-medium mt-2">+5.2% so với tuần trước</p>
                        </div>
                        <div class="p-3 bg-blue-100 rounded-lg">
                            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm font-medium">Tổng bài viết</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">5,678</p>
                            <p class="text-green-600 text-xs font-medium mt-2">+12.3% so với tuần trước</p>
                        </div>
                        <div class="p-3 bg-green-100 rounded-lg">
                            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm font-medium">Báo cáo chưa xử lý</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">23</p>
                            <p class="text-red-600 text-xs font-medium mt-2">3 báo cáo mới hôm nay</p>
                        </div>
                        <div class="p-3 bg-red-100 rounded-lg">
                            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 5v2M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm font-medium">Người dùng hoạt động</p>
                            <p class="text-3xl font-bold text-gray-900 mt-2">856</p>
                            <p class="text-green-600 text-xs font-medium mt-2">+8.1% so với hôm qua</p>
                        </div>
                        <div class="p-3 bg-purple-100 rounded-lg">
                            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity Section -->
            <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-bold text-gray-900">Hoạt động gần đây</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Loại hoạt động</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Người dùng</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Mô tả</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Thời gian</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50 transition">
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Đăng ký</span></td>
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">Nguyễn Văn A</td>
                                <td class="px-6 py-4 text-sm text-gray-600">Tài khoản mới được tạo</td>
                                <td class="px-6 py-4 text-sm text-gray-600">5 phút trước</td>
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Thành công</span></td>
                            </tr>
                            <tr class="hover:bg-gray-50 transition">
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Báo cáo</span></td>
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">Trần Thị B</td>
                                <td class="px-6 py-4 text-sm text-gray-600">Báo cáo bài viết vi phạm</td>
                                <td class="px-6 py-4 text-sm text-gray-600">15 phút trước</td>
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Chờ xử lý</span></td>
                            </tr>
                            <tr class="hover:bg-gray-50 transition">
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Xóa</span></td>
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">Admin System</td>
                                <td class="px-6 py-4 text-sm text-gray-600">Xóa bài viết vi phạm</td>
                                <td class="px-6 py-4 text-sm text-gray-600">25 phút trước</td>
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Thành công</span></td>
                            </tr>
                            <tr class="hover:bg-gray-50 transition">
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Cập nhật</span></td>
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">Phạm Quốc C</td>
                                <td class="px-6 py-4 text-sm text-gray-600">Cập nhật hồ sơ</td>
                                <td class="px-6 py-4 text-sm text-gray-600">1 giờ trước</td>
                                <td class="px-6 py-4 text-sm"><span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Thành công</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <a href="#/admin/logs" class="text-sm text-red-600 hover:text-red-700 font-medium">Xem tất cả hoạt động →</a>
                </div>
            </div>
        </div>
    `;

  return AdminLayout(dashboardContent);
};

export default AdminPage;
