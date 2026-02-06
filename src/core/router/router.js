import { authState } from '../../state/authState.js';
import { APP_CONFIG } from '../config/app.config.js';

/**
 * SPA Router với Hash-based routing và Route Guard
 */
class Router {
    constructor() {
        this.routes = [];
        this.currentRoute = null;
        this.beforeEachHooks = [];
        this.afterEachHooks = [];
    }

    /**
     * Add route
     * @param {string} path - Route path (e.g., '/home', '/profile/:id')
     * @param {Function} component - Component render function
     * @param {Object} options - Route options { requiresAuth: boolean, title: string }
     */
    addRoute(path, component, options = {}) {
        this.routes.push({
            path,
            component,
            requiresAuth: options.requiresAuth || false,
            title: options.title || 'Social Network',
            ...options,
        });
    }

    /**
     * Add multiple routes
     * @param {Array} routes - Array of route objects
     */
    addRoutes(routes) {
        routes.forEach(route => {
            this.addRoute(route.path, route.component, route);
        });
    }

    /**
     * Navigate to a route
     * @param {string} path - Route path
     * @param {boolean} replace - Replace history instead of push
     */
    navigate(path, replace = false) {
        if (replace) {
            window.location.replace(`#${path}`);
        } else {
            window.location.hash = path;
        }
    }

    /**
     * Go back
     */
    back() {
        window.history.back();
    }

    /**
     * Parse path parameters
     * @param {string} routePath - Route pattern (e.g., '/user/:id')
     * @param {string} actualPath - Actual path (e.g., '/user/123')
     * @returns {Object|null} Params object hoặc null nếu không match
     */
    matchRoute(routePath, actualPath) {
        const routeParts = routePath.split('/').filter(Boolean);
        const actualParts = actualPath.split('/').filter(Boolean);

        if (routeParts.length !== actualParts.length) {
            return null;
        }

        const params = {};
        
        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                // Dynamic segment
                const paramName = routeParts[i].substring(1);
                params[paramName] = actualParts[i];
            } else if (routeParts[i] !== actualParts[i]) {
                // Static segment doesn't match
                return null;
            }
        }

        return params;
    }

    /**
     * Find matching route
     * @param {string} path - Current path
     * @returns {Object|null} Matched route with params
     */
    findRoute(path) {
        for (const route of this.routes) {
            const params = this.matchRoute(route.path, path);
            if (params !== null) {
                return { ...route, params };
            }
        }
        return null;
    }

    /**
     * Register navigation guard (before each route)
     * @param {Function} hook - Hook function(to, from, next)
     */
    beforeEach(hook) {
        this.beforeEachHooks.push(hook);
    }

    /**
     * Register navigation guard (after each route)
     * @param {Function} hook - Hook function(to, from)
     */
    afterEach(hook) {
        this.afterEachHooks.push(hook);
    }

    /**
     * Execute before hooks
     * @param {Object} to - Target route
     * @param {Object} from - Current route
     * @returns {Promise<boolean>} Continue navigation or not
     */
    async executeBeforeHooks(to, from) {
        for (const hook of this.beforeEachHooks) {
            const result = await new Promise((resolve) => {
                hook(to, from, (path) => {
                    if (path === false) {
                        resolve(false);
                    } else if (typeof path === 'string') {
                        this.navigate(path, true);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            });

            if (!result) {
                return false;
            }
        }
        return true;
    }

    /**
     * Execute after hooks
     * @param {Object} to - Target route
     * @param {Object} from - Previous route
     */
    async executeAfterHooks(to, from) {
        for (const hook of this.afterEachHooks) {
            await hook(to, from);
        }
    }

    /**
     * Render route
     */
    async render() {
        const hash = window.location.hash.slice(1) || '/';
        const path = hash.split('?')[0]; // Remove query string
        
        const matchedRoute = this.findRoute(path);
        
        if (!matchedRoute) {
            // 404 - Route not found
            this.render404();
            return;
        }

        // Check authentication
        if (matchedRoute.requiresAuth && !authState.isAuthenticated()) {
            console.log('Route requires auth, redirecting to login');
            this.navigate('/login', true);
            return;
        }

        // Execute before hooks
        const shouldContinue = await this.executeBeforeHooks(matchedRoute, this.currentRoute);
        if (!shouldContinue) {
            return;
        }

        try {
            // Render component
            const app = document.getElementById('app');
            if (!app) {
                console.error('App container not found');
                return;
            }

            // Update page title
            document.title = matchedRoute.title;

            // Call component with params
            const html = await matchedRoute.component(matchedRoute.params);
            app.innerHTML = html;

            // Execute after hooks
            await this.executeAfterHooks(matchedRoute, this.currentRoute);

            // Update current route
            this.currentRoute = matchedRoute;

        } catch (error) {
            console.error('Error rendering route:', error);
            this.renderError(error);
        }
    }

    /**
     * Render 404 page
     */
    render404() {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-gray-50">
                    <div class="text-center">
                        <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
                        <p class="text-xl text-gray-600 mb-8">Trang không tồn tại</p>
                        <button 
                            onclick="window.location.hash = '#/'"
                            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Render error page
     * @param {Error} error - Error object
     */
    renderError(error) {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-gray-50">
                    <div class="text-center max-w-md">
                        <h1 class="text-4xl font-bold text-red-600 mb-4">Có lỗi xảy ra</h1>
                        <p class="text-gray-600 mb-8">${error.message || 'Vui lòng thử lại sau'}</p>
                        <button 
                            onclick="window.location.reload()"
                            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Tải lại trang
                        </button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Initialize router
     */
    init() {
        // Listen to hash changes
        window.addEventListener('hashchange', () => {
            this.render();
        });

        // Initial render
        this.render();

        console.log('Router initialized with', this.routes.length, 'routes');
    }
}

// Export singleton instance
export const router = new Router();
export default router;
