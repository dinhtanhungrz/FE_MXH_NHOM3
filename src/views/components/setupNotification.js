import notificationController from "../../controllers/notificationController.js";
import { renderNotificationItem } from "./NotificationItem.js";
import { router } from "../../core/router/router.js";
import authState from "../../state/authState.js";

let globalListenersAdded = false;

export const setupNotification = async () => {
  const btn = document.getElementById("notificationBtn");
  const dropdown = document.getElementById("notificationDropdown");
  const list = document.getElementById("notificationList");
  const badge = document.getElementById("notificationBadge");
  const popupUnread = document.getElementById("popupUnreadCount");
  const closeBtn = document.getElementById("closeNotificationBtn");
  const viewAllNotifiBtn = document.getElementById("viewAllNotifications");

  if(viewAllNotifiBtn){
    viewAllNotifiBtn.addEventListener("click", () => {
      window.location.hash = "#/notifications";
    });
  }
  
  if (!btn) return;

  // Load unread count - Luôn chạy khi Header render lại
  const loadCount = async () => {
    try {
      const count = await notificationController.getUnreadCount();
      if (count > 0) {
        badge.innerText = count > 99 ? "99+" : count;
        badge.classList.remove("hidden");
        if (popupUnread) {
          popupUnread.innerText = `${count} mới`;
          popupUnread.classList.remove("hidden");
        }
      } else {
        badge.classList.add("hidden");
        if (popupUnread) {
          popupUnread.classList.add("hidden");
        }
      }
    } catch (e) {
      console.error("Load count error", e);
    }
  };

  await loadCount();

  // Gán sự kiện cho các nút bấm (dùng .onclick để đảm bảo tính duy nhất trên element mới)
  btn.onclick = async (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");

    if (!dropdown.classList.contains("hidden")) {
      list.innerHTML = `<p class="text-center py-4 text-gray-400">Đang tải...</p>`;
      try {
        let data = await notificationController.getNotifications();
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (!data.length) {
          list.innerHTML = `<p class="text-center py-4 text-gray-400">Không có thông báo</p>`;
        } else {
          list.innerHTML = data.map(renderNotificationItem).join("");
          setupClickNotification(loadCount);
        }
      } catch (e) {
        list.innerHTML = `<p class="text-center py-4 text-red-400">Lỗi tải dữ liệu</p>`;
      }
    }
  };

  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      dropdown.classList.add("hidden");
    };
  }

  // Global listeners - Chỉ add 1 lần duy nhất trên document
  if (!globalListenersAdded) {
    document.addEventListener("click", (e) => {
      // Tìm lại element trong DOM tại thời điểm click vì Header có thể đã render lại
      const currentDropdown = document.getElementById("notificationDropdown");
      const currentBtn = document.getElementById("notificationBtn");
      
      if (currentDropdown && currentBtn && 
          !currentDropdown.contains(e.target) && 
          !currentBtn.contains(e.target)) {
        currentDropdown.classList.add("hidden");
      }
    });
    globalListenersAdded = true;
    console.log("✓ Global notification listeners initialized");
  }
};

const setupClickNotification = (reloadCount) => {
  document.querySelectorAll(".notification-item").forEach((item) => {
    item.onclick = async () => {
      const id = item.dataset.id;
      const type = item.dataset.type;
      const statusOwnerId = item.dataset.statusOwnerId;
      const postId = item.dataset.postId;
      const entityId = item.dataset.entityId;
      const currentUserId = authState.getUser()?.id;

      try {
        await notificationController.markAsRead(id);
        item.classList.remove("bg-blue-50", "border-blue-500", "font-semibold");
        item.classList.add("border-transparent");
        const dot = item.querySelector(".unread-dot");
        if (dot) dot.remove();
        const text = item.querySelector(".text-sm");
        if (text) text.classList.remove("font-semibold");
        await reloadCount();

        // New redirection logic:
        if (type === "LIKE_STATUS" || type === "COMMENT_STATUS") {
          // Related to own post -> go to own profile
          router.navigate(`/user-profile/${currentUserId}?postId=${postId}`);
        } else if (type === "LIKE_COMMENT") {
          // Other liked your comment -> go to status owner's profile
          if (statusOwnerId && statusOwnerId !== "null") {
            router.navigate(`/user-profile/${statusOwnerId}?postId=${postId}&commentId=${entityId}`);
          } else {
            router.navigate(`/posts/${postId}?commentId=${entityId}`);
          }
        } else if (type === "REPLY_COMMENT") {
            // Reply comment -> usually go to post
            router.navigate(`/posts/${postId}?postId=${postId}&commentId=${entityId}`);
        } else {
          // Default behavior
          router.navigate(`/posts/${postId}?postId=${postId}`);
        }
      } catch (e) {
        console.error("Mark read error", e);
      }
    };
  });
};