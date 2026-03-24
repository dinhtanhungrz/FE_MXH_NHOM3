import { Layout } from "../../components/Layout.js";
import { authState } from "../../../state/authState.js";
import { hideLoading, showLoading } from "../../../core/utils/helpers.js";
import postController from "../../../controllers/postController.js";
import friendController from "../../../controllers/friendController.js";
import { renderPostCard, setupPostEventHandlers } from "../../components/PostCard.js";

/**
 * Transform API status response to PostCard format
 */
const transformStatusToPost = (status) => {
  return {
    id: status.id,
    content: status.content,
    createdAt: status.createdAt,
    updatedAt: status.updatedAt,
    visibility: status.visibility,
    imageUrls: status.imageUrls || [],
    likesCount: status.likesCount || 0,
    commentsCount: status.commentsCount || 0,
    like: status.like === true,
    user: {
      id: status.authorId,
      username: status.authorName,
      fullName: status.authorName,
      avatarUrl: status.authorAvatarUrl,
    },
  };
};

/**
 * Render HTML cho từng item gợi ý kết bạn
 */
const renderSuggestionItem = (u) => {
  const avatar =
    u.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username || "User")}&background=random`;

  const profileLink = `#/user-profile/${u.id}`;

  return `
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <a href="${profileLink}" class="block hover:opacity-80 transition">
                <img 
                    src="${avatar}" 
                    alt="${u.username}" 
                    class="w-10 h-10 rounded-full object-cover border border-gray-100"
                />
            </a>
            <div>
                <a href="${profileLink}" class="hover:underline">
                    <p class="font-semibold text-gray-900 text-sm">${u.fullName || u.username}</p>
                </a>
                <p class="text-xs text-gray-500">${u.mutualFriends || 0} bạn chung</p>
            </div>
        </div>
        <button 
            data-user-id="${u.id}"
            class="add-friend-btn px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition shadow-sm"
        >
            Kết bạn
        </button>
    </div>
  `;
};

/**
 * Home Page
 */
export const HomePage = async () => {
  const user = authState.getUser();
  const isAuthenticated = authState.isAuthenticated();

  if (!isAuthenticated) {
    // Landing page cho user chưa login (Giữ nguyên logic cũ)
    return renderLandingPage();
  }

  // GỌI DATA SONG SONG: News Feed và Gợi ý kết bạn
  const [statuses, suggestions] = await Promise.all([
    postController.getNewFeedsPublicAndFriends(),
    friendController.getSuggestions(),
  ]);

  const content = `
        <div class="max-w-4xl mx-auto">
            <div class="grid lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
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
                                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span class="font-medium">Video trực tiếp</span>
                            </button>
                            <button id="imagePostBtn" class="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition">
                                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span class="font-medium">Ảnh/Video</span>
                            </button>
                            <button id="feelingBtn" class="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition">
                                <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span class="font-medium">Cảm xúc</span>
                            </button>
                        </div>
                    </div>

                    <div class="posts-feed space-y-6">
                        ${
                          statuses && statuses.length > 0
                            ? statuses
                                .map((status) => renderPostCard(transformStatusToPost(status)))
                                .join("")
                            : `<div class="text-center py-12"><p class="text-gray-500 text-lg">Chưa có bài viết nào</p></div>`
                        }
                    </div>
                </div>

                <div class="hidden lg:block space-y-6">
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h3 class="font-bold text-gray-900 mb-4">Được tài trợ</h3>
                        <div class="space-y-4">
                            <div class="flex items-start space-x-3">
                                <img src="https://ui-avatars.com/api/?name=CodeGym&background=6366f1&color=fff" class="w-16 h-16 rounded-lg"/>
                                <div class="flex-1">
                                    <p class="font-semibold text-gray-900">CodeGym</p>
                                    <p class="text-sm text-gray-600">Khám phá lộ trình Java Fullstack</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
                        <h3 class="font-bold text-gray-900 mb-4">Gợi ý kết bạn</h3>
                        <div id="suggestionsList" class="space-y-4">
                            ${
                              suggestions && suggestions.length > 0
                                ? suggestions.map((u) => renderSuggestionItem(u)).join("")
                                : `<p class="text-gray-500 text-sm">Không có gợi ý mới</p>`
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  setTimeout(() => {
    initializeHomePage();

    // Gắn sự kiện kết bạn cho Sidebar
    const suggestionsList = document.getElementById("suggestionsList");
    if (suggestionsList) {
      setupSuggestionEvents(suggestionsList);
    }

    // Setup post event handlers
    const feedContainer = document.querySelector(".posts-feed");
    if (feedContainer) {
      setupPostEventHandlers(feedContainer);
    }
  }, 100);

  return Layout(content);
};

/**
 * Gắn sự kiện Click Delegation cho danh sách gợi ý
 */
const setupSuggestionEvents = (container) => {
  container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".add-friend-btn");
    if (btn) {
      const userId = btn.dataset.userId;
      await friendController.handleAddFriend(userId, btn);
    }
  });
};

const initializeHomePage = () => {
  const openBtn = document.getElementById("openCreatePostBtn");
  if (!openBtn) return;
  openBtn.addEventListener("click", () => {
    let modal = document.getElementById("createPostModal");
    if (!modal) {
      document.body.insertAdjacentHTML("beforeend", CreatePostModal());
      initializePostModal();
    }
    const modalElement = document.getElementById("createPostModal");
    modalElement.classList.remove("hidden");
    modalElement.classList.add("flex");
  });
};

const CreatePostModal = () => {
  const user = authState.getUser();
  return `
    <div id="createPostModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-fadeIn">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Tạo bài viết</h2>
          <button id="closeCreatePostModal" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
        </div>
        <div class="px-6 py-4">
          <div class="flex items-center space-x-3 mb-4">
            <img src="${user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "User")}&background=3b82f6&color=fff`}" class="w-12 h-12 rounded-full" />
            <div>
              <p class="font-semibold text-gray-900">${user?.username || "User"}</p>
              <select id="postPrivacy" class="text-sm bg-gray-100 rounded-lg px-2 py-1 mt-1 outline-none">
                <option value="PUBLIC">🌍 Công khai</option>
                <option value="FRIENDS_ONLY">👥 Bạn bè</option>
                <option value="ONLY_ME">🔒 Chỉ mình tôi</option>
              </select>
            </div>
          </div>
          <textarea id="postContent" rows="4" placeholder="Bạn đang nghĩ gì?" class="w-full resize-none text-lg outline-none placeholder-gray-400"></textarea>
          <div id="postImagePreviewWrapper" class="mt-4 hidden grid grid-cols-2 gap-2"></div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 space-y-4">
          <div class="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
            <span class="font-medium text-gray-700">Thêm vào bài viết</span>
            <div class="flex items-center space-x-3">
              <label class="cursor-pointer">
                <input type="file" id="postImageInput" multiple accept="image/*,video/*" class="hidden"/>
                <svg class="w-6 h-6 text-green-500 hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </label>
            </div>
          </div>
          <button id="submitPostBtn" class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50" disabled>Đăng</button>
        </div>
      </div>
    </div>`;
};

const initializePostModal = () => {
  // ... Giữ nguyên toàn bộ logic Close/Preview/Submit cũ của bạn ...
};

// Helper cho Landing Page
const renderLandingPage = () => {
  window.location.href = "#/login";
};

export default HomePage;
