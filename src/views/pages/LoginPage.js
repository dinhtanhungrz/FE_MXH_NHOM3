import * as authController from "../../controllers/authController.js";
import { router } from "../../core/router/router.js";
import { showLoading, hideLoading } from "../../core/utils/helpers.js";

/**
 * Login Page
 */
export const LoginPage = async () => {
  // Setup event handlers sau khi DOM render
  setTimeout(() => {
    setupLoginHandlers();
  }, 0);

  return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full">
                <!-- Logo -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h2 class="text-3xl font-bold text-gray-900">Chào mừng trở lại</h2>
                    <p class="mt-2 text-gray-600">Đăng nhập để tiếp tục</p>
                </div>

                <!-- Login Form -->
                <div class="bg-white rounded-2xl shadow-xl p-8">
                    <form id="login-form" class="space-y-6">
                        <!-- Username/Email -->
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                                Tên đăng nhập hoặc Email
                            </label>
                            <input 
                                id="username" 
                                name="username" 
                                type="text" 
                                required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Nhập tên đăng nhập hoặc email"
                            />
                        </div>

                        <!-- Password -->
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div class="relative">
                                <input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    required 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Nhập mật khẩu"
                                />
                                <button 
                                    type="button"
                                    onclick="togglePassword()"
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg id="eye-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Remember & Forgot -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <input 
                                    id="remember" 
                                    name="remember" 
                                    type="checkbox" 
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label for="remember" class="ml-2 block text-sm text-gray-700">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <a href="#/forgot-password" class="text-sm text-blue-600 hover:text-blue-500">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <!-- Submit Button -->
                        <button 
                            type="submit" 
                            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Đăng nhập
                        </button>

                        <!-- Demo Credentials -->
                        <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p class="text-sm font-medium text-blue-800 mb-2">🔐 Demo tài khoản quản lý(admin):</p>
                            <p class="text-xs text-blue-700">Username: <code class="bg-white px-2 py-1 rounded">admin</code></p>
                            <p class="text-xs text-blue-700 mt-1">Password: <code class="bg-white px-2 py-1 rounded">123456</code></p>
                        </div>
                        <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p class="text-sm font-medium text-blue-800 mb-2">🔐 Demo tài khoản người dùng:</p>
                            <p class="text-xs text-blue-700">Username: <code class="bg-white px-2 py-1 rounded">nguyenvana</code></p>
                            <p class="text-xs text-blue-700 mt-1">Password: <code class="bg-white px-2 py-1 rounded">123456</code></p>
                        </div>
                    </form>

                    <!-- Divider -->
                    <div class="relative my-6">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-4 bg-white text-gray-500">Hoặc tiếp tục với</span>
                        </div>
                    </div>

                    <!-- Social Login -->
                    <div class="grid grid-cols-2 gap-4">
                        <button class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Google</span>
                        </button>

                        <button class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                            <svg class="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Facebook</span>
                        </button>
                    </div>

                    <!-- Register Link -->
                    <p class="mt-6 text-center text-sm text-gray-600">
                        Chưa có tài khoản? 
                        <a href="#/register" class="font-medium text-blue-600 hover:text-blue-500">
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>

        <script>
            // Toggle password visibility
            window.togglePassword = function() {
                const passwordInput = document.getElementById('password');
                const eyeIcon = document.getElementById('eye-icon');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>';
                } else {
                    passwordInput.type = 'password';
                    eyeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
                }
            };
        </script>
    `;
};

/**
 * Setup login form handlers
 */
function setupLoginHandlers() {
  const form = document.getElementById("login-form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
      return;
    }

    showLoading();

    const result = await authController.login(username, password);

    hideLoading();

    if (result.role.filter((r) => r === "ROLE_ADMIN").length > 0) {
      router.navigate("/admin");
    } else if (result.role.filter((r) => r === "ROLE_USER").length > 0) {
      router.navigate("/");
    } else {
      router.navigate("/login");
    }
  });
}

export default LoginPage;
