window.homeManager = {
    init() {
        console.log("Home Manager Initialized");
        this.loadFeed();
        this.setupEventListeners();
    },

    async loadFeed() {
        const container = document.getElementById('feed-container');
        if (!container) return; 
        
        container.innerHTML = '<div class="text-center py-4">Đang tải...</div>';

        try {
            // Gọi Service lấy dữ liệu
            const res = await PostService.getNewsFeed(0, 20);
            const posts = res.data; 

            if (!posts || posts.length === 0) {
                container.innerHTML = '<div class="text-center text-gray-500 py-10">Chưa có bài viết nào.</div>';
                return;
            }

            // Render từng bài viết
            container.innerHTML = posts.map(post => this.renderPost(post)).join('');
            
        } catch (error) {
            console.error(error);
            container.innerHTML = '<div class="text-center text-red-500">Lỗi tải bảng tin.</div>';
        }
    },

    renderPost(post) {
        // Kiểm tra an toàn dữ liệu
        const user = post.userFullName || "Người dùng";
        const avatar = post.userAvatar || "static/images/user.png";
        const time = Utils.timeAgo(post.createdAt);
        const content = Utils.escapeHtml(post.content);
        
        // Xử lý ảnh bài viết
        const imageHtml = post.imageUrl 
            ? `<div class="mt-3"><img src="${post.imageUrl}" class="rounded-lg w-full object-cover max-h-96"></div>` 
            : '';

        // Xử lý trạng thái Like
        const isLiked = post.likedByCurrentUser || false;
        const likeClass = isLiked ? "text-red-500" : "text-gray-500";
        const heartIcon = isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";

        // Xử lý nút Xóa (chỉ hiện nếu là bài của mình)
        // Chú ý: Tôi dùng '${post.id}' (có nháy đơn) để tránh lỗi nếu ID là chuỗi ký tự
        const deleteButtonHtml = (window.currentUser && window.currentUser.id === post.userId)
            ? `<button onclick="window.homeManager.deletePost('${post.id}')" class="text-gray-300 hover:text-red-500" title="Xóa bài viết">
                    <i class="fa-solid fa-trash"></i>
                </button>`
            : '';

        // --- BẮT ĐẦU CHUỖI HTML (DÙNG DẤU HUYỀN ` ) ---
        return `
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4 animate-fade-in-down" id="post-${post.id}">
            <div class="flex gap-3">
                <img src="${avatar}" class="w-10 h-10 rounded-full object-cover border border-slate-200">
                
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-bold text-sm text-slate-900">${user}</h3>
                            <span class="text-xs text-slate-400">${time}</span>
                        </div>
                        ${deleteButtonHtml} 
                    </div>
                    
                    <p class="mt-2 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">${content}</p>
                    ${imageHtml}
                    
                    <div class="flex gap-6 mt-3 pt-3 border-t border-slate-50">
                        <button onclick="window.homeManager.likePost('${post.id}')" class="flex items-center gap-2 ${likeClass} hover:text-red-500 transition group" id="like-btn-${post.id}">
                            <div class="p-2 rounded-full group-hover:bg-red-50 transition">
                                <i class="${heartIcon} text-lg" id="like-icon-${post.id}"></i>
                            </div>
                            <span id="like-count-${post.id}" class="text-sm font-semibold">${post.likeCount || 0}</span>
                        </button>
                        
                        <button class="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition group">
                            <div class="p-2 rounded-full group-hover:bg-blue-50 transition">
                                <i class="fa-regular fa-comment text-lg"></i>
                            </div>
                            <span class="text-sm font-semibold">${post.commentCount || 0}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `; 
        // --- KẾT THÚC CHUỖI HTML (DÙNG DẤU HUYỀN ` ) ---
    },

    setupEventListeners() {
        const btnPost = document.getElementById('btn-post-submit');
        if (btnPost) {
            btnPost.onclick = async () => {
                const content = document.getElementById('post-content').value;
                const fileInput = document.getElementById('post-image');
                const file = fileInput ? fileInput.files[0] : null;
                
                if (!content.trim() && !file) return alert("Vui lòng nhập nội dung hoặc ảnh!");
                
                const originalText = btnPost.innerText;
                btnPost.disabled = true;
                btnPost.innerText = "Đang đăng...";
                
                try {
                    await PostService.createPost(content, file);
                    // Reset form
                    document.getElementById('post-content').value = "";
                    if(fileInput) fileInput.value = "";
                    document.getElementById('preview-image-container')?.classList.add('hidden');
                    
                    this.loadFeed(); // Load lại feed
                } catch (err) {
                    alert("Lỗi: " + (err.response?.data?.message || "Không thể đăng bài"));
                } finally {
                    btnPost.disabled = false;
                    btnPost.innerText = originalText;
                }
            };
        }
    },

    async likePost(postId) {
        // Code xử lý like (giữ nguyên logic cũ của bạn hoặc code tôi gửi ở trên)
        // ... (Logic optimistic update)
        try {
            await PostService.toggleLike(postId);
            const icon = document.getElementById(`like-icon-${postId}`);
            const count = document.getElementById(`like-count-${postId}`);
            const btn = document.getElementById(`like-btn-${postId}`);
            
            let currentCount = parseInt(count.innerText);
            if (icon.classList.contains('fa-solid')) {
                icon.className = "fa-regular fa-heart";
                btn.classList.remove('text-red-500');
                btn.classList.add('text-gray-500');
                count.innerText = Math.max(0, currentCount - 1);
            } else {
                icon.className = "fa-solid fa-heart";
                btn.classList.remove('text-gray-500');
                btn.classList.add('text-red-500');
                count.innerText = currentCount + 1;
            }
        } catch (e) { console.error(e); }
    },

    async deletePost(postId) {
        if(!confirm("Xoá bài viết này?")) return;
        try {
            await PostService.deletePost(postId);
            const el = document.getElementById(`post-${postId}`);
            if(el) el.remove();
        } catch(e) { alert("Lỗi xoá bài"); }
    }
};