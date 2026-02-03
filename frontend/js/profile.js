
window.profileManager = {
    currentUser: null, // Biến lưu trữ thông tin người dùng hiện tại

    // 1. KHỞI TẠO & LẤY DỮ LIỆU (GET)
    async init() {
        // Nếu đã có dữ liệu từ menu.js, hiển thị luôn cho nhanh
        if (window.currentUser) {
            this.distributeData(window.currentUser);
        }

        // Vẫn gọi API để đảm bảo dữ liệu mới nhất
        try {
            const response = await axios.get('/api/users/profile');
            window.currentUser = response.data.data;
            this.distributeData(window.currentUser);
        } catch (error) {
            console.error("Profile Init Error:", error);
        }
    },
        distributeData(user) {
        if (document.getElementById('displayFullName')) {
            this.renderProfile(user);
        } 
        if (document.getElementById('editProfileForm')) {
            this.fillEditForm(user);
        }
    },

    // 2. HIỂN THỊ DỮ LIỆU LÊN TRANG PROFILE
    renderProfile(user) {
        if (!user) return;
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

        // Sử dụng các ID khớp với HTML của bạn
        const elements = {
            'headerFullName': fullName || user.username,
            'displayFullName': fullName || user.username,
            'displayUsername': `@${user.username}`,
            'displayBio': user.hobby || "Chưa có tiểu sử",
            'followingCount': user.followingCount || 0,
            'followersCount': user.followersCount || 0
        };

        for (let id in elements) {
            const el = document.getElementById(id);
            if (el) el.innerText = elements[id];
        }

        const avatarImg = document.getElementById('userAvatar');
        if (avatarImg) {
            avatarImg.src = user.avatarUrl ? `${user.avatarUrl}?t=${new Date().getTime()}` : 'static/images/user.png';
        }
    },
    // 3. ĐIỀN DỮ LIỆU CŨ VÀO FORM EDIT (PRE-FILL)
    fillEditForm(user) {
        if (!user) return;

        // Điền text vào input
        const setValue = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || '';
        };

        setValue('editFirstName', user.firstName);
        setValue('editLastName', user.lastName);
        setValue('editPhone', user.phone);
        setValue('editAddress', user.address);
        setValue('editHobby', user.hobby);

        // Hiển thị ảnh avatar hiện tại
        const previewImg = document.getElementById('editPreviewAvatar');
        if (previewImg) {
            previewImg.src = user.avatarUrl || 'static/images/user.png';
        }
    },

    // 4. XỬ LÝ LƯU CẬP NHẬT (PUT API)
    async handleUpdate(event) {
        event.preventDefault();
        // ... (Giữ nguyên logic FormData của bạn) ...

        try {
            const response = await axios.put('/api/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.code === 200) {
                alert("Cập nhật thành công!");
                // CẬP NHẬT LẠI BIẾN TOÀN CỤC
                window.currentUser = response.data.data;
                // Cập nhật lại giao diện Sidebar ngay lập tức
                if (typeof updateSidebarUI === 'function') updateSidebarUI();
                
                loadPage('profile'); 
            }
        } catch (error) {
            console.log("Update Profile Error:", error);
            alert(error.response?.data?.message || "Lỗi cập nhật");
        }
    }
    // 5. HÀM XEM TRƯỚC ẢNH KHI CHỌN FILE
    /*
    previewImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('editPreviewAvatar').src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    */
};

// Gọi init ngay khi script được load để lấy dữ liệu
profileManager.init();