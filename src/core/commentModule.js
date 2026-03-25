import commentController from "../controllers/commentController.js";
import { formatRelativeTime, showToast, showConfirm } from "./utils/helpers.js";
import { authState } from "../state/authState.js";

/**
 * ---------------------------------------------------------------------------
 * GLOBAL LOGIC & STATE
 * ---------------------------------------------------------------------------
 */

// Đóng tất cả menu hành động khi click ra ngoài
document.addEventListener("click", (e) => {
    if (!e.target.closest(".btn-comment-more") && !e.target.closest(".comment-action-menu")) {
        document.querySelectorAll(".comment-action-menu").forEach(m => m.classList.add("hidden"));
        document.querySelectorAll(".comment-item").forEach(item => item.style.zIndex = "");
    }
});

/**
 * Đóng tất cả các form (Sửa/Phản hồi) đang mở trong container
 */
const closeAllOpenForms = (container) => {
    // Đóng các hộp phản hồi
    container.querySelectorAll(".reply-box-container").forEach(box => {
        if (box.innerHTML !== "") box.innerHTML = "";
    });
    
    // Đóng các hộp sửa bằng cách khôi phục lại text gốc (nếu có lưu trong dataset hoặc innerText hiện tại)
    container.querySelectorAll(".edit-comment-container").forEach(editBox => {
        const contentDiv = editBox.closest(".comment-content");
        if (contentDiv) {
            //Tìm textarea để lấy giá trị nếu cần, nhưng đơn giản nhất là render lại hoặc dùng text cũ
            //Ở đây ta sẽ render lại hoặc ép hủy
            const cancelBtn = editBox.querySelector(".btn-cancel-edit");
            cancelBtn?.click();
        }
    });
};

/**
 * ---------------------------------------------------------------------------
 * 1. RENDER COMPONENT
 * ---------------------------------------------------------------------------
 */
export const renderCommentItem = (comment) => {
    const id = comment.id || comment.commentId;
    const isOwner =
        comment.isOwner === true ||
        comment.owner === true ||
        comment.username === authState.getUser()?.username;
    const timeAgo = formatRelativeTime(comment.createdAt);
    const profileLink = `#/user-profile/${comment.authorId}`;

    return `
    <div class="comment-item mb-4 flex gap-3 group animate-fade-in relative" data-id="${id}">
        <a href="${profileLink}">
            <img src="${comment.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username)}&background=3b82f6&color=fff`}" 
                class="w-8 h-8 rounded-full object-cover shrink-0 mt-1 shadow-sm border border-gray-100 transition-transform group-hover:scale-105" alt="avatar">
        </a>
        <div class="flex-1 min-w-0">
            <div class="bg-gray-100 p-3 rounded-2xl relative inline-block max-w-full comment-bubble-transition hover:bg-gray-200/70 shadow-sm border border-transparent hover:border-gray-200">
                <div class="flex justify-between items-center mb-0.5 gap-4">
                    <a href="${profileLink}">
                        <span class="font-bold text-[13px] text-gray-900 hover:underline cursor-pointer">${comment.fullName || comment.username}</span>
                    </a>
                    ${isOwner ? `
                    <div class="relative">
                        <button class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-300 transition-all btn-comment-more">
                            <svg class="w-4 h-4 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                            </svg>
                        </button>
                        <div class="hidden absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 comment-action-menu animate-slide-down">
                            <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition btn-edit-comment" data-id="${id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                Chỉnh sửa
                            </button>
                            <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition btn-delete-comment" data-id="${id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                Xóa
                            </button>
                        </div>
                    </div>` : ""}
                </div>
                <div class="text-[14px] text-gray-800 comment-content break-words leading-relaxed">${comment.content}</div>
                ${comment.imageUrl ? `<img src="${comment.imageUrl}" class="rounded-xl mt-2 max-w-full h-auto shadow-sm border border-gray-100 transition-opacity hover:opacity-95" alt="comment-image">` : ""}
                
                <div class="comment-stats-info absolute -bottom-2 -right-4 bg-white shadow-md rounded-full px-2 py-0.5 flex items-center gap-1 border border-gray-100 transform transition-all active:scale-95 ${comment.likeCount > 0 ? '' : 'hidden'} group/stats">
                    <span class="flex items-center justify-center bg-blue-500 text-white rounded-full w-4 h-4 shadow-sm">
                         <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                    </span>
                    <span class="text-[11px] text-gray-700 font-bold like-count-number">${comment.likeCount || 0}</span>
                </div>
            </div>
            <div class="flex items-center gap-4 mt-1.5 ml-2 text-[12px] font-bold text-gray-500">
                <button class="hover:text-blue-600 transition-all btn-like-comment flex items-center gap-1 group/like ${comment.isLiked ? "text-blue-600" : ""}" data-id="${id}">
                   <span class="group-hover/like:scale-110 transition-transform">${comment.isLiked ? 'Đã thích' : 'Thích'}</span>
                </button>
                <button class="hover:text-blue-600 transition-all btn-reply-comment">Phản hồi</button>
                <span class="font-normal text-gray-400 opacity-80 decoration-dotted underline-offset-4">${timeAgo}</span>
            </div>
            <div class="reply-box-container ml-2 overflow-hidden transition-all duration-300"></div>
        </div>
    </div>
  `;
};

/**
 * ---------------------------------------------------------------------------
 * 2. LOGIC PHẢN HỒI
 * ---------------------------------------------------------------------------
 */
const openReplyBox = (container, commentId) => {
    const commentItem = container.querySelector(`.comment-item[data-id="${commentId}"]`);
    if (!commentItem) return;

    const replyContainer = commentItem.querySelector(".reply-box-container");
    if (replyContainer.innerHTML !== "") {
        replyContainer.innerHTML = "";
        return;
    }

    // Đóng các form khác trước khi mở cái mới
    closeAllOpenForms(container);

    replyContainer.innerHTML = `
    <div class="flex flex-col gap-2 mt-2 bg-white p-3 rounded-2xl border border-blue-100 shadow-md animate-slide-down">
      <textarea placeholder="Viết phản hồi công khai..." 
             class="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm reply-input transition focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none min-h-[42px]" 
             rows="1" style="resize: none; overflow: hidden;"></textarea>
      <div class="flex justify-end gap-2 items-center">
        <button class="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition btn-cancel-reply">Hủy</button>
        <button class="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-blue-200 transition btn-send-reply">Phản hồi</button>
      </div>
    </div>
  `;

    const textarea = replyContainer.querySelector(".reply-input");
    const sendBtn = replyContainer.querySelector(".btn-send-reply");
    const cancelBtn = replyContainer.querySelector(".btn-cancel-reply");

    const autoResize = () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };
    textarea.addEventListener('input', autoResize);
    textarea.focus();

    cancelBtn.onclick = () => {
        replyContainer.innerHTML = "";
    };

    sendBtn.onclick = async () => {
        const content = textarea.value.trim();
        if (!content) return;

        try {
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<svg class="animate-spin h-3 w-3 text-white inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Đang gửi...';
            
            await commentController.replyComment(commentId, content);
            showToast("Đã gửi phản hồi", "success");
            replyContainer.innerHTML = "";
            const statusId = container.dataset.statusId;
            if (statusId) loadComments(statusId);
        } catch (error) {
            console.error("Reply error:", error);
            showToast("Lỗi khi gửi phản hồi", "error");
            sendBtn.disabled = false;
            sendBtn.innerText = "Phản hồi";
        }
    };

    textarea.onkeydown = (e) => {
        if (e.key === "Escape") cancelBtn.click();
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    };
};

/**
 * ---------------------------------------------------------------------------
 * 3. HÀNH ĐỘNG CHÍNH (LIKE, DELETE, EDIT)
 * ---------------------------------------------------------------------------
 */
export const handleEvents = (container, statusId) => {
    container.dataset.statusId = statusId;
    const textarea = container.querySelector(".comment-textarea");
    const postBtn = container.querySelector(".btn-post-comment");

    // Auto resize main input
    textarea?.addEventListener("input", () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
        postBtn?.classList.toggle("hidden", textarea.value.trim().length === 0);
    });

    // Post comment mới
    postBtn?.addEventListener("click", async () => {
        const content = textarea.value.trim();
        if (!content) return;
        try {
            postBtn.disabled = true;
            await commentController.addComment(statusId, content);
            textarea.value = "";
            textarea.style.height = "auto";
            postBtn.classList.add("hidden");
            postBtn.disabled = false;
            loadComments(statusId);
        } catch (e) {
            console.error("Add comment error:", e);
            showToast("Không thể gửi bình luận", "error");
            postBtn.disabled = false;
        }
    });

    // Event Delegation cho Comment List
    container.addEventListener("click", async (e) => {
        const target = e.target;
        const commentId = target.closest("[data-id]")?.dataset.id;
        if (!commentId && !target.closest(".comment-item")) return;

        // NÚT LIKE
        const likeBtn = target.closest(".btn-like-comment");
        if (likeBtn) {
            e.preventDefault();
            e.stopPropagation();

            const commentItem = likeBtn.closest(".comment-item");
            const countLabel = commentItem.querySelector(".like-count-number");
            const statsBadge = commentItem.querySelector(".comment-stats-info");
            const thumbIcon = commentItem.querySelector(".comment-stats-info span");

            try {
                likeBtn.classList.add("animate-scale-up");
                setTimeout(() => likeBtn.classList.remove("animate-scale-up"), 300);

                await commentController.likeComment(commentId);
                const isNowLiked = !likeBtn.classList.contains("text-blue-600");

                if (isNowLiked) {
                    likeBtn.classList.add("text-blue-600");
                    likeBtn.querySelector("span").innerText = "Đã thích";
                    if (thumbIcon) thumbIcon.classList.add("animate-scale-up");
                } else {
                    likeBtn.classList.remove("text-blue-600");
                    likeBtn.querySelector("span").innerText = "Thích";
                }

                if (countLabel) {
                    const currentCount = Number(countLabel.innerText);
                    const newCount = currentCount + (isNowLiked ? 1 : -1);
                    countLabel.innerText = newCount > 0 ? newCount : 0;
                    if (statsBadge) statsBadge.classList.toggle("hidden", newCount <= 0);
                }
            } catch (err) {
                console.error("Like error:", err);
            }
            return;
        }

        // NÚT PHẢN HỒI
        if (target.closest(".btn-reply-comment")) {
            openReplyBox(container, commentId);
            return;
        }

        // NÚT MORE (BA CHẤM)
        if (target.closest(".btn-comment-more")) {
            e.stopPropagation();
            const moreBtn = target.closest(".btn-comment-more");
            const menu = moreBtn.nextElementSibling;
            const item = target.closest(".comment-item");
            
            const isMenuHidden = menu.classList.contains("hidden");
            
            // Đóng tất cả menu khác và reset z-index
            document.querySelectorAll(".comment-action-menu").forEach(m => m.classList.add("hidden"));
            document.querySelectorAll(".comment-item").forEach(i => i.style.zIndex = "");
            
            if (isMenuHidden) {
                menu.classList.remove("hidden");
                if (item) item.style.zIndex = "60";
            }
            return;
        }

        // NÚT XÓA
        if (target.closest(".btn-delete-comment")) {
            const confirmed = await showConfirm({
                title: "Xác nhận xóa",
                message: "Bạn có chắc chắn muốn xóa bình luận này không?",
                confirmText: "Xóa",
                cancelText: "Hủy"
            });

            if (confirmed) {
                const item = target.closest(".comment-item");
                item.classList.add("opacity-50", "pointer-events-none", "scale-95", "transition-all");
                try {
                    await commentController.deleteComment(commentId);
                    loadComments(statusId);
                } catch (err) {
                    item.classList.remove("opacity-50", "pointer-events-none", "scale-95");
                    showToast("Lỗi khi xóa bình luận", "error");
                }
            }
            return;
        }

        // NÚT SỬA
        if (target.closest(".btn-edit-comment")) {
            const menu = target.closest(".comment-action-menu");
            if (menu) menu.classList.add("hidden");
            handleEditMode(container, commentId);
        }
    });
};

/**
 * ---------------------------------------------------------------------------
 * 4. KHỞI TẠO & LOAD
 * ---------------------------------------------------------------------------
 */
export const initCommentSection = async (container, statusId) => {
    const user = authState.getUser();
    const userName = user?.fullName || user?.username || "U";
    const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`;

    container.innerHTML = `
    <div class="mt-2 pt-4 border-t border-gray-100 animate-fade-in">
        <!-- Input section -->
        <div class="flex gap-3 mb-5 px-1">
            <img src="${avatarUrl}" class="w-8 h-8 rounded-full shrink-0 shadow-md border border-white mt-1" alt="me">
            <div class="flex-1 relative group">
                <textarea class="w-full bg-gray-100 border border-transparent rounded-2xl px-4 py-2.5 pr-12 text-sm transition-all focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none shadow-inner comment-textarea" 
                          placeholder="Viết bình luận..." rows="1" style="resize: none;"></textarea>
                <button class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 opacity-0 group-focus-within:opacity-100 hover:scale-110 transition-all hidden btn-post-comment">
                    <svg class="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                </button>
            </div>
        </div>
        <!-- List container -->
        <div class="comment-list space-y-1" id="comment-list-${statusId}">
            <!-- Loading skeleton -->
            <div class="animate-pulse space-y-4 px-2">
                <div class="flex space-x-3">
                    <div class="rounded-full bg-slate-200 h-8 w-8"></div>
                    <div class="flex-1 space-y-2 py-1">
                        <div class="h-2 bg-slate-200 rounded w-1/4"></div>
                        <div class="h-2 bg-slate-200 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;

    handleEvents(container, statusId);
    loadComments(statusId);
};

// Export để PostCard/module khác có thể gọi làm mới
export const loadComments = async (statusId) => {
    const list = document.getElementById(`comment-list-${statusId}`);
    if (!list) return;
    try {
        const response = await commentController.getComments(statusId);
        const comments = Array.isArray(response) ? response : (response.data || []);
        
        if (comments.length === 0) {
            list.innerHTML = `<div class="py-4 text-center text-gray-400 text-xs italic">Chưa có bình luận nào. Hãy là người đầu tiên!</div>`;
            return;
        }
        
        list.innerHTML = comments.map(c => renderCommentItem(c)).join("");
    } catch (e) {
        console.error("Load comments error:", e);
        list.innerHTML = `<div class="p-2 text-center text-red-500 text-xs">Không thể tải bình luận</div>`;
    }
};

/**
 * ---------------------------------------------------------------------------
 * 5. EDIT MODE
 * ---------------------------------------------------------------------------
 */
const handleEditMode = (container, commentId) => {
    const item = container.querySelector(`.comment-item[data-id="${commentId}"]`);
    const contentDiv = item?.querySelector(".comment-content");
    if (!contentDiv) return;

    // Nếu đang ở edit mode rồi thì thoát
    if (contentDiv.querySelector(".edit-comment-container")) return;

    // Đóng các form khác trước khi mở cái mới
    closeAllOpenForms(container);

    const oldText = contentDiv.innerText.trim();
    contentDiv.innerHTML = `
        <div class="edit-comment-container mt-1 min-w-[200px] animate-slide-down">
            <textarea class="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-[14px] focus:ring-4 focus:ring-blue-100 outline-none edit-textarea transition-all" 
                      rows="1" style="resize: none; overflow: hidden;"></textarea>
            <div class="flex justify-end gap-2 mt-2">
                <button class="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition btn-cancel-edit">Hủy</button>
                <button class="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition btn-save-edit">Cập nhật</button>
            </div>
            <p class="edit-error hidden text-[11px] text-red-500 mt-2 ml-1 font-medium italic"></p>
        </div>
    `;

    const textarea = contentDiv.querySelector(".edit-textarea");
    const saveBtn = contentDiv.querySelector(".btn-save-edit");
    const cancelBtn = contentDiv.querySelector(".btn-cancel-edit");
    const errorMsg = contentDiv.querySelector(".edit-error");

    textarea.value = oldText;

    const autoResize = () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    };
    textarea.addEventListener("input", autoResize);
    autoResize(); 
    
    textarea.focus();
    textarea.setSelectionRange(oldText.length, oldText.length);

    cancelBtn.onclick = (e) => {
        e.stopPropagation();
        contentDiv.innerText = oldText;
    };

    saveBtn.onclick = async (e) => {
        e.stopPropagation();
        const newText = textarea.value.trim();

        if (!newText) {
            errorMsg.innerText = "Nội dung không được để trống";
            errorMsg.classList.remove("hidden");
            textarea.classList.add("border-red-300", "focus:ring-red-50");
            textarea.focus();
            return;
        }

        if (newText === oldText) {
            contentDiv.innerText = oldText;
            return;
        }

        try {
            saveBtn.disabled = true;
            cancelBtn.disabled = true;
            saveBtn.innerHTML = '<svg class="animate-spin h-3 w-3 text-white inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Đang lưu...';

            const result = await commentController.updateComment(commentId, newText);
            
            if (result) {
                showToast("Đã cập nhật bình luận", "success");
                
                // Optimistic UI Update
                contentDiv.innerText = newText;

                // Sync background
                const statusId = container.dataset.statusId;
                if (statusId) loadComments(statusId);
            } else {
                saveBtn.disabled = false;
                cancelBtn.disabled = false;
                saveBtn.innerText = "Cập nhật";
                errorMsg.innerText = "Cập nhật thất bại, vui lòng thử lại";
                errorMsg.classList.remove("hidden");
            }
        } catch (err) {
            console.error("Update error:", err);
            showToast("Lỗi khi cập nhật", "error");
            saveBtn.disabled = false;
            cancelBtn.disabled = false;
            saveBtn.innerText = "Cập nhật";
            errorMsg.innerText = "Đã xảy ra lỗi hệ thống";
            errorMsg.classList.remove("hidden");
        }
    };

    textarea.onkeydown = (e) => {
        if (e.key === "Escape") cancelBtn.click();
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            saveBtn.click();
        }
    };
};

export default { initCommentSection, renderCommentItem, handleEvents, loadComments };