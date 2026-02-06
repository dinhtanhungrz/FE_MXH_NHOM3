/**
 * JWT Utilities
 * Helper functions để làm việc với JWT tokens
 */

/**
 * Decode JWT token (không verify)
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload
 */
export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== "string") {
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Get username from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} Username from token
 */
export const getUsernameFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.sub || null; // 'sub' thường chứa username/subject
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp là trong seconds, convert sang milliseconds
  const expirationTime = decoded.exp * 1000;
  const now = Date.now();

  return now >= expirationTime;
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date
 */
export const getTokenExpirationDate = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  return new Date(decoded.exp * 1000);
};

export default {
  decodeToken,
  getUsernameFromToken,
  isTokenExpired,
  getTokenExpirationDate,
};
