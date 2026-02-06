import { AdminHeader } from "./AdminHeader.js";
import { AdminSidebar } from "./AdminSidebar.js";
import { AdminFooter } from "./AdminFooter.js";
import { authState } from "../../state/authState.js";

/**
 * Admin Layout Component
 * Bao gồm Admin Header, Sidebar và Footer
 */

/**
 * Render admin layout
 * @param {string} content - Main content HTML
 * @param {Object} options - Layout options
 * @returns {string} Complete admin layout HTML
 */
export const AdminLayout = (content, options = {}) => {
  const { showSidebar = true, fullWidth = false } = options;
  const isAuthenticated = authState.isAuthenticated();
  const isAdmin = authState.isAdmin();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return `
      <div class="flex items-center justify-center h-screen">
        <div class="text-center">
          <p class="text-gray-600 mb-4">Bạn cần đăng nhập để truy cập trang admin</p>
          <a href="#/login" class="text-blue-600 hover:text-blue-700 font-medium">Đăng nhập</a>
        </div>
      </div>
    `;
  }

  if (!isAdmin) {
    // Redirect to home if user doesn't have admin role
    setTimeout(() => {
      window.location.hash = '#/';
    }, 2000);
    return `
      <div class="flex items-center justify-center h-screen bg-red-50">
        <div class="text-center max-w-md">
          <div class="mb-4">
            <svg class="w-16 h-16 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 5v2M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-red-600 mb-2">Truy cập bị từ chối</h1>
          <p class="text-gray-600 mb-4">Bạn không có quyền truy cập trang quản lý admin.</p>
          <p class="text-xs text-gray-500 mb-6">Sẽ tự động chuyển hướng về trang chủ trong 2 giây...</p>
          <a href="#/" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Quay về trang chủ</a>
        </div>
      </div>
    `;
  }

  return `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      ${AdminHeader()}
      
      <div class="flex flex-1 pt-16">
        ${
          showSidebar
            ? `
          <aside class="fixed left-0 top-16 w-72 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto shadow-sm">
            ${AdminSidebar()}
          </aside>
        `
            : ""
        }
        
        <main class="${showSidebar ? "ml-72" : ""} flex-1 flex flex-col">
          <div class="flex-1 p-6">
            ${content}
          </div>
          
          ${AdminFooter()}
        </main>
      </div>
    </div>
  `;
};

export default AdminLayout;
