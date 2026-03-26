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

return `
${Header({ isAuthenticated })}

<div class="flex min-h-screen pt-16">
    ${showSidebar ? `
    <aside class="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r">
        ${Sidebar({ isAuthenticated })}
    </aside>
    ` : ''}

    <main class="${showSidebar ? 'ml-64' : ''} flex-1 p-6">
        ${content}
    </main>
</div>
`;
};

export default Layout;