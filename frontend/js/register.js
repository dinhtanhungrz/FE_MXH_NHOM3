
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


function register() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    
    const errorMsg = document.getElementById("errorMsg");
    const btn = document.getElementById("registerBtn");

    // Validation cơ bản
    if (!firstName || !lastName || !username || !email || !password) {
        showError(errorMsg, "Vui lòng điền đầy đủ thông tin");
        return;
    }

    if (password !== confirmPassword) {
        showError(errorMsg, "Mật khẩu xác nhận không khớp");
        return;
    }

    setButtonLoading(btn, true, "Đang xử lý...");

    // Gom dữ liệu vào object
    const userData = { firstName, lastName, username, email, password, confirmPassword };

    AuthService.register(userData)
        .then(response => {
            showSuccess(errorMsg, "Đăng ký thành công! Đang chuyển hướng...");
            setTimeout(() => window.location.href = "login.html", 1500);
        })
        .catch(error => {
            showError(errorMsg, AuthService.getErrorMessage(error));
            setButtonLoading(btn, false, "Tạo tài khoản");
        });
}

