async function loadPage(pageName) {
    const contentArea = document.getElementById('main-content');
    
    // 1. Xử lý giao diện Sidebar (Active State)
    // Lấy tất cả các nút có thuộc tính data-page
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    
    navItems.forEach(btn => {
        // Nếu data-page của nút bằng với trang đang load thì thêm active, ngược lại thì xóa
        if (btn.getAttribute('data-page') === pageName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 2. Nạp nội dung trang
    try {
        const response = await fetch(`${pageName}.html`);
        
        if (!response.ok) throw new Error("Page not found");

        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const targetMain = doc.querySelector('main');
        
        contentArea.innerHTML = targetMain ? targetMain.innerHTML : html;

        // 3. Logic riêng cho từng trang (ví dụ Profile cần load JS riêng)
        if (pageName === 'profile') {
            if (window.profileManager) {
                window.profileManager.init();
            } else {
                // Kiểm tra tránh nạp trùng script
                if (!document.getElementById('profile-js-script')) {
                    const script = document.createElement('script');
                    script.id = 'profile-js-script'; // Đặt ID để kiểm soát
                    script.src = 'js/profile.js'; // Đảm bảo đường dẫn đúng
                    document.body.appendChild(script);
                }
            }
        }

    } catch (error) {
        console.error("Lỗi nạp trang:", error);
        contentArea.innerHTML = `<div class="p-10 text-center text-slate-500">Không thể tải nội dung trang.</div>`;
    }
}

// Logic bật/tắt menu More
const moreBtn = document.getElementById('moreMenuBtn');
const moreContent = document.getElementById('moreMenuContent');

if (moreBtn && moreContent) {
    moreBtn.onclick = (e) => {
        e.stopPropagation();
        moreContent.classList.toggle('hidden');
    };

    document.onclick = (e) => {
        if (!moreContent.contains(e.target) && e.target !== moreBtn) {
            moreContent.classList.add('hidden');
        }
    };
}