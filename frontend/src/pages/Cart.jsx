import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiTrash, HiMinus, HiPlus, HiArrowLeft, HiShoppingBag, HiShieldCheck, HiTruck, HiRefresh } from 'react-icons/hi';
import {
    selectCartItems,
    selectCartTotal,
    removeFromCart,
    updateQuantity,
    clearCart
} from '../store/cartSlice';
import { getImageUrl } from '../utils/helpers';

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
                    {/* Empty Cart Icon */}
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 scale-150"></div>
                        <div className="relative w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-purple-200/50">
                            <HiShoppingBag className="w-16 h-16 text-purple-400" />
                        </div>
                        {/* Floating Elements */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <span className="text-white text-xs font-bold">0</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-purple-800 to-gray-800 bg-clip-text text-transparent mb-4">
                        Your Cart is Empty
                    </h1>
                    <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
                        Looks like you haven't added any items yet. Start exploring our amazing products!
                    </p>

                    <Link
                        to="/products"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
                    >
                        <HiShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Start Shopping
                        <HiArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Features */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        {[
                            { icon: HiTruck, title: 'Free Shipping', desc: 'On orders over $50' },
                            { icon: HiShieldCheck, title: 'Secure Payment', desc: '100% protected' },
                            { icon: HiRefresh, title: 'Easy Returns', desc: '30-day return policy' }
                        ].map((feature, i) => (
                            <div key={i} className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100">
                                <feature.icon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                <p className="font-semibold text-gray-800">{feature.title}</p>
                                <p className="text-sm text-gray-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-40 -right-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-purple-800 to-gray-800 bg-clip-text text-transparent">
                            Shopping Cart
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                    <button
                        onClick={() => dispatch(clearCart())}
                        className="group flex items-center gap-2 px-4 py-2 text-red-500 hover:text-white hover:bg-red-500 rounded-xl border border-red-200 hover:border-red-500 transition-all duration-300"
                    >
                        <HiTrash className="w-4 h-4" />
                        <span className="text-sm font-medium">Clear Cart</span>
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="group bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-purple-200/30 hover:border-purple-100 transition-all duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex gap-5">
                                    {/* Product Image */}
                                    <Link
                                        to={`/products/${item.slug}`}
                                        className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50"
                                    >
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </Link>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <Link
                                                to={`/products/${item.slug}`}
                                                className="font-semibold text-gray-800 hover:text-purple-600 line-clamp-2 transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                    ${item.price.toFixed(2)}
                                                </span>
                                                <span className="text-xs text-gray-400">each</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-3">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                    className="p-2.5 hover:bg-purple-100 text-gray-600 hover:text-purple-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <HiMinus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 text-sm font-bold text-gray-800 min-w-[40px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                    className="p-2.5 hover:bg-purple-100 text-gray-600 hover:text-purple-600 transition-colors"
                                                >
                                                    <HiPlus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => dispatch(removeFromCart(item.id))}
                                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                                            >
                                                <HiTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Item Total */}
                                    <div className="hidden sm:flex flex-col items-end justify-between">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-1">Total</p>
                                            <p className="text-xl font-bold text-gray-800">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Item Total */}
                                <div className="sm:hidden flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-lg font-bold text-gray-800">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                                    <h2 className="text-xl font-bold text-white">Order Summary</h2>
                                    <p className="text-purple-100 text-sm mt-1">Review your order details</p>
                                </div>

                                <div className="p-6">
                                    {/* Summary Items */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span className="font-medium text-gray-800">${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span className="flex items-center gap-2">
                                                <HiTruck className="w-4 h-4" />
                                                Shipping
                                            </span>
                                            <span className={`font-medium ${cartTotal >= 50 ? 'text-green-600' : 'text-gray-800'}`}>
                                                {cartTotal >= 50 ? 'Free' : '$5.00'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tax (10%)</span>
                                            <span className="font-medium text-gray-800">${(cartTotal * 0.1).toFixed(2)}</span>
                                        </div>

                                        {/* Free Shipping Progress */}
                                        {cartTotal < 50 && (
                                            <div className="bg-purple-50 rounded-xl p-4 mt-4">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-purple-700 font-medium">Free shipping at $50</span>
                                                    <span className="text-purple-600">${(50 - cartTotal).toFixed(2)} away</span>
                                                </div>
                                                <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.min((cartTotal / 50) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="border-t border-dashed border-gray-200 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-gray-800">Total</span>
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                        ${(cartTotal + (cartTotal >= 50 ? 0 : 5) + cartTotal * 0.1).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button className="group w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                                        <span className="flex items-center justify-center gap-2">
                                            Proceed to Checkout
                                            <HiArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>

                                    {/* Continue Shopping */}
                                    <Link
                                        to="/products"
                                        className="flex items-center justify-center gap-2 mt-4 py-3 text-gray-500 hover:text-purple-600 font-medium transition-colors"
                                    >
                                        <HiArrowLeft className="w-4 h-4" />
                                        Continue Shopping
                                    </Link>

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                <HiShieldCheck className="w-4 h-4 text-green-500" />
                                                Secure Checkout
                                            </div>
                                            <div className="w-px h-4 bg-gray-200"></div>
                                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                <HiRefresh className="w-4 h-4 text-blue-500" />
                                                Easy Returns
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-400 text-center mb-3">We accept</p>
                                <div className="flex justify-center gap-3">
                                    {['Visa', 'MC', 'Amex', 'PayPal'].map((method) => (
                                        <div key={method} className="w-12 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <span className="text-xs font-bold text-gray-400">{method}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;