/**
 * View Helpers
 * Các hàm tiện ích cho việc render view
 */

/**
 * Render loading spinner
 * @returns {string} Loading HTML
 */
export const renderLoading = () => {
    return `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    `;
};

/**
 * Render error message
 * @param {string} message - Error message
 * @returns {string} Error HTML
 */
export const renderError = (message) => {
    return `
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center space-x-3">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-red-800">${message}</p>
            </div>
        </div>
    `;
};

/**
 * Render empty state
 * @param {string} message - Empty message
 * @param {string} icon - SVG icon path
 * @returns {string} Empty state HTML
 */
export const renderEmpty = (message, icon = null) => {
    const defaultIcon = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
    `;

    return `
        <div class="text-center py-12">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${icon || defaultIcon}
            </svg>
            <p class="text-gray-500 text-lg">${message}</p>
        </div>
    `;
};

/**
 * Render user avatar
 * @param {Object} user - User object
 * @param {string} size - Size class (e.g., 'w-10 h-10')
 * @returns {string} Avatar HTML
 */
export const renderAvatar = (user, size = 'w-10 h-10') => {
    const userName = user?.username || user?.name || 'User';
    const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`;
    
    return `
        <img 
            src="${avatarUrl}" 
            alt="${userName}"
            class="${size} rounded-full object-cover"
        />
    `;
};

/**
 * Render button
 * @param {string} text - Button text
 * @param {string} type - Button type (primary, secondary, danger)
 * @param {string} onClick - Click handler
 * @returns {string} Button HTML
 */
export const renderButton = (text, type = 'primary', onClick = '') => {
    const styles = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
    };

    return `
        <button 
            onclick="${onClick}"
            class="px-4 py-2 rounded-lg font-medium transition ${styles[type] || styles.primary}"
        >
            ${text}
        </button>
    `;
};

/**
 * Render card container
 * @param {string} content - Card content
 * @param {string} classes - Additional classes
 * @returns {string} Card HTML
 */
export const renderCard = (content, classes = '') => {
    return `
        <div class="bg-white rounded-2xl shadow-lg p-6 ${classes}">
            ${content}
        </div>
    `;
};

/**
 * Render badge
 * @param {string} text - Badge text
 * @param {string} color - Badge color (blue, green, red, yellow, gray)
 * @returns {string} Badge HTML
 */
export const renderBadge = (text, color = 'blue') => {
    const colors = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        gray: 'bg-gray-100 text-gray-800',
    };

    return `
        <span class="px-3 py-1 rounded-full text-sm font-medium ${colors[color] || colors.blue}">
            ${text}
        </span>
    `;
};

/**
 * Render modal
 * @param {string} id - Modal ID
 * @param {string} title - Modal title
 * @param {string} content - Modal content
 * @returns {string} Modal HTML
 */
export const renderModal = (id, title, content) => {
    return `
        <div id="${id}" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div class="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 class="text-xl font-bold text-gray-900">${title}</h3>
                    <button onclick="document.getElementById('${id}').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-6">
                    ${content}
                </div>
            </div>
        </div>
    `;
};

export default {
    renderLoading,
    renderError,
    renderEmpty,
    renderAvatar,
    renderButton,
    renderCard,
    renderBadge,
    renderModal,
};
