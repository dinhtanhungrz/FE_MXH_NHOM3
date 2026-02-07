import { Layout } from "../../components/Layout.js";
import * as userController from "../../../controllers/userController.js";
import * as userService from "../../../services/userService.js";
import { showLoading, hideLoading, formatDate, showToast } from "../../../core/utils/helpers.js";

/**
 * Profile Page
 */
export const ProfilePage = async () => {
  showLoading();

  // Load user data
  const user = await userController.loadCurrentUser();

  hideLoading();

  if (!user) {
    return Layout(`
            <div class="text-center py-12">
                <p class="text-gray-600">Không thể tải thông tin người dùng</p>
            </div>
        `);
  }

  const content = `
        <div class="max-w-4xl mx-auto">
            <!-- Profile Header -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                <!-- Cover Photo -->
                <div class="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <!-- Profile Info -->
                <div class="px-6 pb-6">
                    <div class="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20">
                        <!-- Avatar -->
                        <div class="relative">
                            <img 
                                src="${user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "User")}&size=200&background=3b82f6&color=fff`}"
                                alt="${user.username}"
                                class="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover"
                            />
                            <button class="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition">
                                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </button>
                        </div>

                        <!-- User Info -->
                        <div class="mt-6 sm:mt-0 sm:ml-8 flex-1">
                            <!-- Name Section -->
                            <div class="mb-4">
                                <h1 class="text-3xl sm:text-4xl font-bold text-white leading-tight">
                                    ${user.fullName || user.username}
                                </h1>
                                <p class="text-lg text-gray-500 mt-2 font-medium">@${user.username}</p>
                            </div>
                            
                            <!-- Bio Section -->
                            ${
                              user.bio
                                ? `
                                <p class="text-gray-700 mt-4 text-base leading-relaxed max-w-3xl">
                                    ${user.bio}
                                </p>
                            `
                                : ""
                            }

                            <!-- Stats -->
                            <div class="flex gap-8 mt-6">
                                <div>
                                    <p class="text-3xl font-bold text-gray-900">${user.postsCount || 0}</p>
                                    <p class="text-sm text-gray-600 mt-1 font-medium">Bài viết</p>
                                </div>
                                <div>
                                    <p class="text-3xl font-bold text-gray-900">${user.followersCount || 0}</p>
                                    <p class="text-sm text-gray-600 mt-1 font-medium">Người theo dõi</p>
                                </div>
                                <div>
                                    <p class="text-3xl font-bold text-gray-900">${user.followingCount || 0}</p>
                                    <p class="text-sm text-gray-600 mt-1 font-medium">Đang theo dõi</p>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-4 sm:mt-0 flex space-x-3">
                            <button id="editProfileBtn" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                <span>Chỉnh sửa</span>
                            </button>
                            <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Additional Info -->
                    <div class="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
                        ${
                          user.email
                            ? `
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <span>${user.email}</span>
                            </div>
                        `
                            : ""
                        }
                        
                        ${
                          user.location
                            ? `
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <span>${user.location}</span>
                            </div>
                        `
                            : ""
                        }
                        
                        ${
                          user.createdAt
                            ? `
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>Tham gia ${formatDate(user.createdAt)}</span>
                            </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>

            <!-- Content Tabs -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                <!-- Tabs Header -->
                <div class="border-b border-gray-200">
                    <nav class="flex">
                        <button class="px-6 py-4 text-blue-600 border-b-2 border-blue-600 font-medium">
                            Bài viết
                        </button>
                        <button class="px-6 py-4 text-gray-600 hover:text-gray-900 font-medium">
                            Giới thiệu
                        </button>
                        <button class="px-6 py-4 text-gray-600 hover:text-gray-900 font-medium">
                            Bạn bè
                        </button>
                        <button class="px-6 py-4 text-gray-600 hover:text-gray-900 font-medium">
                            Ảnh
                        </button>
                    </nav>
                </div>

                <!-- Tabs Content -->
                <div class="p-6">
                    <!-- Posts Section -->
                    <div id="posts-section">
                        <!-- Create Post -->
                        <div class="bg-gray-50 rounded-xl p-4 mb-6">
                            <div class="flex space-x-3">
                                <img 
                                    src="${user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=3b82f6&color=fff`}"
                                    alt="${user.username}"
                                    class="w-10 h-10 rounded-full object-cover"
                                />
                                <button class="flex-1 text-left px-4 py-3 bg-white rounded-full text-gray-500 hover:bg-gray-100 transition">
                                    Bạn đang nghĩ gì?
                                </button>
                            </div>
                            <div class="flex justify-around mt-4 pt-4 border-t border-gray-200">
                                <button class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <span>Ảnh/Video</span>
                                </button>
                                <button class="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>Cảm xúc</span>
                                </button>
                            </div>
                        </div>

                        <!-- Posts List -->
                        <div class="text-center py-12 text-gray-500">
                            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p class="text-lg font-medium">Chưa có bài viết nào</p>
                            <p class="text-sm mt-2">Bắt đầu chia sẻ khoảnh khắc của bạn!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Profile Modal -->
        <div id="editProfileModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-gray-900">Chỉnh sửa Profile</h2>
                    <button id="closeEditModal" class="text-gray-500 hover:text-gray-700 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Modal Body -->
                <form id="editProfileForm" class="p-5 space-y-4">
                    <!-- Username Field (Read-only) -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Username <span class="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            id="editUsername" 
                            value="${user.username || ""}"
                            placeholder="Tên đăng nhập"
                            disabled
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                        <p class="text-xs text-gray-500 mt-0.5">Không thể thay đổi</p>
                    </div>

                    <!-- Avatar Field -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Avatar <span class="text-red-500">*</span></label>
                        <div class="flex items-center gap-3">
                            <img 
                                id="avatarPreview"
                                src="${user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "User")}&size=80&background=3b82f6&color=fff`}"
                                alt="Avatar preview"
                                class="w-16 h-16 rounded-lg object-cover border border-gray-300"
                            />
                            <input 
                                type="file" 
                                id="editAvatar" 
                                accept="image/*"
                                class="flex-1 text-xs file:px-2 file:py-1 file:text-xs file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                            />
                        </div>
                    </div>

                    <!-- Name Field -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Họ và tên <span class="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            id="editName" 
                            value="${user.fullName || ""}"
                            placeholder="Nhập họ và tên"
                            maxlength="50"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <!-- Address Field -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Địa chỉ</label>
                        <input 
                            type="text" 
                            id="editLocation" 
                            value="${user.address || ""}"
                            placeholder="Nhập địa chỉ"
                            maxlength="100"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <!-- Phone Field -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Số điện thoại</label>
                        <input 
                            type="tel" 
                            id="editPhone" 
                            value="${user.phone || ""}"
                            placeholder="Nhập số điện thoại"
                            maxlength="20"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <!-- Hobbies Field -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Sở thích</label>
                        <textarea 
                            id="editHobbies" 
                            rows="3"
                            placeholder="Nhập sở thích của bạn"
                            maxlength="200"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                        >${user.hobbies || ""}</textarea>
                        <p class="text-xs text-gray-500 mt-0.5"><span id="hobbiesCharCount">0</span>/200 ký tự</p>
                    </div>

                    <!-- Modal Footer -->
                    <div class="flex gap-2 pt-3 border-t border-gray-200">
                        <button 
                            type="button" 
                            id="cancelEditBtn" 
                            class="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            class="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

  const layoutContent = Layout(content);

  // Thiết lập event listeners sau khi DOM được render
  setTimeout(() => {
    setupEditProfileModal(user);
  }, 100);

  return layoutContent;
};

/**
 * Validate Special Characters
 * @param {string} str - String to validate
 * @returns {boolean} True if no special characters
 */
function validateNoSpecialCharacters(str) {
  const specialCharRegex = /[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/g;
  return !specialCharRegex.test(str);
}

/**
 * Handle Update Profile
 * @param {Object} formData - Updated user data
 */
const handleUpdateProfile = async (formData) => {
  try {
    showLoading();

    // Gọi API update profile
    const response = await userController.updateUserProfile(formData);

    if (response) {
      // Reload user info từ server
      await userController.loadCurrentUser();

      hideLoading();

      // Reload trang để cập nhật Header, Sidebar và thông tin user
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      hideLoading();
      showToast("Cập nhật profile thất bại", "error");
    }
  } catch (error) {
    hideLoading();
    showToast(error.message || "Lỗi khi cập nhật profile", "error");
  }
};

/**
 * Setup Edit Profile Modal
 *
 */
function setupEditProfileModal() {
  const editBtn = document.getElementById("editProfileBtn");
  const modal = document.getElementById("editProfileModal");
  const closeBtn = document.getElementById("closeEditModal");
  const cancelBtn = document.getElementById("cancelEditBtn");
  const form = document.getElementById("editProfileForm");
  const avatarInput = document.getElementById("editAvatar");
  const avatarPreview = document.getElementById("avatarPreview");
  const hobbiesInput = document.getElementById("editHobbies");
  const hobbiesCharCount = document.getElementById("hobbiesCharCount");
  const nameInput = document.getElementById("editName");
  const locationInput = document.getElementById("editLocation");
  const phoneInput = document.getElementById("editPhone");

  if (!editBtn || !modal) return;

  // Mở modal khi click nút Chỉnh sửa
  editBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });

  // Đóng modal khi click nút đóng
  closeBtn?.addEventListener("click", closeModal);

  // Đóng modal khi click nút Hủy
  cancelBtn?.addEventListener("click", closeModal);

  // Đóng modal khi click ngoài modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Xử lý avatar upload
  if (avatarInput && avatarPreview) {
    avatarInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          avatarPreview.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Cập nhật số ký tự Sở thích
  if (hobbiesInput && hobbiesCharCount) {
    hobbiesInput.addEventListener("input", () => {
      hobbiesCharCount.textContent = hobbiesInput.value.length;
      if (hobbiesInput.value.length > 200) {
        hobbiesInput.value = hobbiesInput.value.substring(0, 200);
        hobbiesCharCount.textContent = "200";
      }
    });
    // Set initial count
    hobbiesCharCount.textContent = hobbiesInput.value.length;
  }

  // Xử lý submit form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameValue = nameInput.value.trim();
    const locationValue = locationInput.value.trim();
    const phoneValue = phoneInput.value.trim();
    const hobbiesValue = hobbiesInput.value.trim();

    // Validation - Tên bắt buộc
    if (!nameValue) {
      showToast("Vui lòng nhập họ và tên", "error");
      nameInput.focus();
      return;
    }

    // Validate special characters trong tên
    if (!validateNoSpecialCharacters(nameValue)) {
      showToast("Họ và tên không được chứa ký tự đặc biệt", "error");
      nameInput.focus();
      return;
    }

    // Validate địa chỉ
    if (locationValue && !validateNoSpecialCharacters(locationValue)) {
      showToast("Địa chỉ không được chứa ký tự đặc biệt", "error");
      locationInput.focus();
      return;
    }

    // Validate phone - chỉ cho phép số, dấu cách, dấu +, dấu -
    if (phoneValue && !/^[\d\s+\-()]*$/.test(phoneValue)) {
      showToast("Số điện thoại chỉ được chứa số và các ký tự: + - ( )", "error");
      phoneInput.focus();
      return;
    }

    // Validate hobbies
    if (hobbiesValue && !validateNoSpecialCharacters(hobbiesValue)) {
      showToast("Sở thích không được chứa ký tự đặc biệt", "error");
      hobbiesInput.focus();
      return;
    }

    const formData = new FormData();
    formData.append("fullName", nameValue ?? "");
    formData.append("address", locationValue ?? "");
    formData.append("phone", phoneValue ?? "");
    formData.append("hobby", hobbiesValue ?? "");

    // Xử lý file avatar nếu có
    const avatarFile = avatarInput.files[0];
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    closeModal();
    await handleUpdateProfile(formData);
  });

  // Function to close modal
  function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

export default ProfilePage;
