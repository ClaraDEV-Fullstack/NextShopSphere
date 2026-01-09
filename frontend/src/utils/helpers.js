// src/utils/helpers.js

// ========== BACKEND CONFIGURATION ==========

// Backend URLs for different environments
const getBackendUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        return 'https://nextshopsphere.onrender.com';
    }
    return 'http://127.0.0.1:8000';
};

export const BACKEND_URL = getBackendUrl();

// ========== PLACEHOLDER IMAGE ==========

export const PLACEHOLDER_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect fill="#f3f4f6" width="400" height="400"/>
  <g transform="translate(150, 140)">
    <rect fill="#d1d5db" width="100" height="70" rx="8"/>
    <circle fill="#9ca3af" cx="30" cy="25" r="12"/>
    <path fill="#9ca3af" d="M10,70 L40,40 L70,70 Z"/>
    <path fill="#b0b5bc" d="M50,70 L75,50 L100,70 Z"/>
  </g>
  <text x="200" y="260" font-family="system-ui,sans-serif" font-size="14" font-weight="500" fill="#9ca3af" text-anchor="middle">No Image</text>
</svg>
`)}`;

// ========== CLOUDINARY OPTIMIZATION ==========

/**
 * Optimize Cloudinary URL with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
    if (!url || typeof url !== 'string') return url;

    const {
        width = 400,
        height = 400,
        quality = 'auto:good',
        format = 'auto'
    } = options;

    // Check if it's a Cloudinary URL
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        const parts = url.split('/upload/');
        if (parts.length === 2) {
            const transformations = [
                `w_${width}`,
                `h_${height}`,
                'c_fill',
                'g_auto',
                `q_${quality}`,
                `f_${format}`,
                'dpr_auto'
            ].join(',');

            return `${parts[0]}/upload/${transformations}/${parts[1]}`;
        }
    }

    return url;
};

/**
 * Get thumbnail URL (smaller, faster loading)
 * @param {string} url - Original image URL
 * @returns {string} - Thumbnail URL
 */
export const getThumbnailUrl = (url) => {
    return optimizeCloudinaryUrl(url, {
        width: 200,
        height: 200,
        quality: 'auto:low'
    });
};

/**
 * Get placeholder URL (tiny, for blur-up effect)
 * @param {string} url - Original image URL
 * @returns {string|null} - Tiny placeholder URL or null
 */
export const getPlaceholderUrl = (url) => {
    if (!url || typeof url !== 'string') return null;

    if (url.includes('cloudinary.com')) {
        return optimizeCloudinaryUrl(url, {
            width: 20,
            height: 20,
            quality: 10
        });
    }

    return null;
};

// ========== MAIN IMAGE URL GETTER ==========

/**
 * Get optimized image URL from various formats
 * Handles: strings, objects, Cloudinary URLs, relative paths
 * @param {any} imageData - Image data (string, object, or null)
 * @param {object} options - Cloudinary optimization options
 * @returns {string} - Final image URL
 */
export const getImageUrl = (imageData, options = {}) => {
    // Handle null/undefined/empty
    if (!imageData) {
        return PLACEHOLDER_IMAGE;
    }

    // If it's a string
    if (typeof imageData === 'string') {
        // Empty string
        if (imageData.trim() === '') {
            return PLACEHOLDER_IMAGE;
        }

        // Data URL (SVG, base64) - return as is
        if (imageData.startsWith('data:')) {
            return imageData;
        }

        // Already a full URL
        if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
            // Optimize if it's a Cloudinary URL
            if (imageData.includes('cloudinary.com')) {
                return optimizeCloudinaryUrl(imageData, options);
            }
            return imageData;
        }

        // Relative path - prepend backend URL
        const cleanPath = imageData.startsWith('/') ? imageData : `/${imageData}`;
        return `${BACKEND_URL}${cleanPath}`;
    }

    // If it's an object - try different property names
    if (typeof imageData === 'object') {
        // Try image_url first (from updated serializer)
        if (imageData.image_url) {
            return getImageUrl(imageData.image_url, options);
        }

        // Try image field
        if (imageData.image) {
            return getImageUrl(imageData.image, options);
        }

        // Try url field
        if (imageData.url) {
            return getImageUrl(imageData.url, options);
        }

        // Try src field
        if (imageData.src) {
            return getImageUrl(imageData.src, options);
        }
    }

    // Fallback
    return PLACEHOLDER_IMAGE;
};

// ========== PRICE FORMATTING ==========

/**
 * Format price as currency string
 * @param {number|string} price - Price value
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
    if (price === null || price === undefined) return '$0.00';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '$0.00';
    return `$${numPrice.toFixed(2)}`;
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} salePrice - Sale price
 * @returns {number} - Discount percentage (0-100)
 */
export const calculateDiscount = (originalPrice, salePrice) => {
    if (!originalPrice || !salePrice) return 0;
    const original = parseFloat(originalPrice);
    const sale = parseFloat(salePrice);
    if (original <= sale) return 0;
    return Math.round((1 - sale / original) * 100);
};

// ========== DATE FORMATTING ==========

/**
 * Format date string
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return '';
    }
};

/**
 * Format date with time
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date with time
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return '';
    }
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string} dateString - Date string
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (dateString) => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return formatDate(dateString);
    } catch {
        return '';
    }
};

// ========== STRING UTILITIES ==========

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Slugify a string
 * @param {string} text - Text to slugify
 * @returns {string} - Slugified text
 */
export const slugify = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// ========== NUMBER UTILITIES ==========

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
};

/**
 * Format large numbers (e.g., 1.5K, 2.3M)
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatCompactNumber = (num) => {
    if (num === null || num === undefined) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
};

// ========== VALIDATION UTILITIES ==========

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean} - Is empty
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

// ========== LOCAL STORAGE UTILITIES ==========

/**
 * Safely get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} - Stored value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
};

/**
 * Safely set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setStorageItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeStorageItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};