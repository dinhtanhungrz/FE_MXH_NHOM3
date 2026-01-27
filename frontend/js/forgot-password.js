/**
 * Forgot Password Function
 * Handles password reset request with validation and error handling
 */
function forgotPassword() {
    const email = document.getElementById("email").value;
    const msg = document.getElementById("msg");
    const btn = document.getElementById("resetBtn");

    // Client-side validation
    if (!email || email.trim().length === 0) {
        showError(msg, "Email không được để trống");
        return;
    }

    // Email format validation
    if (!isValidEmail(email)) {
        showError(msg, "Email không hợp lệ");
        return;
    }

    // Clear previous messages and show loading state
    hideMessage(msg);
    setButtonLoading(btn, true, "Đang gửi...");

    // Call authentication service
    AuthService.forgotPassword(email)
        .then(response => {
            showSuccess(msg, "Link đặt lại mật khẩu đã được gửi đến email của bạn");
            setButtonLoading(btn, false, "Gửi liên kết");
        })
        .catch(error => {
            const errorMessage = AuthService.getErrorMessage(error);
            showError(msg, errorMessage);
            setButtonLoading(btn, false, "Gửi liên kết");
        });
}

/**
 * Helper Functions for UI Management
 */
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

function hideMessage(element) {
    element.classList.add("hidden");
}

function setButtonLoading(button, isLoading, text) {
    button.disabled = isLoading;
    button.innerText = text;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

