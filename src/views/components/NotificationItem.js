export const renderNotificationItem = (n) => {
  const isUnread = !n.read;
  return `
    <div 
      class="notification-item flex space-x-3 p-3 hover:bg-gray-100 transition-all cursor-pointer ${
        isUnread ? "bg-blue-50" : "bg-white border-l-4 border-transparent"
      }"
      data-id="${n.id}"
      data-type="${n.type}"
      data-receiver-id="${n.receiverId}"
      data-status-owner-id="${n.statusOwnerId}"
      data-entity-type="${n.entityType}"
      data-entity-id="${n.entityId}"
      data-post-id="${n.postId || n.entityId}"
    >
      <img src="${n.actorAvatar}" class="w-10 h-10 rounded-full object-cover shadow-sm" />
      
      <div class="flex-1">
        <p class="text-sm text-gray-800 ${isUnread ? "font-semibold" : ""}">
          <strong>${n.actorName}</strong> ${getMessage(n)}
        </p>
        <span class="text-xs text-gray-400 mt-1 block">${formatTime(n.createdAt)}</span>
      </div>

      ${isUnread ? `<div class="unread-dot w-2 h-2 bg-blue-500 rounded-full mt-2 shadow-sm"></div>` : ""}
    </div>
  `;
};

const getMessage = (n) => {
  switch (n.type) {
    case "LIKE_STATUS":
      return "đã thích bài viết của bạn";
    case "LIKE_COMMENT":
      return "đã thích bình luận của bạn";
    case "COMMENT_STATUS":
      return "đã bình luận bài viết của bạn";
    case "REPLY_COMMENT":
      return "đã trả lời bình luận của bạn";
    case "FRIEND_REQUEST":
      return "đã gửi cho bạn lời mời kết bạn";
    case "FRIEND_ACCEPTED":
      return "đã chấp nhận lời mời kết bạn của bạn";
    default:
      return "đã tương tác với bạn";
  }
};

const formatTime = (time) => {
  return new Date(time).toLocaleString();
};