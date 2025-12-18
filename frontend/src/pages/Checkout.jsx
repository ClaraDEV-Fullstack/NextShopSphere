import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiArrowLeft, HiLockClosed, HiHome, HiLocationMarker, HiPhone, HiDocumentText } from 'react-icons/hi';
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import { ordersAPI } from '../api/api';
import { getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        shipping_address: user?.address || '',
        shipping_city: user?.city || '',
        shipping_country: user?.country || '',
        shipping_phone: user?.phone || '',
        notes: '',
    });

    // Calculate totals
    const shippingCost = cartTotal >= 50 ? 0 : 5;
    const tax = cartTotal * 0.1;
    const total = cartTotal + shippingCost + tax;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Please login to checkout');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setIsLoading(true);

        try {
            const orderData = {
                ...formData,
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            };

            const response = await ordersAPI.create(orderData);

            // Clear cart after successful order
            dispatch(clearCart());

            toast.success('Order placed successfully!');
            navigate(`/orders/${response.data.id}`);
        } catch (error) {
            console.error('Order error:', error);
            const errorMsg = error.response?.data?.items?.[0]
                || error.response?.data?.detail
                || 'Failed to place order. Please try again.';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Redirect if cart is empty
    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-7xl mx-auto px-4 py-16 text-center bg-white rounded-2xl shadow-sm">
                <div className="mb-6 p-4 bg-red-50 rounded-full">
                    <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8 max-w-md">Looks like you haven't added any items to your cart yet.</p>
                <Link to="/products" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    // Redirect if not logged in
    if (!isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-7xl mx-auto px-4 py-16 text-center bg-white rounded-2xl shadow-sm">
                <div className="mb-6 p-4 bg-blue-50 rounded-full">
                    <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Login to Checkout</h1>
                <p className="text-gray-600 mb-8 max-w-md">You need to be logged in to complete your purchase.</p>
                <Link to="/login" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                    Login to Your Account
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Header */}
            <div className="mb-10">
                <Link to="/cart" className="group inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 mb-6">
                    <HiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Cart
                </Link>
                <div className="flex items-baseline">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
                    <span className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                        {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>
                <p className="mt-2 text-gray-600">Complete your order by providing your shipping information</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Shipping Form */}
                <div>
                    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipping Information</h2>
                        <p className="text-gray-600 mb-8">Enter your shipping details to complete your order</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Address */}
                            <div>
                                <label htmlFor="shipping_address" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <HiHome className="w-4 h-4 mr-2 text-gray-500" />
                                    Street Address <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="shipping_address"
                                    type="text"
                                    name="shipping_address"
                                    value={formData.shipping_address}
                                    onChange={handleChange}
                                    placeholder="123 Main Street, Apt 4B"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                />
                            </div>

                            {/* City & Country */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="shipping_city" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <HiLocationMarker className="w-4 h-4 mr-2 text-gray-500" />
                                        City <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        id="shipping_city"
                                        type="text"
                                        name="shipping_city"
                                        value={formData.shipping_city}
                                        onChange={handleChange}
                                        placeholder="New York"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="shipping_country" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Country <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        id="shipping_country"
                                        type="text"
                                        name="shipping_country"
                                        value={formData.shipping_country}
                                        onChange={handleChange}
                                        placeholder="United States"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="shipping_phone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <HiPhone className="w-4 h-4 mr-2 text-gray-500" />
                                    Phone Number <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="shipping_phone"
                                    type="tel"
                                    name="shipping_phone"
                                    value={formData.shipping_phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 123-4567"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label htmlFor="notes" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <HiDocumentText className="w-4 h-4 mr-2 text-gray-500" />
                                    Order Notes <span className="text-gray-500 ml-1 text-xs">(optional)</span>
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Special instructions for delivery..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <HiLockClosed className="w-5 h-5" />
                                        Place Order - ${total.toFixed(2)}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100 sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
                        <p className="text-gray-600 mb-6">Review your items before placing the order</p>

                        {/* Items */}
                        <div className="space-y-5 mb-8 max-h-96 overflow-y-auto pr-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                Qty: {item.quantity}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                                        <p className="text-sm text-gray-600">each</p>
                                        <p className="font-bold text-lg text-indigo-600 mt-1">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            {/* Totals */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium">
                                        {shippingCost === 0 ? (
                                            <span className="text-green-600">Free</span>
                                        ) : (
                                            `$${shippingCost.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (10%)</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                                {shippingCost > 0 && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <p className="text-sm text-yellow-700">
                                                    Spend ${(50 - cartTotal).toFixed(2)} more for free shipping!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-800">Secure Checkout</h3>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p>Your payment information is encrypted and secure.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;