import Layout from "../../components/Layout.js";
import { getGuestFeed } from "../../../controllers/postController.js";
import { renderUserLink, renderAvatar } from "../../viewHelpers.js";

export const GuestHome = async () => {  
let posts = [];

try {
const res = await getGuestFeed();
posts = res.data || [];
console.log("Guest posts:", posts);
} catch (e) {
console.error("Guest feed error:", e);
}

const content = `
<div class="max-w-4xl mx-auto">
    <div class="grid lg:grid-cols-3 gap-6">

        <!-- FEED -->
        <div class="lg:col-span-2 space-y-6">

            <!-- Fake Create Post -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
                <div class="flex space-x-3">
                    <img src="https://ui-avatars.com/api/?name=Guest&background=ccc" class="w-12 h-12 rounded-full" />
                    <button onclick="window.location.hash='#/login'"
                        class="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition">
                        Đăng nhập để đăng bài...
                    </button>
                </div>
            </div>

            <!-- REAL POSTS -->
            <div class="space-y-6">
                ${
                posts.length === 0
                ? `<p class="text-center text-gray-500">Chưa có bài viết</p>`
                : posts.map(p => `
                <div class="bg-white p-4 rounded-xl shadow">
                    <div class="flex items-center gap-3 mb-2">
                        ${renderAvatar({ avatar: p.authorAvatarUrl, username: p.authorName }, 'w-10 h-10')}
                        <div>
                            ${renderUserLink({ id: p.authorId, fullName: p.authorName, username: p.authorName })}
                            <p class="text-xs text-gray-400">${new Date(p.createdAt).toLocaleString()}</p>
                        </div>
                    </div>

                    <p class="text-gray-700 mb-2">${p.content || ""}</p>

                    ${
                    p.imageUrls && p.imageUrls.length > 0
                    ? `<div class="grid grid-cols-2 gap-2 mb-2">
                        ${p.imageUrls.map(img => `<img src="${img.url}" class="rounded-lg" />`).join("")}
                    </div>`
                    : ""
                    }

                    <div class="text-sm text-gray-500 flex gap-4">
                        <span>👍 ${p.likesCount}</span>
                        <span>💬 ${p.commentsCount}</span>
                    </div>

                    <button onclick="window.location.hash='#/login'" class="text-blue-500 text-sm mt-2">
                        Đăng nhập để tương tác
                    </button>
                </div>
                `).join("")
                }
            </div>
        </div>

        <!-- SIDEBAR -->
        <div class="hidden lg:block space-y-6">
            <div class="bg-white rounded-2xl shadow-lg p-6">
                <h3 class="font-bold mb-4">Chào bạn 👋</h3>
                <p class="text-gray-600 mb-4">
                    Đăng nhập để kết nối với bạn bè và xem nội dung đầy đủ
                </p>

                <a href="#/login" class="block w-full text-center bg-blue-500 text-white py-2 rounded-lg mb-2">
                    Đăng nhập
                </a>

                <a href="#/register" class="block w-full text-center border py-2 rounded-lg">
                    Đăng ký
                </a>
            </div>
        </div>

    </div>
</div>
`;

return Layout(content, { showSidebar: true });
};

export default GuestHome;