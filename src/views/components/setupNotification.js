import notificationController from "../../controllers/notificationController.js";
import { renderNotificationItem } from "./NotificationItem.js";
import { router } from "../../core/router/router.js";

let isInitialized = false; // 🔥 tránh add event nhiều lần

export const setupNotification = async () => {
  if (isInitialized) return;
  isInitialized = true;

  const btn = document.getElementById("notificationBtn");
  const dropdown = document.getElementById("notificationDropdown");
  const list = document.getElementById("notificationList");
  const badge = document.getElementById("notificationBadge");

  if (!btn) return;

  // Load unread count
  const loadCount = async () => {
    try {
      const count = await notificationController.getUnreadCount();
      if (count > 0) {
        badge.innerText = count;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    } catch (e) {
      console.error("Load count error", e);
    }
  };

  await loadCount();

  // Toggle dropdown
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();

    dropdown.classList.toggle("hidden");

    list.innerHTML = `<p class="text-center py-4 text-gray-400">Đang tải...</p>`;

    try {
      let data = await notificationController.getNotifications();

      // sort newest
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (!data.length) {
        list.innerHTML = `<p class="text-center py-4 text-gray-400">Không có thông báo</p>`;
        return;
      }

      list.innerHTML = data.map(renderNotificationItem).join("");

      setupClickNotification(loadCount);

    } catch (e) {
      list.innerHTML = `<p class="text-center py-4 text-red-400">Lỗi tải dữ liệu</p>`;
    }
  });

  // Click ngoài => đóng dropdown (giống FB)
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
};

const setupClickNotification = (reloadCount) => {
  document.querySelectorAll(".notification-item").forEach((item) => {
    item.onclick = async () => {
      const id = item.dataset.id;
      const type = item.dataset.entityType;
      const entityId = item.dataset.entityId;

      try {
        await notificationController.markAsRead(id);

        item.classList.remove("bg-blue-50");

        await reloadCount();

        // 👉 điều hướng
        if (type === "POST" || type === "COMMENT") {
          router.navigate(`/posts/${entityId}`);
        }

      } catch (e) {
        console.error("Mark read error", e);
      }
    };
  });
};