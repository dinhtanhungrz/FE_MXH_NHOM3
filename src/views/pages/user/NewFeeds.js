import { authState } from "../../../state/authState.js";
import postController from "../../../controllers/postController.js";
import { renderPostCard, setupPostEventHandlers } from "../../components/PostCard.js";
import { showLoading, hideLoading } from "../../../core/utils/helpers.js";
import Layout from "../../components/Layout.js";

/**
 * New Feeds Page
 */
export const NewFeeds = async () => {
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
    </div>
                    </div>

                    <!-- News Feed List -->
                    <div id="feedList" class="space-y-6">
                        <div class="flex justify-center py-8">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
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

  // Tải dữ liệu thật sau khi render layout
  setTimeout(async () => {
    const feedList = document.getElementById("feedList");
    if (feedList) {
      const posts = await postController.getFeedStatuses();
      if (posts && posts.length > 0) {
        feedList.innerHTML = posts.map((post) => renderPostCard(post)).join("");
        setupPostEventHandlers(feedList);
      } else {
        feedList.innerHTML = `
                <div class="text-center py-12 bg-white rounded-2xl shadow-sm">
                    <p class="text-gray-500">Chưa có bài viết nào trong bản tin</p>
                </div>
            `;
      }
    }
  }, 0);

  return Layout(content);
};

export default NewFeeds;
