import { authState } from "../../state/authState.js";
import { formatRelativeTime } from "../../core/utils/helpers.js";
import commentModule from "../../core/commentModule.js";
import { likeStatus, unlikeStatus } from "../../services/likeService.js";
/**
 * PostCard Component
 * Renders a post card with all interactions
 */

export const renderPostCard = (post) => {
  const {
    id,
    content,
    createdAt,
    imageUrls = [],
    likesCount = 0,
    commentsCount = 0,
    liked = false,
    visibility = "PUBLIC",
    updatedAt,
    user,
  } = post;

  const currentUser = authState.getUser();
  const postUser = user || currentUser;
  const formattedDate = formatRelativeTime(createdAt);

  const visibilityColor =
    {
      PUBLIC: "bg-green-100 text-green-800",
      FRIENDS_ONLY: "bg-blue-100 text-blue-800",
      PRIVATE: "bg-red-100 text-red-800",
    }[visibility] || "bg-gray-100 text-gray-800";

  const visibilityLabel =
    {
      PUBLIC: "Công khai",
      FRIENDS_ONLY: "Bạn bè",
      PRIVATE: "Chỉ mình tôi",
    }[visibility] || visibility;

  const imagesHtml =
    imageUrls && imageUrls.length > 0
      ? `
      <div class="mt-4 grid gap-2 ${imageUrls.length === 1 ? "grid-cols-1" : imageUrls.length === 2 ? "grid-cols-2" : "grid-cols-3"} rounded-lg overflow-hidden">
        ${imageUrls
          .slice(0, 3)
          .map(
            (img, idx) => `
          <div class="relative bg-gray-200 aspect-square overflow-hidden rounded-lg group cursor-pointer">
            ${
              img && typeof img === "object" && img.url
                ? `<img src="${img.url}" alt="Post image ${idx + 1}" class="w-full h-full object-cover group-hover:opacity-90 transition" />`
                : `<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`
            }
          </div>
        `,
          )
          .join("")}
        ${imageUrls.length > 3 ? `<div class="relative bg-gray-200 aspect-square rounded-lg flex items-center justify-center text-center"><div><p class="text-lg font-bold text-gray-600">+${imageUrls.length - 3}</p><p class="text-xs text-gray-500">ảnh khác</p></div></div>` : ""}
      </div>
    `
      : "";

  return `
    <article class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow" data-post-id="${id}">
      <!-- Post Header -->
      <div class="p-4 border-b border-gray-100">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3 flex-1">
            <img 
              src="${postUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(postUser?.username || "User")}&background=3b82f6&color=fff`}"
              alt="${postUser?.username || "User"}"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-gray-900 text-sm user-link cursor-pointer" data-user-id="${postUser?.id}">${postUser?.fullName || postUser?.username || "User"}</h3>
                <span class="text-gray-500 text-sm">·</span>
                <time class="text-gray-500 text-sm" title="${createdAt}">${formattedDate}</time>
              </div>
              <div class="flex items-center gap-2 mt-1">
                <span class="inline-block px-2 py-0.5 text-xs font-medium rounded ${visibilityColor}">
                  ${visibilityLabel}
                </span>
                ${updatedAt ? `<span class="text-xs text-gray-400">(Đã chỉnh sửa)</span>` : ""}
              </div>
            </div>
          </div>
          <button class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full btn-more-options">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Post Content -->
      <div class="px-4 py-3">
        <p class="text-gray-900 text-sm leading-normal whitespace-pre-wrap">${content}</p>
        ${imagesHtml}
      </div>

      <!-- Post Stats -->
      <div class="px-4 py-2 border-t border-gray-100 border-b flex justify-between text-xs text-gray-500">
        <div class="flex gap-4">
            <button class="hover:text-blue-600 transition flex items-center gap-1 btn-like-stat">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
              </svg>
              <span>${likesCount}</span>
            </button>
            <button class="hover:text-blue-600 transition flex items-center gap-1 btn-comment-stat">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2l-4 4z"></path>
              </svg>
              <span>${commentsCount}</span>
            </button>
        </div>
      </div>

      <!-- Post Actions -->
      <div class="px-4 py-1 flex items-center justify-between text-sm border-b border-gray-100">
        <button 
            class="flex-1 py-2 text-center transition rounded flex items-center justify-center gap-2 btn-like ${liked ? "text-blue-600" : "text-gray-600"}"
            data-liked="${liked}"
        >

        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017
                c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095
                c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7
                20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5">
          </path>
        </svg>

<span class="font-medium">Thích</span>

</button>          
        <button class="flex-1 py-2 text-center text-gray-600 hover:bg-gray-50 transition rounded flex items-center justify-center gap-2 btn-comment">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <span class="font-medium">Bình luận</span>
        </button>
        <button class="flex-1 py-2 text-center text-gray-600 hover:bg-gray-50 transition rounded flex items-center justify-center gap-2 btn-share">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
            <span class="font-medium">Chia sẻ</span>
        </button>
      </div>

      <!-- Comment Section Container -->
      <div class="px-4 py-2 border-t border-gray-100 hidden bg-gray-50" id="comment-section-${id}">
        <!-- commentModule will inject UI here -->
      </div>
    </article>
  `;
};

export const setupPostEventHandlers = (container) => {
  container.querySelectorAll("article[data-post-id]").forEach((postElement) => {
    const postId = Number(postElement.dataset.postId);

    // Comment Action
    const commentBtn = postElement.querySelector(".btn-comment");
    if (commentBtn) {
      commentBtn.onclick = () => {
        const commentSection = postElement.querySelector(`#comment-section-${postId}`);
        if (commentSection) {
          const isHidden = commentSection.classList.contains("hidden");
          if (isHidden) {
            commentSection.classList.remove("hidden");
            commentModule.initCommentSection(commentSection, postId);
          } else {
            commentSection.classList.add("hidden");
          }
        }
      };
    }

    // Like/Share dummy handlers
    const likeBtn = postElement.querySelector(".btn-like");

    if (likeBtn) {
      likeBtn.addEventListener("click", async () => {
        const liked = likeBtn.dataset.liked === "true";
        const likeCountEl = postElement.querySelector(".btn-like-stat span");

        try {
          if (liked) {
            await unlikeStatus(postId);

            likeBtn.dataset.liked = "false";
            likeBtn.classList.remove("text-blue-600");
            likeBtn.classList.add("text-gray-600");

            likeCountEl.textContent = Number(likeCountEl.textContent) - 1;
          } else {
            await likeStatus(postId);

            likeBtn.dataset.liked = "true";
            likeBtn.classList.add("text-blue-600");
            likeBtn.classList.remove("text-gray-600");

            likeCountEl.textContent = Number(likeCountEl.textContent) + 1;
          }
        } catch (error) {
          console.error(error);
          alert("Like thất bại");
        }
      });
    }
    postElement
      .querySelector(".btn-share")
      ?.addEventListener("click", () => alert("Tính năng chia sẻ đang được phát triển"));
    postElement
      .querySelector(".btn-more-options")
      ?.addEventListener("click", () => alert("Tính năng đang được phát triển"));
  });
};

export default {
  renderPostCard,
  setupPostEventHandlers,
};
