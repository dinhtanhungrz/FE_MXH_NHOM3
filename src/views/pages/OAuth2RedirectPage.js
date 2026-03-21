import { router} from '../../core/router/router.js';
import { authState } from '../../state/authState.js';
import { hideLoading } from '../../core/utils/helpers.js';


/**
 * Xử lý OAuth2 redirect từ backend
 */
export const OAuth2RedirectPage = async () => {
    // Lấy parameters từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const roles = urlParams.get('roles');
    const error = urlParams.get('error');

    // Xử lý lỗi OAuth2
    if (error) {
        console.error('OAuth2 Error:', error);
        return renderOAuth2Error(error);
    }

    // Xử lý thành công
    if (token && roles) {
        try {
            // Parse roles
            const roleArray = roles.split(',');
            
            // Lưu thông tin authentication
            authState.setToken(token);
            authState.setRoles(roleArray);

            // Redirect theo role
            setTimeout(() => {
                if (roleArray.includes('ROLE_ADMIN')) {
                    router.navigate('/admin', true);
                } else {
                    router.navigate('/', true);
                }
            }, 1500);

            return renderOAuth2Success();

        } catch (error) {
            console.error('Error processing OAuth2 redirect:', error);
            return renderOAuth2Error('Có lỗi xảy ra khi xử lý đăng nhập');
        }
    }

    // Trường hợp không có token
    return renderOAuth2Error('Không nhận được thông tin đăng nhập');
};

/**
 * Render success page
 */
function renderOAuth2Success() {
    hideLoading();
    return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Đăng nhập thành công!</h1>
                <p class="text-gray-600 mb-4">Đang chuyển hướng...</p>
                <div class="flex justify-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render error page
 */
function renderOAuth2Error(errorMessage) {
    hideLoading();
    return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50">
            <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Đăng nhập thất bại</h1>
                <p class="text-gray-600 mb-6">${errorMessage}</p>
                <button 
                    onclick="window.location.hash = '#/login'"
                    class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                    Thử lại
                </button>
            </div>
        </div>
    `;
}

export default OAuth2RedirectPage;
