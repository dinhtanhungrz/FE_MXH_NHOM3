/**
 * Helper functions và utilities
 */

/**
 * Escape HTML để tránh XSS
 * @param {string} text - Text cần escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Debounce function
 * @param {Function} func - Function cần debounce
 * @param {number} wait - Thời gian chờ (ms)
 * @returns {Function}
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Format date
 * @param {string|Date} date - Date string hoặc Date object
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format relative time (e.g., "2 giờ trước")
 * @param {string|Date} date - Date string hoặc Date object
 * @returns {string} Relative time
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(date);
};

/**
 * Show loading spinner
 */
export const showLoading = () => {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.classList.remove("hidden");
  }
};

/**
 * Hide loading spinner
 */
export const hideLoading = () => {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.classList.add("hidden");
  }
};

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 */
export const showToast = (message, type = "info") => {
  // Xóa toast cũ nếu có
  const oldToast = document.getElementById("toast");
  if (oldToast) {
    oldToast.remove();
  }

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Auto remove sau 3 giây
  setTimeout(() => {
    toast.classList.add("animate-fade-out-up");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

/**
 * Show confirm dialog (thay thế window.confirm)
 * @param {Object} options
 * @param {string} options.title - Tiêu đề
 * @param {string} options.message - Nội dung
 * @param {string} options.confirmText - Text nút confirm
 * @param {string} options.cancelText - Text nút cancel
 * @returns {Promise<boolean>}
 */
export const showConfirm = ({
  title = "Xác nhận",
  message = "Bạn có chắc chắn không?",
  confirmText = "Đồng ý",
  cancelText = "Huỷ",
} = {}) => {
  return new Promise((resolve) => {
    // Overlay
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

    // Modal
    const modal = document.createElement("div");
    modal.className = "bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-fade-in-down";

    modal.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${escapeHtml(title)}</h3>
            <p class="text-gray-600 mb-6">${escapeHtml(message)}</p>
            <div class="flex justify-end gap-3">
                <button id="confirm-cancel"
                        class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
                    ${escapeHtml(cancelText)}
                </button>
                <button id="confirm-ok"
                        class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    ${escapeHtml(confirmText)}
                </button>
            </div>
        `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const cleanup = (result) => {
      modal.classList.add("animate-fade-out-up");
      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 200);
    };

    // Events
    modal.querySelector("#confirm-ok").onclick = () => cleanup(true);
    modal.querySelector("#confirm-cancel").onclick = () => cleanup(false);

    // Click ngoài modal → cancel
    overlay.onclick = (e) => {
      if (e.target === overlay) cleanup(false);
    };

    // ESC → cancel
    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        cleanup(false);
        document.removeEventListener("keydown", escHandler);
      }
    });
  });
};

/**
 * Parse query string từ URL
 * @param {string} queryString - Query string (e.g., "?id=123&name=test")
 * @returns {Object} Parsed object
 */
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

/**
 * Replace params trong URL template
 * @param {string} template - URL template (e.g., "/users/:id/posts/:postId")
 * @param {Object} params - Params object (e.g., { id: 123, postId: 456 })
 * @returns {string} URL với params đã thay thế
 */
export const replaceUrlParams = (template, params) => {
  let url = template;
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Max length
 * @returns {string}
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes fade-in-down {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fade-out-up {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    .animate-fade-in-down {
        animation: fade-in-down 0.3s ease-out;
    }
    
    .animate-fade-out-up {
        animation: fade-out-up 0.3s ease-out;
    }
`;
document.head.appendChild(style);
