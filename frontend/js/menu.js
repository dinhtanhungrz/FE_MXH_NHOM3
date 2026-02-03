// js/menu.js

// 1. Biến toàn cục
window.currentUser = null;

// 2. Khởi tạo khi trang menu.html load xong
document.addEventListener("DOMContentLoaded", () => {
    fetchGlobalUserInfo(); // Lấy thông tin user (Avatar, tên)
    loadPage('home');      // Mặc định vào trang Home
});

// 3. Hàm lấy thông tin User (dùng cho Sidebar)
async function fetchGlobalUserInfo() {
    try {
        // Gọi API lấy profile
        const response = await axios.get('/api/users/profile');
        window.currentUser = response.data.data;
        updateSidebarUI();
    } catch (error) {
        console.error("Lỗi auth/profile:", error);
        // Nếu lỗi 401 (chưa đăng nhập), đá về login
        /*
        if (error.response && error.response.status === 401) {
            window.location.href = "login.html";
        }
        */
    }
}

function updateSidebarUI() {
    if (!window.currentUser) return;
    const nameEl = document.getElementById('sidebar-fullname');
    const avatarEl = document.getElementById('sidebar-avatar');

    if (nameEl) nameEl.innerText = `${window.currentUser.firstName} ${window.currentUser.lastName}`;
    if (avatarEl && window.currentUser.avatarUrl) {
        // Thêm timestamp để tránh cache ảnh cũ
        avatarEl.src = window.currentUser.avatarUrl.startsWith("http") 
            ? window.currentUser.avatarUrl 
            : `${window.currentUser.avatarUrl}?t=${new Date().getTime()}`;
    }
}

// 4. HÀM NẠP TRANG (Routing giả lập)
async function loadPage(pageName) {
    const contentArea = document.getElementById('main-content');
    
    // Update active state cho Sidebar
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-page') === pageName);
    });

    try {
        // Tải file HTML con (ví dụ: home.html)
        const response = await fetch(`${pageName}.html`);
        if (!response.ok) throw new Error("Page missing");
        
        const html = await response.text();
        
        // Lọc lấy nội dung trong thẻ <main> (nếu có) hoặc lấy hết
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('main') ? doc.querySelector('main').innerHTML : html;
        
        contentArea.innerHTML = newContent;

        // --- QUAN TRỌNG: Nạp Script Logic cho từng trang ---
        await handlePageScript(pageName);

    } catch (error) {
        console.error("Load Page Error:", error);
        contentArea.innerHTML = `<div class="text-red-500 p-10">Lỗi tải trang: ${error.message}. <br>Hãy chắc chắn bạn đang chạy trên Localhost (không mở file trực tiếp).</div>`;
    }
}

// 5. Xử lý nạp JS theo thứ tự (Sequential Loading)
async function handlePageScript(pageName) {
    if (pageName === 'home') {
        // Trang Home cần 3 file này theo đúng thứ tự
        await loadScript('js/utils.js');
        await loadScript('js/postService.js');
        await loadScript('js/home.js');
        
        // Sau khi nạp xong mới chạy init
        if (window.homeManager) window.homeManager.init();
    } 
    else if (pageName === 'profile' || pageName === 'edit_profile') {
        await loadScript('js/profile.js');
        if (window.profileManager) window.profileManager.init();
    }
}

// Hàm nạp 1 script và trả về Promise (để dùng await)
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // Nếu script đã có trong DOM rồi thì bỏ qua
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// 6. Xử lý Logout
function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
    window.location.href = "login.html";
}