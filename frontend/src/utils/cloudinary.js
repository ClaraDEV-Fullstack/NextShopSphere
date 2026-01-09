// src/utils/cloudinary.js

export function cloudinaryOptimize(url, width = 400) {
    if (!url) return '';
    if (!url.includes('/upload/')) return url;

    return url.replace(
        '/upload/',
        `/upload/f_auto,q_auto,w_${width}/`
    );
}
