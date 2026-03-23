import commentService from "../services/commentService.js";
import commentController from "../controllers/commentController.js";
import { formatRelativeTime, showConfirm, showToast } from "./utils/helpers.js";
import { authState } from "../state/authState.js";

/**
 * 1. RENDER COMPONENT
 */
export const renderCommentItem = (comment) => {
  const id = comment.id || comment.commentId;
  const isOwner =
    comment.isOwner === true ||
    comment.owner === true ||
    comment.username === authState.getUser()?.username;
  const timeAgo = formatRelativeTime(comment.createdAt);

  return `
    <div class="comment-item mb-4 flex gap-3 group" data-id="${id}">
        <img src="${comment.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username)}&background=3b82f6&color=fff`}" 
             class="w-8 h-8 rounded-full object-cover shrink-0 mt-1" alt="avatar">
        <div class="flex-1 min-w-0">
            <div class="bg-gray-100 p-3 rounded-2xl relative inline-block max-w-full">
                <div class="flex justify-between items-center mb-1 gap-4">
                    <span class="font-bold text-sm text-gray-900">${comment.username}</span>
                    ${isOwner ? `
                    <div class="relative">
                        <button class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition btn-comment-more">
                            <svg class="w-4 h-4 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                            </svg>
                        </button>
                        <div class="hidden absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-10 py-1 comment-action-menu">
                            <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 btn-edit-comment" data-id="${id}">
                                Chỉnh sửa
                            </button>
                            <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 btn-delete-comment" data-id="${id}">
                                Xóa
                            </button>
                        </div>
                    </div>` : ""}
                </div>
                <div class="text-sm text-gray-800 comment-content break-words">${comment.content}</div>
                ${comment.imageUrl ? `<img src="${comment.imageUrl}" class="rounded-lg mt-2 max-w-full h-auto" alt="comment-image">` : ""}
                
                <div class="comment-stats-info absolute -bottom-2 -right-4 bg-white shadow-sm rounded-full px-1.5 py-0.5 flex items-center gap-1 border border-gray-100 ${comment.likeCount > 0 ? '' : 'hidden'}">
                    <span class="flex items-center justify-center bg-blue-500 text-white rounded-full w-3.5 h-3.5">
                         <svg class="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                    </span>
                    <span class="text-[11px] text-gray-600 font-bold like-count-number">${comment.likeCount || 0}</span>
                </div>
            </div>
            <div class="flex items-center gap-4 mt-1 ml-2 text-xs font-semibold text-gray-500">
                <button class="hover:underline btn-like-comment ${comment.isLiked ? "text-blue-500 font-bold" : "text-gray-500"}" data-id="${id}">
                  Thích
                </button>
                <button class="hover:underline btn-reply-comment" data-id="${id}">Phản hồi</button>
                <span class="font-normal text-gray-400">${timeAgo}</span>
            </div>
            <div class="reply-box-container ml-2"></div>
        </div>
    </div>
  `;
};

/**
 * 2. LOGIC PHẢN HỒI
 */
const openReplyBox = (container, commentId) => {
  const commentItem = container.querySelector(`.comment-item[data-id="${commentId}"]`);
  if (!commentItem) return;

  const replyContainer = commentItem.querySelector(".reply-box-container");
  if (replyContainer.innerHTML !== "") return;

  replyContainer.innerHTML = `
    <div class="flex gap-2 mt-2 items-center">
      <input type="text" placeholder="Viết phản hồi..." 
             class="flex-1 border border-gray-300 rounded-full px-3 py-1 text-sm reply-input focus:ring-1 focus:ring-blue-500 outline-none" />
      <button class="text-blue-500 text-sm font-bold btn-send-reply">Gửi</button>
      <button class="text-gray-400 text-xs btn-cancel-reply">Hủy</button>
    </div>
  `;

  replyContainer.querySelector(".btn-cancel-reply").onclick = () => (replyContainer.innerHTML = "");

  replyContainer.querySelector(".btn-send-reply").onclick = async () => {
    const input = replyContainer.querySelector(".reply-input");
    const content = input.value.trim();
    if (!content) return;

    try {
      await commentController.replyComment(commentId, content);
      showToast("Đã gửi phản hồi");
      replyContainer.innerHTML = "";
    } catch (error) {
      showToast("Lỗi khi phản hồi", "error");
    }
  };
};

/**
 * 3. SỰ KIỆN CHÍNH
 */
export const handleEvents = (container, statusId) => {
  const textarea = container.querySelector(".comment-textarea");
  const postBtn = container.querySelector(".btn-post-comment");

  textarea?.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    postBtn?.classList.toggle("hidden", textarea.value.trim().length === 0);
  });

  postBtn?.addEventListener("click", async () => {
    const content = textarea.value.trim();
    if (!content) return;
    try {
      await commentController.addComment(statusId, content);
      textarea.value = "";
      loadComments(statusId);
    } catch (e) { showToast("Lỗi đăng bình luận", "error"); }
  });

  container.addEventListener("click", async (e) => {
    const target = e.target;

    // NÚT LIKE
    const likeBtn = e.target.closest(".btn-like-comment");

    if (likeBtn) {
        e.preventDefault();
        e.stopPropagation();

        const commentId = likeBtn.getAttribute("data-id");
        const commentItem = likeBtn.closest(".comment-item");
        const countLabel = commentItem.querySelector(".like-count-number");
        const statsBadge = commentItem.querySelector(".comment-stats-info");

        try {
            await commentController.likeComment(commentId);
            
            const isNowLiked = !likeBtn.classList.contains("text-blue-500");

            if (isNowLiked === true) {
                // Đổi sang trạng thái "Đã thích"
                likeBtn.style.color = "#3b82f6"; // Màu xanh
                
                // QUAN TRỌNG: Phải xóa class cũ và thêm class mới
                likeBtn.classList.remove("text-gray-500");
                likeBtn.classList.add("text-blue-500", "font-bold");
            } else {
                // Đổi sang trạng thái "Thích"
                likeBtn.style.color = "#6b7280"; // Màu xám
                
                likeBtn.classList.remove("text-blue-500", "font-bold");
                likeBtn.classList.add("text-gray-500");
            }

            // Cập nhật số lượng hiển thị trên UI
            if (countLabel) countLabel.innerText = Number(countLabel.innerText) + (isNowLiked ? 1 : -1) || "0";
            if (statsBadge) statsBadge.classList.toggle("hidden", Number(countLabel.innerText) === 0);

        } catch (err) {
            console.error("Lỗi khi thực hiện Like:", err);
            if (err.status === 401) {
                showToast("Vui lòng đăng nhập để Like", "error");
            } else {
                showToast("Thao tác thất bại", "error");
            }
        }
        return;
    }

    // NÚT PHẢN HỒI
    const replyBtn = target.closest(".btn-reply-comment");
    if (replyBtn) {
      openReplyBox(container, replyBtn.dataset.id);
      return;
    }

    // NÚT MORE
    const moreBtn = target.closest(".btn-comment-more");
    if (moreBtn) {
      const menu = moreBtn.nextElementSibling;
      container.querySelectorAll(".comment-action-menu").forEach(m => m !== menu && m.classList.add("hidden"));
      menu?.classList.toggle("hidden");
      return;
    }

    // NÚT XÓA
    const deleteBtn = target.closest(".btn-delete-comment");
    if (deleteBtn) {
      if (confirm("Bạn có chắc muốn xóa?")) {
        await commentController.deleteComment(deleteBtn.dataset.id);
        loadComments(statusId);
      }
      return;
    }

    // NÚT SỬA
    const editBtn = target.closest(".btn-edit-comment");
    if (editBtn) {
      handleEditMode(container, editBtn.dataset.id);
    }
  });
};

/**
 * 4. KHỞI TẠO & LOAD
 */
export const initCommentSection = async (container, statusId) => {
  const user = authState.getUser();
  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "U")}`;

  container.innerHTML = `
    <div class="mt-2 pt-4 border-t">
        <div class="flex gap-3 mb-4">
            <img src="${avatarUrl}" class="w-8 h-8 rounded-full shrink-0" alt="me">
            <div class="flex-1 relative">
                <textarea class="w-full bg-gray-100 border-0 rounded-2xl px-4 py-2 pr-12 text-sm focus:ring-1 focus:ring-blue-500 outline-none comment-textarea" 
                          placeholder="Viết bình luận..." rows="1" style="resize: none;"></textarea>
                <button class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hidden btn-post-comment">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                </button>
            </div>
        </div>
        <div class="comment-list" id="comment-list-${statusId}"></div>
    </div>
  `;

  handleEvents(container, statusId);
  loadComments(statusId);
};

const loadComments = async (statusId) => {
  const list = document.getElementById(`comment-list-${statusId}`);
  if (!list) return;
  try {
    const response = await commentController.getComments(statusId);
    // Lưu ý: Đảm bảo server trả về mảng comments trực tiếp hoặc bọc trong .data
    const comments = Array.isArray(response) ? response : (response.data || []);
    list.innerHTML = comments.map(c => renderCommentItem(c)).join("");
  } catch (e) { console.error("Load error", e); }
};

const handleEditMode = (container, commentId) => {
    const item = container.querySelector(`.comment-item[data-id="${commentId}"]`);
    const contentDiv = item?.querySelector(".comment-content");
    if (!contentDiv) return;

    const oldText = contentDiv.innerText;
    contentDiv.innerHTML = `
        <textarea class="w-full border rounded p-2 text-sm edit-textarea">${oldText}</textarea>
        <div class="flex gap-2 mt-1">
            <button class="text-xs text-blue-500 font-bold btn-save-edit">Lưu</button>
            <button class="text-xs text-gray-500 btn-cancel-edit">Hủy</button>
        </div>
    `;

    contentDiv.querySelector(".btn-cancel-edit").onclick = () => contentDiv.innerText = oldText;
    contentDiv.querySelector(".btn-save-edit").onclick = async () => {
        const newText = contentDiv.querySelector(".edit-textarea").value;
        await commentController.updateComment(commentId, newText);
        contentDiv.innerText = newText;
    };
};

export default { initCommentSection, renderCommentItem, handleEvents };