// Hàm xem trước ảnh khi chọn file
function previewAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => document.getElementById('editPreviewAvatar').src = e.target.result;
        reader.readAsDataURL(input.files[0]);
    }
}

// Hàm xử lý gửi API
async function handleUpdateProfile(event) {
    event.preventDefault();
    
    // 1. Lấy dữ liệu
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const hobby = document.getElementById('hobby').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const avatarFile = document.getElementById('fileInput').files[0];

    // 2. Validation đơn giản
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialChars.test(firstName) || specialChars.test(lastName)) {
        alert("Họ tên không được chứa ký tự đặc biệt!");
        return;
    }

    // 3. Đóng gói FormData
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('hobby', hobby);
    formData.append('phone', phone);
    formData.append('address', address);
    if (avatarFile) formData.append('avatar', avatarFile);

    try {
        const res = await axios.put('/api/users/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.status === 200) {
            alert("Cập nhật thành công!");
            loadPage('profile'); // Quay lại trang cá nhân
        }
    } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || "Không thể lưu thông tin"));
    }
}