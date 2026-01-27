
const AuthService = {

    // Đăng nhập
    login(username, password) {
        return axios.post("/api/auth/login", {
            username: username.trim(),
            password: password.trim()
        });
    },

    // Đăng ký - Truyền vào object chứa đủ các trường
    register(userData) {
        return axios.post("/api/auth/register", {
            firstName: userData.firstName.trim(),
            lastName: userData.lastName.trim(),
            username: userData.username.trim(),
            email: userData.email.trim(),
            password: userData.password.trim(),
            confirmPassword: userData.confirmPassword.trim(),
            role: "" // Backend tự xử lý role mặc định
        });
    },
    
    forgotPassword(email) {
        return axios.post("/api/auth/password", {
            email: email.trim()
        });
    },

    
    updatePassword(currentPassword, newPassword, confirmPassword) {
        return axios.put("/api/users/password", {
            currentPassword: currentPassword.trim(),
            newPassword: newPassword.trim(),
            confirmPassword: confirmPassword.trim()
        });
    },

    
    saveToken(accessToken, tokenType) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("tokenType", tokenType);
    },

    clearToken() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenType");
    },

    
    logout() {
        this.clearToken();
        window.location.href = "/frontend/login.html";
    },

    getErrorMessage(error) {
        // 1. Try response.data.message (most common)
        if (error.response?.data?.message) {
            return error.response.data.message;
        }

        // 2. Try response.data.data (if wrapped)
        if (error.response?.data?.data && typeof error.response.data.data === 'string') {
            return error.response.data.data;
        }

        // 3. Try response.data.error
        if (error.response?.data?.error) {
            return error.response.data.error;
        }

        // 4. Use status code specific messages
        const status = error.response?.status;
        const statusMessages = {
            400: "Dữ liệu không hợp lệ",
            401: "Tên đăng nhập hoặc mật khẩu không đúng",
            403: "Không có quyền truy cập",
            404: "Không tìm thấy",
            409: "Đã tồn tại",
            500: "Lỗi server",
            503: "Server tạm thời không khả dụng"
        };

        if (statusMessages[status]) {
            return statusMessages[status];
        }

        // 5. Network error
        if (!error.response) {
            return "Lỗi kết nối. Vui lòng kiểm tra backend";
        }

        // 6. Default message
        return "Có lỗi xảy ra. Vui lòng thử lại";
    }
};
