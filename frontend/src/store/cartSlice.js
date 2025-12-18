import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCart = () => {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch { return []; }
};

// Save cart to localStorage
const saveCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCart(),
        isOpen: false,
    },
    reducers: {
        addToCart: (state, action) => {
            const { id, name, price, image, slug } = action.payload;
            const existing = state.items.find((item) => item.id === id);

            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ id, name, price, image, slug, quantity: 1 });
            }
            saveCart(state.items);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            saveCart(state.items);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find((item) => item.id === id);
            if (item) {
                item.quantity = Math.max(1, quantity);
            }
            saveCart(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveCart(state.items);
        },
        toggleCart: (state) => { state.isOpen = !state.isOpen; },
        openCart: (state) => { state.isOpen = true; },
        closeCart: (state) => { state.isOpen = false; },
    },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
    state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartCount = (state) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const {
    addToCart, removeFromCart, updateQuantity, clearCart,
    toggleCart, openCart, closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;