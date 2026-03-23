export const renderNotificationItem = (n) => {
  return `
    <div 
      class="notification-item flex space-x-3 p-3 hover:bg-gray-100 cursor-pointer ${!n.read ? "bg-blue-50" : ""}"
      data-id="${n.id}"
      data-entity-type="${n.entityType}"
      data-entity-id="${n.entityId}"
    >
      <img src="${n.actorAvatar}" class="w-10 h-10 rounded-full object-cover" />
      
      <div class="flex-1">
        <p class="text-sm text-gray-800">
          <strong>${n.actorName}</strong> ${getMessage(n)}
        </p>
        <span class="text-xs text-gray-500">${formatTime(n.createdAt)}</span>
      </div>

      ${!n.read ? `<div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>` : ""}
    </div>
  `;
};

const getMessage = (n) => {
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

const formatTime = (time) => {
  return new Date(time).toLocaleString();
};