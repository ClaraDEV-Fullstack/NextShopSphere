import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    HiShoppingBag,
    HiEye,
    HiTrash,
    HiExclamation,
    HiOutlineCalendar,
    HiOutlineCurrencyDollar,
    HiOutlineTruck,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineClock,
    HiOutlineRefresh,
    HiOutlineChevronRight,
    HiOutlineShoppingCart,
    HiArrowRight
} from 'react-icons/hi';
import { ordersAPI } from '../api/api';
import { getImageUrl } from '../utils/helpers';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [confirmId, setConfirmId] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await ordersAPI.getAll();
            const data = response.data;
            setOrders(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        setCancellingId(orderId);
        try {
            await ordersAPI.cancel(orderId);
            toast.success('Order cancelled successfully');
            fetchOrders();
            setConfirmId(null);
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Failed to cancel order';
            toast.error(errorMsg);
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-50 text-amber-700 border-amber-200',
            processing: 'bg-blue-50 text-blue-700 border-blue-200',
            shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <HiOutlineClock className="w-4 h-4" />,
            processing: <HiOutlineRefresh className="w-4 h-4" />,
            shipped: <HiOutlineTruck className="w-4 h-4" />,
            delivered: <HiOutlineCheckCircle className="w-4 h-4" />,
            cancelled: <HiOutlineXCircle className="w-4 h-4" />,
        };
        return icons[status] || icons.pending;
    };

    const getOrderItemImage = (item) => {
        if (item.product_image) return getImageUrl(item.product_image);
        if (item.image) return getImageUrl(item.image);
        if (item.product?.primary_image?.image) return getImageUrl(item.product.primary_image.image);
        if (item.product?.image) return getImageUrl(item.product.image);
        return null;
    };

    // Calculate stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        inProgress: orders.filter(o => ['processing', 'shipped'].includes(o.status)).length,
        delivered: orders.filter(o => o.status === 'delivered').length,
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
                <div className="text-center">
                    <div className="relative inline-block">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4">
                            <Loader size="lg" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full animate-ping" />
                    </div>
                    <p className="text-gray-500 font-medium">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Confirmation Modal */}
            {confirmId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HiExclamation className="w-10 h-10 text-amber-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
                            <p className="text-gray-500 mb-8">
                                Order <span className="font-semibold text-gray-700">#{confirmId}</span> will be cancelled and items returned to stock.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmId(null)}
                                    className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                    disabled={cancellingId === confirmId}
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={() => handleCancelOrder(confirmId)}
                                    disabled={cancellingId === confirmId}
                                    className="flex-1 bg-gray-900 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {cancellingId === confirmId ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Cancelling...
                                        </>
                                    ) : (
                                        'Yes, Cancel'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Header */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                                <HiShoppingBag className="w-4 h-4" />
                                Order History
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-2">My Orders</h1>
                            <p className="text-blue-100 text-lg">Track, manage and review your orders</p>
                        </div>

                        {/* Stats Cards */}
                        {orders.length > 0 && (
                            <div className="flex gap-3">
                                <div className="px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl text-center min-w-[80px]">
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                    <p className="text-xs text-blue-200">Total</p>
                                </div>
                                <div className="px-5 py-3 bg-amber-500/20 backdrop-blur-sm rounded-2xl text-center min-w-[80px]">
                                    <p className="text-2xl font-bold text-amber-200">{stats.pending}</p>
                                    <p className="text-xs text-amber-200/70">Pending</p>
                                </div>
                                <div className="px-5 py-3 bg-blue-400/20 backdrop-blur-sm rounded-2xl text-center min-w-[80px]">
                                    <p className="text-2xl font-bold text-blue-200">{stats.inProgress}</p>
                                    <p className="text-xs text-blue-200/70">In Transit</p>
                                </div>
                                <div className="px-5 py-3 bg-emerald-500/20 backdrop-blur-sm rounded-2xl text-center min-w-[80px]">
                                    <p className="text-2xl font-bold text-emerald-200">{stats.delivered}</p>
                                    <p className="text-xs text-emerald-200/70">Delivered</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 lg:p-16 text-center border border-gray-100 shadow-sm -mt-8 relative">
                        <div className="max-w-md mx-auto">
                            <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                <HiOutlineShoppingCart className="w-14 h-14 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
                            <p className="text-gray-500 mb-8 text-lg">
                                Looks like you haven't made any purchases yet. Start exploring our amazing products!
                            </p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                            >
                                <HiShoppingBag className="w-5 h-5" />
                                Start Shopping
                                <HiArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 -mt-8">
                        {orders.map((order, index) => {
                            const canCancel = ['pending', 'processing'].includes(order.status);

                            return (
                                <div
                                    key={order.id}
                                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="p-6">
                                        {/* Order Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                                                    <span className="text-white font-bold text-sm">#{order.id}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                                        Order #{order.id}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                                                        <HiOutlineCalendar className="w-4 h-4" />
                                                        <span>
                                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    <span className="capitalize">{order.status_display}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white rounded-full font-bold">
                                                    <HiOutlineCurrencyDollar className="w-4 h-4" />
                                                    ${order.total}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items with Images */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-5 border-t border-gray-100">
                                            {/* Product Images */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-3">
                                                    {order.items.slice(0, 4).map((item, idx) => {
                                                        const imageUrl = getOrderItemImage(item);
                                                        return (
                                                            <div
                                                                key={item.id || idx}
                                                                className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-white shadow-sm overflow-hidden ring-1 ring-gray-100"
                                                            >
                                                                {imageUrl ? (
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt={item.product_name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = '';
                                                                            e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div>';
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                        <HiShoppingBag className="w-5 h-5 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    {order.items.length > 4 && (
                                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                                            +{order.items.length - 4}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Items Summary */}
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                                        {order.items.slice(0, 2).map(item => `${item.quantity}x ${item.product_name}`).join(', ')}
                                                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Spacer */}
                                            <div className="flex-1" />

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                {canCancel && (
                                                    <button
                                                        onClick={() => setConfirmId(order.id)}
                                                        className="flex items-center gap-2 px-4 py-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                                                    >
                                                        <HiTrash className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Cancel</span>
                                                    </button>
                                                )}
                                                <Link
                                                    to={`/orders/${order.id}`}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 font-medium"
                                                >
                                                    <HiEye className="w-4 h-4" />
                                                    <span>View Details</span>
                                                    <HiOutlineChevronRight className="w-4 h-4 -mr-1 opacity-70" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar for Active Orders */}
                                    {!['cancelled', 'delivered'].includes(order.status) && (
                                        <div className="px-6 pb-4">
                                            <div className="flex items-center gap-1">
                                                {['pending', 'processing', 'shipped', 'delivered'].map((step, idx) => {
                                                    const currentIndex = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status);
                                                    const isActive = idx <= currentIndex;

                                                    return (
                                                        <div key={step} className="flex-1 flex items-center">
                                                            <div className={`h-1.5 flex-1 rounded-full transition-all ${
                                                                isActive
                                                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                                                    : 'bg-gray-200'
                                                            }`} />
                                                            {idx < 3 && (
                                                                <div className={`w-2 h-2 rounded-full mx-0.5 ${
                                                                    isActive ? 'bg-indigo-500' : 'bg-gray-200'
                                                                }`} />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                                                <span>Pending</span>
                                                <span>Processing</span>
                                                <span>Shipped</span>
                                                <span>Delivered</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Quick Actions */}
                {orders.length > 0 && (
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Link
                            to="/products"
                            className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <HiShoppingBag className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">Continue Shopping</p>
                                <p className="text-sm text-gray-500">Browse our products</p>
                            </div>
                            <HiOutlineChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </Link>

                        <Link
                            to="/dashboard"
                            className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <HiOutlineCheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">Dashboard</p>
                                <p className="text-sm text-gray-500">View your account</p>
                            </div>
                            <HiOutlineChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                        </Link>

                        <Link
                            to="/contact"
                            className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <HiExclamation className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">Need Help?</p>
                                <p className="text-sm text-gray-500">Contact support</p>
                            </div>
                            <HiOutlineChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;