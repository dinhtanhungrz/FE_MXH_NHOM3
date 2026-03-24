import { Layout } from "../../components/Layout.js";
import notificationController from "../../../controllers/notificationController.js";
import { router } from "../../../core/router/router.js";
import { renderNotificationItem } from "../../components/NotificationItem.js";

let loading = false;

const setupEvents = () => {
    document.querySelectorAll(".notification-item").forEach((item) => {
        item.onclick = async () => {
            const id = item.dataset.id;
            const entityType = item.dataset.entityType;
            const postId = item.dataset.postId;
            const entityId = item.dataset.entityId;

            try {
                // Mark as read immediately in UI
                await notificationController.markAsRead(id);
                
                item.classList.remove("bg-blue-50", "border-blue-500", "font-semibold");
                item.classList.add("border-transparent");
                const dot = item.querySelector(".unread-dot");
                if (dot) dot.remove();
                const text = item.querySelector(".text-sm");
                if (text) text.classList.remove("font-semibold");

                // Navigation logic (consistent with other parts if possible, but keeping current if specific)
                if (entityType === "POST") {
                    router.navigate(`/posts/${postId}?postId=${postId}`);
                } else if (entityType === "COMMENT") {
                    router.navigate(`/posts/${postId}?postId=${postId}&commentId=${entityId}`);
                } else {
                    // Default fallback from NotificationItem logic
                    router.navigate(`/posts/${postId}?postId=${postId}`);
                }
            } catch (e) {
                console.error("Mark read error", e);
            }
        };
    });
};

/**
 * MAIN PAGE
 */
export const NotificationsPage = async () => {
    loading = false;
    
    setTimeout(() => init(), 50);
    const content = `
    <div class="max-w-3xl mx-auto px-4 py-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Thông báo</h1>
            <p class="text-sm text-gray-500 mt-1">Cập nhật những hoạt động mới nhất của bạn</p>
        </div>

        <div id="notificationContainer" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
        </div>

        <div id="loading" class="hidden text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
            <p class="text-gray-500 mt-2">Đang tải...</p>
        </div>
    </div>
    `;

    return Layout(content);
};

async function init() {
    await load();
}

async function load() {
    if (loading) return;
    loading = true;

    const container = document.getElementById("notificationContainer");
    const loadingEl = document.getElementById("loading");

    if (!container) return;

    loadingEl.classList.remove("hidden");

    try {
        let notifications = await notificationController.getNotifications();
        notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (!notifications.length) {
            container.innerHTML = `
            <div class="text-center py-20">
                <div class="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                </div>
                <p class="text-gray-400">Không có thông báo mới</p>
            </div>
            `;
            loadingEl.classList.add("hidden");
            loading = false;
            return;
        }

        container.innerHTML = notifications.map(renderNotificationItem).join("");
        setupEvents();

    } catch (e) {
        console.error("Load notifications error:", e);
        container.innerHTML = `
        <div class="text-center py-10">
            <p class="text-red-400">Lỗi tải thông báo. Vui lòng thử lại sau.</p>
        </div>
        `;
    }

    loadingEl.classList.add("hidden");
    loading = false;
}

    export default NotificationsPage;