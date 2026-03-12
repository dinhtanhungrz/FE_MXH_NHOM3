import { Layout } from "../../components/Layout.js";
import { authState } from "../../../state/authState.js";
import { hideLoading, showLoading } from "../../../core/utils/helpers.js";
import postController from "../../../controllers/postController.js";

/**
 * Home Page
 */
export const HomePage = async () => {
  const user = authState.getUser();

  const isAuthenticated = authState.isAuthenticated();

  if (!isAuthenticated) {
    // Landing page cho user chưa login
    return `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <!-- Hero Section -->
                <div class="container mx-auto px-4 py-20">
                    <div class="max-w-6xl mx-auto">
                        <div class="grid md:grid-cols-2 gap-12 items-center">
                            <!-- Left Content -->
                            <div>
                                <h1 class="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                                    Kết nối với
                                    <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        bạn bè
                                    </span>
                                    <br />và gia đình
                                </h1>
                                <p class="mt-6 text-xl text-gray-600">
                                    Chia sẻ khoảnh khắc, kết nối mọi người và khám phá những điều mới mẻ mỗi ngày.
                                </p>
                                <div class="mt-8 flex flex-col sm:flex-row gap-4">
                                    <a 
                                        href="#/register" 
                                        class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition text-center"
                                    >
                                        Đăng ký miễn phí
                                    </a>
                                    <a 
                                        href="#/login" 
                                        class="px-4 py-2 bg-white text-gray-800 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition text-center"
                                    >
                                        Đăng nhập
                                    </a>
                                    <a 
                                        href="#/newfeeds" 
                                        class="px-4 py-2 bg-white text-gray-800 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition text-center"
                                    >
                                        Xem dòng thời gian
                                    </a>
                                </div>
                            </div>

                            <!-- Right Content - Illustration -->
                            <div class="relative">
                                <div class="relative z-10">
                                    <img 
                                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
                                        alt="People connecting"
                                        class="rounded-2xl shadow-2xl"
                                    />
                                </div>
                                <div class="absolute -bottom-6 -right-6 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
                                <div class="absolute -top-6 -left-6 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Features Section -->
                <div class="bg-white py-20">
                    <div class="container mx-auto px-4">
                        <div class="max-w-6xl mx-auto">
                            <h2 class="text-4xl font-bold text-center text-gray-900 mb-16">
                                Tính năng nổi bật
                            </h2>
                            <div class="grid md:grid-cols-3 gap-8">
                                <!-- Feature 1 -->
                                <div class="text-center p-6">
                                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">Kết nối bạn bè</h3>
                                    <p class="text-gray-600">Tìm kiếm và kết nối với bạn bè, đồng nghiệp từ khắp nơi</p>
                                </div>

                                <!-- Feature 2 -->
                                <div class="text-center p-6">
                                    <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">Chia sẻ khoảnh khắc</h3>
                                    <p class="text-gray-600">Đăng ảnh, video và câu chuyện của bạn với mọi người</p>
                                </div>

                                <!-- Feature 3 -->
                                <div class="text-center p-6">
                                    <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">Trò chuyện</h3>
                                    <p class="text-gray-600">Nhắn tin và gọi điện video với bạn bè mọi lúc mọi nơi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  // News Feed cho user đã login
  const content = `
        <div class="max-w-4xl mx-auto">
            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Main Feed -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Create Post -->
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <div class="flex space-x-3">
                            <img 
                                src="${user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "User")}&background=3b82f6&color=fff`}"
                                alt="${user?.username}"
                                class="w-12 h-12 rounded-full object-cover"
                            />
                            <button 
                                id="openCreatePostBtn"
                                class="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition cursor-pointer"
                            >
                                Bạn đang nghĩ gì, ${user?.name || user?.username}?
                            </button>
                        </div>
                        <div class="flex justify-around mt-4 pt-4 border-t border-gray-200">
                            <button id="videoLiveBtn" class="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition">
                                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                                <span class="font-medium">Video trực tiếp</span>
                            </button>
                            <button id="imagePostBtn" class="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition">
                                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span class="font-medium">Ảnh/Video</span>
                            </button>
                            <button id="feelingBtn" class="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition">
                                <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span class="font-medium">Cảm xúc</span>
                            </button>
                        </div>
                    </div>

                    <!-- Sample Posts -->
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-3">
                                <img 
                                    src="https://ui-avatars.com/api/?name=Demo+User&background=ef4444&color=fff"
                                    alt="Demo User"
                                    class="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <p class="font-semibold text-gray-900">Demo User</p>
                                    <p class="text-sm text-gray-500">2 giờ trước · 🌍</p>
                                </div>
                            </div>
                            <button class="text-gray-400 hover:text-gray-600">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <p class="text-gray-800 mb-4">
                            Chào mừng đến với mạng xã hội! Đây là một bài post mẫu. Bạn có thể tạo bài viết mới, thích, bình luận và chia sẻ. 🎉
                        </p>
                        
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop"
                            alt="Post"
                            class="w-full rounded-lg mb-4"
                        />
                        
                        <!-- Post Actions -->
                        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                            <button class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition px-4 py-2 rounded-lg hover:bg-blue-50">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                                </svg>
                                <span class="font-medium">Thích</span>
                            </button>
                            <button class="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition px-4 py-2 rounded-lg hover:bg-green-50">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                                <span class="font-medium">Bình luận</span>
                            </button>
                            <button class="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition px-4 py-2 rounded-lg hover:bg-purple-50">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                </svg>
                                <span class="font-medium">Chia sẻ</span>
                            </button>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div class="text-center py-12">
                        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p class="text-gray-500 text-lg">Bạn đã xem hết bài viết mới</p>
                    </div>
                </div>

                <!-- Right Sidebar -->
                <div class="hidden lg:block space-y-6">
                    <!-- Sponsored -->
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h3 class="font-bold text-gray-900 mb-4">Được tài trợ</h3>
                        <div class="space-y-4">
                            <div class="flex items-start space-x-3">
                                <img 
                                    src="https://ui-avatars.com/api/?name=Brand&background=6366f1&color=fff"
                                    alt="Brand"
                                    class="w-16 h-16 rounded-lg"
                                />
                                <div class="flex-1">
                                    <p class="font-semibold text-gray-900">Brand Name</p>
                                    <p class="text-sm text-gray-600">Khám phá sản phẩm mới</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Friend Suggestions -->
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h3 class="font-bold text-gray-900 mb-4">Gợi ý kết bạn</h3>
                        <div class="space-y-4">
                            ${[1, 2, 3]
                              .map(
                                (i) => `
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-3">
                                        <img 
                                            src="https://ui-avatars.com/api/?name=User+${i}&background=random"
                                            alt="User ${i}"
                                            class="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p class="font-semibold text-gray-900 text-sm">User ${i}</p>
                                            <p class="text-xs text-gray-500">3 bạn chung</p>
                                        </div>
                                    </div>
                                    <button class="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition">
                                        Kết bạn
                                    </button>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  setTimeout(() => {
    initializeHomePage();
  }, 100);

  return Layout(content);
};

const initializeHomePage = () => {
  const openBtn = document.getElementById("openCreatePostBtn");

  if (!openBtn) return;

  openBtn.addEventListener("click", () => {
    // Nếu modal chưa tồn tại thì append vào body
    let modal = document.getElementById("createPostModal");

    if (!modal) {
      document.body.insertAdjacentHTML("beforeend", CreatePostModal());

      initializePostModal(); // gắn event close, submit...
    }

    // Hiển thị modal
    const modalElement = document.getElementById("createPostModal");
    modalElement.classList.remove("hidden");
    modalElement.classList.add("flex"); // nếu modal dùng flex để center
  });
};


const CreatePostModal = () => {
  const user = authState.getUser();

  return `
    <div 
      id="createPostModal"
      class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-fadeIn">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Tạo bài viết</h2>
          <button 
            id="closeCreatePostModal"
            class="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <div class="flex items-center space-x-3 mb-4">
            <img 
              id="createPostAvatar"
              src="${user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "User")}&background=3b82f6&color=fff`}"
              class="w-12 h-12 rounded-full"
            />
            <div>
              <p id="createPostUsername" class="font-semibold text-gray-900">
                ${user?.username || "User"}
              </p>
              <select 
                id="postPrivacy"
                class="text-sm bg-gray-100 rounded-lg px-2 py-1 mt-1 outline-none"
              >
                <option value="PUBLIC">🌍 Công khai</option>
                <option value="FRIENDS_ONLY">👥 Bạn bè</option>
                <option value="ONLY_ME">🔒 Chỉ mình tôi</option>
              </select>
            </div>
          </div>

          <textarea
            id="postContent"
            rows="4"
            placeholder="Bạn đang nghĩ gì?"
            class="w-full resize-none text-lg outline-none placeholder-gray-400"
          ></textarea>

          <!-- Preview Image -->
            <div id="postImagePreviewWrapper" 
                class="mt-4 hidden grid grid-cols-2 gap-2">
            </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 space-y-4">
          
          <div class="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
            <span class="font-medium text-gray-700">Thêm vào bài viết</span>
            <div class="flex items-center space-x-3">
              
              <label class="cursor-pointer">
                <input 
                  type="file" 
                  id="postImageInput" 
                  multiple
                  accept="image/*,video/*"
                  class="hidden"
                />
                <svg class="w-6 h-6 text-green-500 hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                  </path>
                </svg>
              </label>

              <button id="addFeelingBtn">
                <svg class="w-6 h-6 text-yellow-500 hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                  </path>
                </svg>
              </button>

            </div>
          </div>

          <button
            id="submitPostBtn"
            class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            disabled
          >
            Đăng
          </button>

        </div>
      </div>
    </div>
  `;
};

const initializePostModal = () => {
  const modal = document.getElementById("createPostModal");
  if (!modal) return;

  const closeBtn = document.getElementById("closeCreatePostModal");
  const contentInput = document.getElementById("postContent");
  const submitBtn = document.getElementById("submitPostBtn");
  const imageInput = document.getElementById("postImageInput");
  const previewWrapper = document.getElementById("postImagePreviewWrapper");

  // ===== CLOSE MODAL FUNCTION =====
  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");

    // reset form
    contentInput.value = "";
    imageInput.value = "";
    previewWrapper.classList.add("hidden");
    submitBtn.disabled = true;
  };

  // ===== ENABLE/DISABLE SUBMIT =====
  const toggleSubmitState = () => {
    const hasText = contentInput.value.trim().length > 0;
    const hasImage = imageInput.files && imageInput.files.length > 0;

    submitBtn.disabled = !(hasText || hasImage);
  };

  // ===== EVENTS =====

  // Close button
  closeBtn.addEventListener("click", closeModal);

  // Click overlay để đóng
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Text input
  contentInput.addEventListener("input", toggleSubmitState);

  imageInput.addEventListener("change", () => {
    const files = Array.from(imageInput.files || []);

    // Clear preview cũ
    previewWrapper.innerHTML = "";

    if (files.length === 0) {
      previewWrapper.classList.add("hidden");
      toggleSubmitState();
      return;
    }

    previewWrapper.classList.remove("hidden");

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const url = e.target.result;

        let element;

        if (file.type.startsWith("image/")) {
          element = document.createElement("img");
          element.src = url;
          element.className = "w-full rounded-lg";
        } else if (file.type.startsWith("video/")) {
          element = document.createElement("video");
          element.src = url;
          element.controls = true;
          element.className = "w-full rounded-lg";
        }

        previewWrapper.appendChild(element);
      };

      reader.readAsDataURL(file);
    });

    toggleSubmitState();
  });

  submitBtn.addEventListener("click", async () => {
    const content = contentInput.value.trim();
    const visibility = document.getElementById("postPrivacy").value;
    const files = Array.from(imageInput.files || []);

    try {
      submitBtn.disabled = true;
      submitBtn.innerText = "Đang đăng bài...";

      await postController.createNewPost(content, visibility, files);

      closeModal();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi đăng bài");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = "Đăng";
    }
  });
};

export default HomePage;
