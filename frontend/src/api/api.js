import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000, // 10 second timeout
});

// Add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${API_URL}/accounts/token/refresh/`, {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                localStorage.setItem('accessToken', newAccessToken);

                // Update the failed request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');

                // Only redirect if not already on login page
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// --------------------- API Objects ---------------------

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products/', { params }),
    getBySlug: (slug) => api.get(`/products/${slug}/`),
    getFeatured: () => api.get('/products/featured/'),
    getNewArrivals: () => api.get('/products/new_arrivals/'),
    getBestsellers: () => api.get('/products/bestsellers/'),
    getOnSale: () => api.get('/products/on_sale/'),
    search: (query) => api.get('/products/search/', { params: { q: query } }),
    getRelated: (slug) => api.get(`/products/${slug}/related/`),
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/categories/'),
    getBySlug: (slug) => api.get(`/categories/${slug}/`),
    getRoot: () => api.get('/categories/root/'),
    getTree: () => api.get('/categories/tree/'),
    getFeatured: () => api.get('/categories/featured/'),
    getSubcategories: (slug) => api.get(`/categories/${slug}/subcategories/`),
};

// Brands API
export const brandsAPI = {
    getAll: () => api.get('/brands/'),
    getBySlug: (slug) => api.get(`/brands/${slug}/`),
    getFeatured: () => api.get('/brands/featured/'),
};

// Shipping API
export const shippingAPI = {
    getOptions: () => api.get('/shipping-options/'),
    getAvailable: (total) => api.get('/shipping-options/available/', { params: { total } }),
};

// Auth API
export const authAPI = {
    register: (userData) => api.post('/accounts/register/', userData),
    login: (credentials) => api.post('/accounts/login/', credentials),
    logout: (refresh) => api.post('/accounts/logout/', { refresh }),
    getProfile: () => api.get('/accounts/profile/'),
    updateProfile: (data) => api.patch('/accounts/profile/', data),
    updateProfilePicture: (formData) => {
        return api.post('/accounts/profile/avatar/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteProfilePicture: () => api.delete('/accounts/profile/avatar/'),
    changePassword: (passwordData) => api.post('/accounts/change-password/', passwordData),
};

// Orders API
export const ordersAPI = {
    getAll: () => api.get('/orders/'),
    getById: (id) => api.get(`/orders/${id}/`),
    create: (orderData) => api.post('/orders/', orderData),
    cancel: (id) => api.post(`/orders/${id}/cancel/`),
    delete: (id) => api.delete(`/orders/${id}/`),
};

// Reviews API
export const reviewsAPI = {
    getByProduct: (productSlug) => api.get('/reviews/', { params: { product: productSlug } }),
    getProductStats: (productSlug) => api.get(`/reviews/product/${productSlug}/stats/`),
    checkReview: (productId) => api.get(`/reviews/check/${productId}/`),
    create: (reviewData) => api.post('/reviews/', reviewData),
    update: (id, reviewData) => api.patch(`/reviews/${id}/`, reviewData),
    delete: (id) => api.delete(`/reviews/${id}/`),
    getMyReviews: () => api.get('/reviews/my_reviews/'),
};

// Wishlist API
export const wishlistAPI = {
    getAll: () => api.get('/wishlist/'),
    add: (productId) => api.post('/wishlist/', { product: productId }),
    remove: (id) => api.delete(`/wishlist/${id}/`),
    toggle: (productId) => api.post(`/wishlist/toggle/${productId}/`),
    check: (productId) => api.get(`/wishlist/check/${productId}/`),
    clear: () => api.delete('/wishlist/clear/'),
};

// Payments API
export const paymentsAPI = {
    process: (paymentData) => api.post('/payments/process/', paymentData),
    getAll: () => api.get('/payments/'),
    getById: (id) => api.get(`/payments/${id}/`),
    getByOrder: (orderId) => api.get(`/payments/order/${orderId}/`),
};

// Health Check API
export const healthAPI = {
    check: () => api.get('/health/'),
};

export default api;