import postController from "../../controllers/postController.js";

/**
 * EditPostModal — Modal chỉnh sửa bài viết
 * Dùng chung cho ProfilePage và HomePage
 *
 * Cách dùng:
 *   import { openEditPostModal } from "../../components/EditPostModal.js";
 *   openEditPostModal(post, onSuccessCallback);
 */

const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "🌍 Công khai" },
  { value: "FRIENDS_ONLY", label: "👥 Bạn bè" },
  { value: "ONLY_ME", label: "🔒 Chỉ mình tôi" },
];

// ─── State nội bộ ─────────────────────────────────────────────────────────────
let _currentPost = null; // post đang được edit
let _onSuccess = null; // callback sau khi edit thành công
let _deletedImageIds = []; // ids ảnh cũ đã đánh dấu xóa
let _newImageFiles = []; // File[] ảnh mới sẽ upload

// ─── HTML template ────────────────────────────────────────────────────────────
const modalHTML = () => `
  <div
    id="editPostModal"
    class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4"
  >
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
 
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <h2 class="text-xl font-bold text-gray-900">Chỉnh sửa bài viết</h2>
        <button id="closeEditPostModal" class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">&times;</button>
      </div>
 
      <!-- Body -->
      <div class="px-6 py-4 overflow-y-auto flex-1 space-y-4">
 
        <!-- Author + visibility -->
        <div class="flex items-center space-x-3">
          <img id="editPostAvatar" src="" alt="avatar" class="w-11 h-11 rounded-full object-cover" />
          <div>
            <p id="editPostAuthorName" class="font-semibold text-gray-900 text-sm"></p>
            <select
              id="editPostVisibility"
              class="mt-1 text-sm bg-gray-100 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400"
            >
              ${VISIBILITY_OPTIONS.map(
                (o) => `<option value="${o.value}">${o.label}</option>`,
              ).join("")}
            </select>
          </div>
        </div>
 
        <!-- Caption -->
        <div>
          <textarea
            id="editPostContent"
            rows="4"
            maxlength="3000"
            placeholder="Bạn đang nghĩ gì?"
            class="w-full resize-none text-base outline-none placeholder-gray-400 border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400"
          ></textarea>
          <p class="text-xs text-gray-400 text-right mt-1">
            <span id="editPostCharCount">0</span>/3000
          </p>
        </div>
 
        <!-- Existing images -->
        <div id="editPostExistingImagesSection" class="hidden">
          <p class="text-xs font-semibold text-gray-500 mb-2">Ảnh hiện tại — nhấn ✕ để xóa</p>
          <div id="editPostExistingImages" class="grid grid-cols-3 gap-2"></div>
        </div>
 
        <!-- New image previews -->
        <div id="editPostNewPreviewSection" class="hidden">
          <p class="text-xs font-semibold text-gray-500 mb-2">Ảnh mới sẽ thêm vào</p>
          <div id="editPostNewPreviews" class="grid grid-cols-3 gap-2"></div>
        </div>
 
        <!-- Add image button -->
        <div class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
          <span class="text-sm font-medium text-gray-700">Thêm ảnh mới</span>
          <label class="cursor-pointer">
            <input
              type="file"
              id="editPostImageInput"
              multiple
              accept="image/*"
              class="hidden"
            />
            <svg class="w-6 h-6 text-green-500 hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
              </path>
            </svg>
          </label>
        </div>
      </div>
 
      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex-shrink-0">
        <button
          id="submitEditPostBtn"
          class="w-full bg-blue-500 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  </div>
`;

// ─── Đảm bảo modal tồn tại trong DOM ─────────────────────────────────────────
function ensureModal() {
  if (!document.getElementById("editPostModal")) {
    document.body.insertAdjacentHTML("beforeend", modalHTML());
    bindModalEvents();
  }
}

// ─── Gắn event handlers (chỉ 1 lần) ─────────────────────────────────────────
function bindModalEvents() {
  const modal = document.getElementById("editPostModal");
  const closeBtn = document.getElementById("closeEditPostModal");
  const content = document.getElementById("editPostContent");
  const charCount = document.getElementById("editPostCharCount");
  const imageInput = document.getElementById("editPostImageInput");
  const submitBtn = document.getElementById("submitEditPostBtn");

  // Đóng modal
  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    _resetState();
  };

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Char count
  content.addEventListener("input", () => {
    charCount.textContent = content.value.length;
  });

  // Chọn ảnh mới
  imageInput.addEventListener("change", () => {
    const files = Array.from(imageInput.files || []);
    _newImageFiles = [..._newImageFiles, ...files];
    _renderNewPreviews();
    imageInput.value = ""; // reset để chọn lại cùng file vẫn trigger change
  });

  // Submit
  submitBtn.addEventListener("click", _handleSubmit);
}

// ─── Render ảnh hiện tại ──────────────────────────────────────────────────────
function _renderExistingImages(images) {
  const section = document.getElementById("editPostExistingImagesSection");
  const container = document.getElementById("editPostExistingImages");

  if (!images || images.length === 0) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");
  container.innerHTML = images
    .map(
      (img) => `
      <div class="relative group" data-image-id="${img.id}">
        <img src="${img.url}" alt="" class="w-full h-24 object-cover rounded-lg ${
          _deletedImageIds.includes(img.id) ? "opacity-30" : ""
        }" />
        <button
          class="toggleDeleteImageBtn absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition
            ${
              _deletedImageIds.includes(img.id)
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white opacity-0 group-hover:opacity-100"
            }"
          data-image-id="${img.id}"
          title="${_deletedImageIds.includes(img.id) ? "Khôi phục" : "Xóa ảnh"}"
        >
          ${_deletedImageIds.includes(img.id) ? "↩" : "✕"}
        </button>
        ${
          _deletedImageIds.includes(img.id)
            ? `<div class="absolute inset-0 flex items-center justify-center">
               <span class="text-xs text-red-500 font-semibold bg-white bg-opacity-80 px-1 rounded">Sẽ xóa</span>
             </div>`
            : ""
        }
      </div>
    `,
    )
    .join("");

  // Gắn event toggle xóa/khôi phục
  container.querySelectorAll(".toggleDeleteImageBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.imageId);
      if (_deletedImageIds.includes(id)) {
        _deletedImageIds = _deletedImageIds.filter((x) => x !== id);
      } else {
        _deletedImageIds.push(id);
      }
      _renderExistingImages(_currentPost.imageUrls);
    });
  });
}

// ─── Render preview ảnh mới ───────────────────────────────────────────────────
function _renderNewPreviews() {
  const section = document.getElementById("editPostNewPreviewSection");
  const container = document.getElementById("editPostNewPreviews");

  if (_newImageFiles.length === 0) {
    section.classList.add("hidden");
    container.innerHTML = "";
    return;
  }

  section.classList.remove("hidden");
  container.innerHTML = "";

  _newImageFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wrapper = document.createElement("div");
      wrapper.className = "relative group";
      wrapper.innerHTML = `
        <img src="${e.target.result}" alt="" class="w-full h-24 object-cover rounded-lg" />
        <button
          class="removeNewImageBtn absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold
                 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
          data-index="${index}"
        >✕</button>
      `;
      wrapper.querySelector(".removeNewImageBtn").addEventListener("click", () => {
        _newImageFiles.splice(index, 1);
        _renderNewPreviews();
      });
      container.appendChild(wrapper);
    };
    reader.readAsDataURL(file);
  });
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function _handleSubmit() {
  const submitBtn = document.getElementById("submitEditPostBtn");
  const content = document.getElementById("editPostContent").value.trim();
  const visibility = document.getElementById("editPostVisibility").value;

  submitBtn.disabled = true;
  submitBtn.innerText = "Đang lưu...";

  try {
    const payload = {
      content,
      visibility,
      deleteImageIds: [..._deletedImageIds],
      newImages: [..._newImageFiles],
    };

    const success = await postController.updatePost(_currentPost.id, payload);

    if (success) {
      // ── Cập nhật DOM của card ngay lập tức, không cần reload trang ──
      await _updatePostCardDOM({
        postId: _currentPost.id,
        newContent: content,
        newVisibility: visibility,
        deletedIds: [..._deletedImageIds],
        newFiles: [..._newImageFiles],
        originalImages: _currentPost.imageUrls || [],
      });

      const modal = document.getElementById("editPostModal");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      _resetState();

      if (typeof _onSuccess === "function") _onSuccess();
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Lưu thay đổi";
  }
}

// ─── Cập nhật DOM card không cần reload ──────────────────────────────────────
async function _updatePostCardDOM({
  postId,
  newContent,
  newVisibility,
  deletedIds,
  newFiles,
  originalImages,
}) {
  const card = document.querySelector(`article[data-post-id="${postId}"]`);
  if (!card) return;

  // 1. Cập nhật caption
  const contentEl = card.querySelector(".whitespace-pre-wrap");
  if (contentEl) contentEl.textContent = newContent;

  // 2. Cập nhật visibility badge
  const visibilityMap = {
    PUBLIC: { label: "Công khai", color: "bg-green-100 text-green-800" },
    FRIENDS_ONLY: { label: "Bạn bè", color: "bg-blue-100 text-blue-800" },
    ONLY_ME: { label: "Chỉ mình tôi", color: "bg-red-100 text-red-800" },
  };
  const visBadge = card.querySelector(".inline-block.px-2.py-0\\.5");
  if (visBadge) {
    const vis = visibilityMap[newVisibility] || {
      label: newVisibility,
      color: "bg-gray-100 text-gray-800",
    };
    visBadge.className = `inline-block px-2 py-0.5 text-xs font-medium rounded ${vis.color}`;
    visBadge.textContent = vis.label;
  }

  // 3. Hiện nhãn "(Đã chỉnh sửa)" nếu chưa có
  const headerMeta = card.querySelector(".flex.items-center.gap-2.mt-1");
  if (headerMeta && !headerMeta.querySelector(".edited-label")) {
    const editedSpan = document.createElement("span");
    editedSpan.className = "text-xs text-gray-400 edited-label";
    editedSpan.textContent = "(Đã chỉnh sửa)";
    headerMeta.appendChild(editedSpan);
  }

  // 4. Cập nhật ảnh
  // Tính danh sách ảnh còn lại sau khi xóa
  const remainingImages = originalImages.filter((img) => !deletedIds.includes(img.id));

  // Convert ảnh mới (File[]) sang object url tạm để hiển thị ngay
  const newImageObjects = await Promise.all(
    newFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve({ id: null, url: e.target.result });
          reader.readAsDataURL(file);
        }),
    ),
  );

  const allImages = [...remainingImages, ...newImageObjects];

  // Re-render phần ảnh trong card
  const contentSection = card.querySelector(".px-4.py-3");
  if (contentSection) {
    // Xóa grid ảnh cũ nếu có
    const oldGrid = contentSection.querySelector(".grid");
    if (oldGrid) oldGrid.remove();

    // Render grid mới nếu còn ảnh
    if (allImages.length > 0) {
      const colClass =
        allImages.length === 1
          ? "grid-cols-1"
          : allImages.length === 2
            ? "grid-cols-2"
            : "grid-cols-3";

      const gridHTML = `
        <div class="mt-4 grid gap-2 ${colClass} rounded-lg overflow-hidden">
          ${allImages
            .slice(0, 3)
            .map(
              (img, idx) => `
            <div class="relative bg-gray-200 aspect-square overflow-hidden rounded-lg group cursor-pointer">
              <img src="${img.url}" alt="Post image ${idx + 1}"
                   class="w-full h-full object-cover group-hover:opacity-90 transition" />
            </div>
          `,
            )
            .join("")}
          ${
            allImages.length > 3
              ? `<div class="relative bg-gray-200 aspect-square rounded-lg flex items-center justify-center text-center">
                 <div>
                   <p class="text-lg font-bold text-gray-600">+${allImages.length - 3}</p>
                   <p class="text-xs text-gray-500">ảnh khác</p>
                 </div>
               </div>`
              : ""
          }
        </div>
      `;
      contentSection.insertAdjacentHTML("beforeend", gridHTML);
    }
  }

  // 5. Cập nhật data-post attribute để lần edit sau đọc đúng dữ liệu mới
  const updatedPost = JSON.parse(card.dataset.post.replace(/&#39;/g, "'"));
  updatedPost.content = newContent;
  updatedPost.visibility = newVisibility;
  updatedPost.imageUrls = remainingImages; // ảnh mới từ server chưa có id, giữ remaining
  card.dataset.post = JSON.stringify(updatedPost).replace(/'/g, "&#39;");
}

// ─── Reset state ─────────────────────────────────────────────────────────────
function _resetState() {
  _currentPost = null;
  _onSuccess = null;
  _deletedImageIds = [];
  _newImageFiles = [];

  const content = document.getElementById("editPostContent");
  if (content) content.value = "";

  const charCount = document.getElementById("editPostCharCount");
  if (charCount) charCount.textContent = "0";

  const existingSection = document.getElementById("editPostExistingImagesSection");
  if (existingSection) existingSection.classList.add("hidden");

  const newSection = document.getElementById("editPostNewPreviewSection");
  if (newSection) newSection.classList.add("hidden");
}

// ─── Public API ───────────────────────────────────────────────────────────────
/**
 * Mở modal chỉnh sửa bài viết
 * @param {Object} post - Post object { id, content, visibility, imageUrls, authorName, authorAvatarUrl }
 * @param {Function} onSuccess - Callback sau khi save thành công
 */
export function openEditPostModal(post, onSuccess) {
  ensureModal();

  _currentPost = post;
  _onSuccess = onSuccess;
  _deletedImageIds = [];
  _newImageFiles = [];

  // Điền dữ liệu hiện tại vào form
  document.getElementById("editPostContent").value = post.content || "";
  document.getElementById("editPostCharCount").textContent = (post.content || "").length;
  document.getElementById("editPostVisibility").value = post.visibility || "PUBLIC";
  document.getElementById("editPostAvatar").src =
    post.authorAvatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName || "User")}&background=3b82f6&color=fff`;
  document.getElementById("editPostAuthorName").textContent = post.authorName || "User";

  // Render ảnh hiện tại
  _renderExistingImages(post.imageUrls || []);

  // Reset new images section
  document.getElementById("editPostNewPreviewSection").classList.add("hidden");
  document.getElementById("editPostNewPreviews").innerHTML = "";

  // Hiện modal
  const modal = document.getElementById("editPostModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}
