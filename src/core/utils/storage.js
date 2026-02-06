// LocalStorage wrapper với error handling và type safety
class Storage {
    /**
     * Lưu dữ liệu vào localStorage
     * @param {string} key - Storage key
     * @param {any} value - Giá trị cần lưu (sẽ được JSON.stringify)
     */
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error(`Error saving to localStorage (${key}):`, error);
        }
    }

    /**
     * Lấy dữ liệu từ localStorage
     * @param {string} key - Storage key
     * @returns {any} Parsed value hoặc null nếu không tồn tại
     */
    get(key) {
        try {
            const serializedValue = localStorage.getItem(key);
            return serializedValue ? JSON.parse(serializedValue) : null;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return null;
        }
    }

    /**
     * Xóa một item khỏi localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
        }
    }

    /**
     * Xóa tất cả dữ liệu trong localStorage
     */
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }

    /**
     * Kiểm tra key có tồn tại không
     * @param {string} key - Storage key
     * @returns {boolean}
     */
    has(key) {
        return localStorage.getItem(key) !== null;
    }
}

// Export singleton instance
export const storage = new Storage();
export default storage;
