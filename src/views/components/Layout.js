import { Header } from './Header.js';
import { Sidebar } from './Sidebar.js';
import { authState } from '../../state/authState.js';

/**
 * Main Layout Component
 * Bao gồm Header, Sidebar và Content area
 */

/**
 * Render layout
 * @param {string} content - Main content HTML
 * @param {Object} options - Layout options
 * @returns {string} Complete layout HTML
 */
export const Layout = (content, options = {}) => {
    const { showSidebar = true, fullWidth = false } = options;
    const isAuthenticated = authState.isAuthenticated();

    if (!isAuthenticated) {
        // Layout cho trang public (login, register)
        return content;
    }

    return `
        ${Header()}
        
        <div class="flex min-h-screen pt-16">
            ${showSidebar ? `
                <aside class="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
                    ${Sidebar()}
                </aside>
            ` : ''}
            
            <main class="${showSidebar ? 'ml-64' : ''} flex-1 ${fullWidth ? '' : 'max-w-6xl mx-auto'} p-6">
                ${content}
            </main>
        </div>
    `;
};

export default Layout;
