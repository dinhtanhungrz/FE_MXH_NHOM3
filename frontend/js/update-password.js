/**
 * Update Password Function
 * Handles password change with validation and error handling
 */
function updatePassword() {
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMsg = document.getElementById("errorMsg");
    const btn = document.getElementById("updateBtn");

    // Client-side validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showError(errorMsg, "Vui lòng điền tất cả các trường");
        return;
    }

    if (currentPassword.trim().length === 0) {
        showError(errorMsg, "Mật khẩu hiện tại không được để trống");
        return;
    }

    if (newPassword.trim().length === 0) {
        showError(errorMsg, "Mật khẩu mới không được để trống");
        return;
    }

    if (newPassword.length < 6) {
        showError(errorMsg, "Mật khẩu mới phải có ít nhất 6 ký tự");
        return;
    }

    if (confirmPassword.trim().length === 0) {
        showError(errorMsg, "Xác nhận mật khẩu không được để trống");
        return;
    }

    if (newPassword !== confirmPassword) {
        showError(errorMsg, "Mật khẩu mới không khớp");
        return;
    }

    // Clear previous errors and show loading state
    hideError(errorMsg);
    setButtonLoading(btn, true, "Đang cập nhật...");

    // Call authentication service
    AuthService.updatePassword(currentPassword, newPassword, confirmPassword)
        .then(response => {
            // response.data = { message: "..." }
            showSuccess(errorMsg, "Cập nhật mật khẩu thành công!");
            
            // Clear form
            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";

            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1500);
        })
        .catch(error => {
            const errorMessage = AuthService.getErrorMessage(error);
            showError(errorMsg, errorMessage);
            setButtonLoading(btn, false, "Cập nhật mật khẩu");
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

function hideError(element) {
    element.classList.add("hidden");
}

function setButtonLoading(button, isLoading, text) {
    button.disabled = isLoading;
    button.innerText = text;
}
