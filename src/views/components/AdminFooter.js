/**
 * Admin Footer Component
 */
export const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="bg-white border-t border-gray-200 mt-12">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Footer Content Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- About -->
          <div>
            <h3 class="text-sm font-semibold text-gray-800 mb-4">Về Admin Panel</h3>
            <p class="text-xs text-gray-600 leading-relaxed">
              Hệ thống quản lý toàn diện cho nền tảng mạng xã hội. Quản lý người dùng, nội dung, và báo cáo vi phạm một cách hiệu quả.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-sm font-semibold text-gray-800 mb-4">Liên kết nhanh</h3>
            <ul class="space-y-2 text-xs">
              <li><a href="#/admin" class="text-gray-600 hover:text-red-600 transition">Bảng điều khiển</a></li>
              <li><a href="#/admin/users" class="text-gray-600 hover:text-red-600 transition">Quản lý người dùng</a></li>
              <li><a href="#/admin/posts" class="text-gray-600 hover:text-red-600 transition">Duyệt bài viết</a></li>
              <li><a href="#/admin/reports" class="text-gray-600 hover:text-red-600 transition">Báo cáo vi phạm</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-sm font-semibold text-gray-800 mb-4">Hỗ trợ</h3>
            <ul class="space-y-2 text-xs">
              <li><a href="#" class="text-gray-600 hover:text-red-600 transition">Tài liệu</a></li>
              <li><a href="#" class="text-gray-600 hover:text-red-600 transition">Hỗ trợ kỹ thuật</a></li>
              <li><a href="#" class="text-gray-600 hover:text-red-600 transition">Báo cáo lỗi</a></li>
              <li><a href="#" class="text-gray-600 hover:text-red-600 transition">Liên hệ</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="text-sm font-semibold text-gray-800 mb-4">Pháp lý</h3>
            <ul class="space-y-2 text-xs">
              <li><a href="#" class="text-gray-600 hover:text-red-600 transition">Điều khoản dịch vụ</a></li>
              <li><a href="#" class="text-gray-600 hover:text-red-600 transition">Chính sách bảo mật</a></li>
              <li><a href="#" class="text-gray-600 hover:text-red-600 transition">Chính sách cookie</a></li>
              <li><a href="#" class="text-gray-600 hover:text-red-600 transition">DMCA</a></li>
            </ul>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 py-6">
          <!-- Bottom Section -->
          <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <!-- Copyright -->
            <div class="text-xs text-gray-600">
              <p>&copy; ${currentYear} Social Network Admin Panel. Tất cả quyền được bảo lưu.</p>
            </div>

            <!-- Version & Status -->
            <div class="flex items-center space-x-4 text-xs">
              <span class="text-gray-600">
                <strong>v1.0.0</strong> - Release
              </span>
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <span class="text-gray-600">Hệ thống hoạt động bình thường</span>
              </div>
            </div>

            <!-- Social Links -->
            <div class="flex items-center space-x-4">
              <a href="#" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" aria-label="Facebook">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" aria-label="Twitter">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.999 4z"/>
                </svg>
              </a>
              <a href="#" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" aria-label="GitHub">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `;
};

export default AdminFooter;
