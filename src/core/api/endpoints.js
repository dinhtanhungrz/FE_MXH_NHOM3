import { APP_CONFIG } from '../config/app.config.js';

/**
 * API Endpoints Helper
 * Cung cấp các hàm tiện ích để build API URLs
 */

/**
 * Build full API URL
 * @param {string} endpoint - Endpoint path
 * @returns {string} Full URL
 */
export const buildUrl = (endpoint) => {
    return `${APP_CONFIG.API_BASE_URL}${endpoint}`;
};

/**
 * Replace URL params
 * @param {string} url - URL template (e.g., "/users/:id")
 * @param {Object} params - Params object (e.g., { id: 123 })
 * @returns {string} URL with replaced params
 */
export const replaceParams = (url, params) => {
    let result = url;
    Object.keys(params).forEach(key => {
        result = result.replace(`:${key}`, params[key]);
    });
    return result;
};

/**
 * Auth endpoints
 */
export const authEndpoints = {
    login: () => APP_CONFIG.API_ENDPOINTS.AUTH.LOGIN,
    logout: () => APP_CONFIG.API_ENDPOINTS.AUTH.LOGOUT,
    refreshToken: () => APP_CONFIG.API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    register: () => APP_CONFIG.API_ENDPOINTS.AUTH.REGISTER,
};

/**
 * User endpoints
 */
export const userEndpoints = {
    me: () => APP_CONFIG.API_ENDPOINTS.USER.ME,
    profile: (userId) => replaceParams(APP_CONFIG.API_ENDPOINTS.USER.PROFILE, { id: userId }),
    update: () => APP_CONFIG.API_ENDPOINTS.USER.UPDATE,
};

/**
 * Post endpoints (sẵn sàng mở rộng)
 */
export const postEndpoints = {
    list: () => APP_CONFIG.API_ENDPOINTS.POST.LIST,
    create: () => APP_CONFIG.API_ENDPOINTS.POST.CREATE,
    detail: (postId) => replaceParams(APP_CONFIG.API_ENDPOINTS.POST.DETAIL, { id: postId }),
    update: (postId) => replaceParams(APP_CONFIG.API_ENDPOINTS.POST.UPDATE, { id: postId }),
    delete: (postId) => replaceParams(APP_CONFIG.API_ENDPOINTS.POST.DELETE, { id: postId }),
};

/**
 * Comment endpoints (sẵn sàng mở rộng)
 */
export const commentEndpoints = {
    list: (postId) => replaceParams(APP_CONFIG.API_ENDPOINTS.COMMENT.LIST, { postId }),
    create: (postId) => replaceParams(APP_CONFIG.API_ENDPOINTS.COMMENT.CREATE, { postId }),
    delete: (commentId) => replaceParams(APP_CONFIG.API_ENDPOINTS.COMMENT.DELETE, { id: commentId }),
};

/**
 * Like endpoints (sẵn sàng mở rộng)
 */
export const likeEndpoints = {
    like: (postId) => replaceParams(APP_CONFIG.API_ENDPOINTS.LIKE.LIKE, { postId }),
    unlike: (postId) => replaceParams(APP_CONFIG.API_ENDPOINTS.LIKE.UNLIKE, { postId }),
};

/**
 * Follow endpoints (sẵn sàng mở rộng)
 */
export const followEndpoints = {
    follow: (userId) => replaceParams(APP_CONFIG.API_ENDPOINTS.FOLLOW.FOLLOW, { userId }),
    unfollow: (userId) => replaceParams(APP_CONFIG.API_ENDPOINTS.FOLLOW.UNFOLLOW, { userId }),
};

export default {
    buildUrl,
    replaceParams,
    auth: authEndpoints,
    user: userEndpoints,
    post: postEndpoints,
    comment: commentEndpoints,
    like: likeEndpoints,
    follow: followEndpoints,
};
