// axios-config.js
axios.defaults.baseURL = "http://localhost:8080";

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// THÊM ĐOẠN NÀY:
/*
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.warn("Token hết hạn hoặc không hợp lệ, đăng xuất...");
            localStorage.removeItem("accessToken");
            window.location.href = "login.html";
        }
        return Promise.reject(error);
    }
);
*/