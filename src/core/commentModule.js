import commentService from "../services/commentService.js";
import { formatRelativeTime } from "./utils/helpers.js";
import { authState } from "../state/authState.js";

/**
 * Comment Module (Vanilla JS + Tailwind approach)
 * Quản lý UI và logic cho phần bình luận
 */

/**
 * Render một item comment dựa trên dữ liệu từ API
 */
export const renderCommentItem = (comment) => {
    const isOwner = comment.isOwner === true || comment.owner === true || comment.username === authState.getUser()?.username;
    const timeAgo = formatRelativeTime(comment.createdAt);
    
    return `
        <div class="comment-item mb-4 flex gap-3 group" data-id="${comment.id}">
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
                                <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 btn-edit-comment" data-id="${comment.id}">
                                    <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    Chỉnh sửa
                                </button>
                                <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 btn-delete-comment" data-id="${comment.id}">
                                    <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    Xóa
                                </button>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    <div class="text-sm text-gray-800 comment-content break-words">${comment.content}</div>
                    ${comment.imageUrl ? `<img src="${comment.imageUrl}" class="rounded-lg mt-2 max-w-full h-auto" alt="comment-image">` : ''}
                </div>
                <div class="flex items-center gap-4 mt-1 ml-2 text-xs font-semibold text-gray-500">
                    <button class="hover:underline btn-like-comment" data-comment-id="${comment.id}">
                        ${comment.isLiked ? 'Bỏ thích' : 'Thích'} (${comment.likeCount || 0})
                    </button>
                    <button class="hover:underline btn-reply-comment" data-comment-id="${comment.id}">Phản hồi</button>

                    <span class="font-normal text-gray-400">${timeAgo}</span>
                </div>
                <div class="pl-8 mt-3 replies">
                    ${comment.replies && comment.replies.length 
                        ? comment.replies.map(reply => renderCommentItem(reply)).join('')
                        : ''}
                </div>
            </div>
        </div>
    `;
};

/**
 * Khởi tạo vùng comment cho một status
 */
export const initCommentSection = async (container, statusId) => {
    const user = authState.getUser();
    const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=3b82f6&color=fff`;

    // 1. Render khung nhập comment
    container.innerHTML = `
        <div class="mt-2 pt-4">
            <div class="flex gap-3 mb-4">
                <img src="${avatarUrl}" 
                     class="w-8 h-8 rounded-full object-cover shrink-0" alt="me">
                <div class="flex-1 relative">
                    <textarea class="w-full bg-gray-100 border-0 rounded-2xl px-4 py-2 pr-12 text-sm focus:ring-2 focus:ring-blue-500 outline-none comment-textarea transition-all" 
                              placeholder="Viết bình luận..." rows="1" style="resize: none;"></textarea>
                    <button class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:bg-blue-50 rounded-full transition hidden btn-post-comment">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="comment-list space-y-2" id="comment-list-${statusId}">
                <!-- Comments will be rendered here -->
                <div class="flex justify-center py-4 spinner-comments hidden">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
            </div>
            <div class="text-center mt-3 hidden btn-load-more-container">
                <button class="text-sm font-bold text-gray-500 hover:underline btn-load-more">Xem thêm bình luận</button>
            </div>
        </div>
    `;

    // 2. Gắn sự kiện
    handleEvents(container, statusId);

    // 3. Load danh sách comment ban đầu
    loadComments(statusId);
};

const loadComments = async (statusId) => {
    const listContainer = document.getElementById(`comment-list-${statusId}`);
    if (!listContainer) return;

    const spinner = listContainer.querySelector('.spinner-comments');
    spinner?.classList.remove('hidden');

    try {
        const response = await commentService.getComments(statusId);
        // commentService.getComments should return response.data directly if using axios nicely
        // Let's check getComments implementation in commentService.js
        const comments = response || [];
        
        // Clear spinner and old messages
        listContainer.innerHTML = '';
        if (comments.length === 0) {
            // No comments yet
        } else {
            listContainer.innerHTML = comments.map(c => renderCommentItem(c)).join('');
        }
        
        // Xử lý nút "Xem thêm"
        const loadMoreBtn = listContainer.parentElement.querySelector('.btn-load-more-container');
        if (comments.length >= 2) {
            loadMoreBtn?.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Failed to load comments:", error);
    } finally {
        spinner?.classList.add('hidden');
    }
};

export const handleEvents = (container, statusId) => {
    const textarea = container.querySelector('.comment-textarea');
    const postBtn = container.querySelector('.btn-post-comment');

    if (!textarea || !postBtn) return;

    // Auto resize textarea & show/hide post button
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
        
        if (textarea.value.trim().length > 0) {
            postBtn.classList.remove('hidden');
        } else {
            postBtn.classList.add('hidden');
        }
    });

    // Post comment event
    postBtn.addEventListener('click', async () => {
        const content = textarea.value.trim();
        if (!content) return;

        try {
            await commentService.postComment(statusId, content);
            textarea.value = '';
            textarea.style.height = 'auto';
            postBtn.classList.add('hidden');
            // Reload list
            loadComments(statusId);
        } catch (error) {
            console.error("Post comment error:", error);
            alert("Không thể đăng bình luận. Vui lòng thử lại!");
        }
    });

    // Edit/Delete/More buttons events (Event Delegation)
    container.addEventListener('click', async (e) => {
        const moreBtn = e.target.closest('.btn-comment-more');
        if (moreBtn) {
            const menuDropdown = moreBtn.nextElementSibling;
            
            // Đóng tất cả menu khác
            container.querySelectorAll('.comment-action-menu').forEach(menu => {
                if (menu !== menuDropdown) menu.classList.add('hidden');
            });

            if (menuDropdown) {
                menuDropdown.classList.toggle('hidden');
            }
            return;
        }

        const editBtn = e.target.closest('.btn-edit-comment');
        if (editBtn) {
            // Ẩn menu
            const menu = editBtn.closest('.comment-action-menu');
            if (menu) menu.classList.add('hidden');

            const commentId = editBtn.dataset.id;
            handleEditMode(container, commentId);
            return;
        }

        const deleteBtn = e.target.closest('.btn-delete-comment');
        if (deleteBtn) {
            const commentId = deleteBtn.dataset.id;
            if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
                try {
                    // Logic xóa chưa có trong service, tôi sẽ thêm sau nếu cần
                    // Hoặc tạm thời ẩn đi
                    alert('Chức năng xóa đang được phát triển');
                } catch (error) {
                    alert('Lỗi khi xóa bình luận');
                }
            }
        }
    });
container.addEventListener('click', async (e) => {
        // Handle Like Button
        const likeBtn = e.target.closest('.btn-like-comment');
        if (likeBtn) {
            const commentId = likeBtn.dataset.commentId;

            try {
                if (likeBtn.textContent.includes('Thích')) {
                    await commentService.likeComment(commentId);
                } else {
                    await commentService.unlikeComment(commentId);
                }
                // Reload comments after like/unlike
                loadComments(statusId);
            } catch (error) {
                console.error('Error liking/unliking comment:', error);
            }
        }

        // Handle Reply Button
        const replyBtn = e.target.closest('.btn-reply-comment');
        if (replyBtn) {
            const commentId = replyBtn.dataset.commentId;
            openReplyInput(container, commentId, statusId);
        }
    });
    // Reply Input Handler
        const openReplyInput = (container, commentId, statusId) => {
            const commentItem = container.querySelector(`.comment-item[data-id="${commentId}"] .replies`);
            if (!commentItem) return;

            // Check if input already exists
            if (commentItem.querySelector('.reply-input-container')) return;

            commentItem.innerHTML += `
                <div class="reply-input-container flex gap-3 mt-3">
                    <textarea class="flex-1 bg-gray-100 border rounded-lg p-2 text-sm reply-input" placeholder="Viết phản hồi..."></textarea>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded send-reply-btn" data-parent-id="${commentId}">Gửi</button>
                </div>
            `;
            
            // Attach Reply Event
            commentItem.querySelector('.send-reply-btn').addEventListener('click', async (e) => {
                const input = commentItem.querySelector('.reply-input');
                const content = input.value.trim();
                if (!content) return;

                try {
                    await commentService.postComment(statusId, content, commentId);
                    loadComments(statusId); // Refresh comments
                } catch (error) {
                    console.error('Error posting reply:', error);
                }
            });
        };



    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-comment-more')) {
            container.querySelectorAll('.comment-action-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
        }
    });
};

const handleEditMode = (container, commentId) => {
    const commentItem = container.querySelector(`.comment-item[data-id="${commentId}"]`);
    if (!commentItem) return;

    const contentDiv = commentItem.querySelector('.comment-content');
    const originalContent = contentDiv.innerText;

    // Thay thế text bằng textarea
    contentDiv.innerHTML = `
        <div class="edit-area mt-2 space-y-2 w-full">
            <textarea class="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 edit-textarea">${originalContent}</textarea>
            <div class="flex justify-end gap-2">
                <button class="px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded btn-cancel-edit">Hủy</button>
                <button class="px-3 py-1 text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded btn-save-edit">Lưu</button>
            </div>
        </div>
    `;

    const editArea = contentDiv.querySelector('.edit-area');
    
    // Cancel
    editArea.querySelector('.btn-cancel-edit').onclick = (e) => {
        e.stopPropagation();
        contentDiv.innerText = originalContent;
    };

    // Save
    const saveBtn = editArea.querySelector('.btn-save-edit');
    saveBtn.onclick = async (e) => {
        e.stopPropagation();
        const newContent = editArea.querySelector('.edit-textarea').value.trim();
        if (!newContent) {
           alert("Nội dung không được để trống!");
           return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Đang lưu...';
        
        try {
            await commentService.updateComment(commentId, newContent);
            contentDiv.innerText = newContent;
        } catch (error) {
            console.error("Cập nhật bình luận lỗi:", error);
            alert("Lỗi khi cập nhật bình luận!");
            // Re-enable button on error
            saveBtn.disabled = false;
            saveBtn.textContent = 'Lưu';
        }
    };
};

export default {
    initCommentSection,
    renderCommentItem,
    handleEvents
};
