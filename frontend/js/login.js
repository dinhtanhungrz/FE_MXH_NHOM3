function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");
    const btn = document.getElementById("loginBtn");

    if (!username || !password) {
        showError(errorMsg, "Vui lòng nhập tài khoản và mật khẩu");
        return;
    }

    setButtonLoading(btn, true, "Đang đăng nhập...");

    AuthService.login(username, password)
        .then(response => {
            const { token, tokenType } = response.data.data;
            AuthService.saveToken(token, tokenType);
            showSuccess(errorMsg, "Đăng nhập thành công!");
            setTimeout(() => window.location.href = "menu.html", 1000);
        })
        .catch(error => {
            showError(errorMsg, "Tài khoản hoặc mật khẩu không chính xác");
            setButtonLoading(btn, false, "Đăng nhập");
        });
    }
function showError(element, message) {
    element.classList.remove("hidden");
    element.classList.remove("text-green-400");
    element.classList.add("text-red-400");
    element.innerText = message;
}

function showSuccess(element, message) {
    element.classList.remove("hidden");
    element.classList.remove("text-red-400");
    element.classList.add("text-green-400");
    element.innerText = message;
}

function hideError(element) {
    element.classList.add("hidden");
}

function setButtonLoading(button, isLoading, text) {
    button.disabled = isLoading;
    button.innerText = text;
}
