// Axios Configuration
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers["Content-Type"] = "application/json";

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
