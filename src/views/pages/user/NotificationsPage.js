import { Layout } from "../../components/Layout.js";
import notificationController from "../../../controllers/notificationController.js";
import { router } from "../../../core/router/router.js";

let loading = false;

/**
* Format time
*/
const formatTimeAgo = (time) => {
const now = new Date();
const diff = Math.floor((now - new Date(time)) / 1000);

if (diff < 60) return `${diff}s`; if (diff < 3600) return `${Math.floor(diff / 60)} phút`; if (diff < 86400) return
    `${Math.floor(diff / 3600)} giờ`; return `${Math.floor(diff / 86400)} ngày`; }; const getMessage=(n)=> {
    switch (n.type) {
    case "POST_LIKE":
    return "đã thích bài viết của bạn";
    case "COMMENT_LIKE":
    return "đã thích bình luận của bạn";
    case "POST_COMMENT":
    return "đã bình luận bài viết của bạn";
    case "COMMENT_REPLY":
    return "đã trả lời bình luận của bạn";
    default:
    return "đã tương tác với bạn";
    }
    };

    const renderItem = (n) => {
    return `
    <div class="notification-item flex items-start space-x-3 p-4 rounded-xl cursor-pointer transition 
      ${!n.read ? " bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-100" }" data-id="${n.id}"
        data-entity-type="${n.entityType}"" data-entity-id="${n.entityId}">

        <img src="${n.actorAvatar}" class="w-12 h-12 rounded-full object-cover" />

        <div class="flex-1">
            <p class="text-sm text-gray-800">
                <strong>${n.actorName}</strong> ${getMessage(n)}
            </p>

            <div class="flex items-center justify-between mt-1">
                <span class="text-xs text-gray-500">${formatTimeAgo(n.createdAt)}</span>
                ${!n.read ? `<span class="w-2 h-2 bg-blue-500 rounded-full"></span>` : ""}
            </div>
        </div>
    </div>
    `;
    };

    const setupEvents = () => {
    document.querySelectorAll(".notification-item").forEach((item) => {
    item.onclick = async () => {
    const id = item.dataset.id;
    const type = item.dataset.entityType;
    const entityId = item.dataset.entityId;

    try {
    await notificationController.markAsRead(id);
    item.classList.remove("bg-blue-50");

    if (type === "POST" || type === "COMMENT") {
    router.navigate(`/posts/${entityId}`);
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
    <div class="max-w-3xl mx-auto">

        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h1 class="text-2xl font-bold">Thông báo</h1>
        </div>

        <div id="notificationContainer"></div>

        <div id="loading" class="hidden text-center py-4">
            Đang tải...
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
    <div class="text-center py-20 text-gray-400">
        Không có thông báo
    </div>
    `;
    return;
    }

    container.innerHTML = notifications.map(renderItem).join("");

    setupEvents();

    } catch (e) {
    console.error("Load notifications error:", e);

    container.innerHTML = `
    <div class="text-center text-red-400 py-10">
        Lỗi tải thông báo (có thể backend chậm hoặc timeout)
    </div>
    `;
    }

    loadingEl.classList.add("hidden");
    loading = false;
    }

    export default NotificationsPage;