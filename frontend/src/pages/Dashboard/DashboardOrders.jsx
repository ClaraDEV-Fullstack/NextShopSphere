import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlineEye,
    HiOutlineShoppingBag,
    HiOutlineArrowLeft,
    HiOutlineTrash,
    HiExclamation,
    HiOutlineFilter,
    HiOutlineCalendar,
    HiOutlineCurrencyDollar,
    HiOutlineTruck,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineClock,
    HiOutlineRefresh,
    HiOutlineChevronRight,
    HiOutlineSearch
} from 'react-icons/hi';
import { ordersAPI } from '../../api/api';
import { getImageUrl } from '../../utils/helpers';
import Skeleton from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

const DashboardOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [cancellingId, setCancellingId] = useState(null);
    const [confirmId, setConfirmId] = useState(null);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await ordersAPI.getAll();
            const data = response.data;
            setOrders(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error('Failed to fetch orders:', error);
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
            pending: 'bg-amber-100 text-amber-700 border-amber-200',
            processing: 'bg-blue-100 text-blue-700 border-blue-200',
            shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
        };
        return colors[status] || colors.pending;
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

    const formatPrice = (price) => {
        const num = parseFloat(price);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    const getOrderItemImage = (item) => {
        if (item.product_image) {
            return getImageUrl(item.product_image);
        }
        if (item.image) {
            return getImageUrl(item.image);
        }
        if (item.product?.primary_image?.image) {
            return getImageUrl(item.product.primary_image.image);
        }
        if (item.product?.image) {
            return getImageUrl(item.product.image);
        }
        return null;
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    const filterButtons = [
        { key: 'all', label: 'All Orders', icon: HiOutlineShoppingBag },
        { key: 'pending', label: 'Pending', icon: HiOutlineClock },
        { key: 'processing', label: 'Processing', icon: HiOutlineRefresh },
        { key: 'shipped', label: 'Shipped', icon: HiOutlineTruck },
        { key: 'delivered', label: 'Delivered', icon: HiOutlineCheckCircle },
    ];

    // Calculate stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
    };

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
                                Order <span className="font-semibold text-gray-700">#{confirmId}</span> will be cancelled and items returned to stock. This action cannot be undone.
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Back Button */}
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-6 group transition-colors"
                >
                    <HiOutlineArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
                        <p className="text-gray-500 text-lg">Track and manage all your orders in one place</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 mb-0.5">Total</p>
                            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-200">
                            <p className="text-xs text-amber-600 mb-0.5">Pending</p>
                            <p className="text-xl font-bold text-amber-700">{stats.pending}</p>
                        </div>
                        <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                            <p className="text-xs text-emerald-600 mb-0.5">Delivered</p>
                            <p className="text-xl font-bold text-emerald-700">{stats.delivered}</p>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <HiOutlineFilter className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">Filter Orders</h2>
                                <p className="text-sm text-gray-500">{filteredOrders.length} orders found</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {filterButtons.map((btn) => {
                                const Icon = btn.icon;
                                return (
                                    <button
                                        key={btn.key}
                                        onClick={() => setFilter(btn.key)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                            filter === btn.key
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{btn.label}</span>
                                        {btn.key !== 'all' && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                                                filter === btn.key ? 'bg-white/20' : 'bg-gray-200'
                                            }`}>
                                                {stats[btn.key] || 0}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-36 rounded-lg" />
                                        <Skeleton className="h-4 w-48 rounded-lg" />
                                    </div>
                                    <div className="flex gap-3">
                                        <Skeleton className="h-8 w-24 rounded-full" />
                                        <Skeleton className="h-8 w-20 rounded-lg" />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4 border-t border-gray-100">
                                    <div className="flex -space-x-2">
                                        <Skeleton className="w-14 h-14 rounded-xl" />
                                        <Skeleton className="w-14 h-14 rounded-xl" />
                                        <Skeleton className="w-14 h-14 rounded-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-24 mb-2 rounded" />
                                        <Skeleton className="h-3 w-48 rounded" />
                                    </div>
                                    <Skeleton className="h-10 w-32 rounded-xl" />
                                </div>
                            </div>
                        ))
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => {
                            const canCancel = ['pending', 'processing'].includes(order.status);

                            return (
                                <div
                                    key={order.id}
                                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Order Header */}
                                    <div className="p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <span className="text-blue-600 font-bold">#{order.id}</span>
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
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    <span className="capitalize">{order.status_display || order.status}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white rounded-full">
                                                    <HiOutlineCurrencyDollar className="w-4 h-4" />
                                                    <span className="font-bold">${formatPrice(order.total)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-5 border-t border-gray-100">
                                            {/* Product Images */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-3">
                                                    {order.items?.slice(0, 4).map((item, idx) => {
                                                        const imageUrl = getOrderItemImage(item);

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-white shadow-sm overflow-hidden ring-1 ring-gray-100"
                                                            >
                                                                {imageUrl ? (
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt={item.product_name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.style.display = 'none';
                                                                            e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div>';
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                        <HiOutlineShoppingBag className="w-5 h-5 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    {order.items?.length > 4 && (
                                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                                            +{order.items.length - 4}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Items Info */}
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                                        {order.items?.slice(0, 2).map(item => item.product_name).join(', ')}
                                                        {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Spacer */}
                                            <div className="flex-1" />

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                {canCancel && (
                                                    <button
                                                        onClick={() => setConfirmId(order.id)}
                                                        className="flex items-center gap-2 px-4 py-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                                                    >
                                                        <HiOutlineTrash className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Cancel</span>
                                                    </button>
                                                )}
                                                <Link
                                                    to={`/orders/${order.id}`}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 font-medium"
                                                >
                                                    <HiOutlineEye className="w-4 h-4" />
                                                    <span>View Details</span>
                                                    <HiOutlineChevronRight className="w-4 h-4 -mr-1 opacity-70" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Progress Bar (for non-cancelled/delivered) */}
                                    {!['cancelled', 'delivered'].includes(order.status) && (
                                        <div className="px-6 pb-4">
                                            <div className="flex items-center gap-2">
                                                {['pending', 'processing', 'shipped', 'delivered'].map((step, idx) => {
                                                    const currentIndex = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status);
                                                    const isActive = idx <= currentIndex;
                                                    const isCurrent = idx === currentIndex;

                                                    return (
                                                        <div key={step} className="flex-1 flex items-center">
                                                            <div className={`h-1.5 flex-1 rounded-full transition-all ${
                                                                isActive
                                                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                                                    : 'bg-gray-200'
                                                            }`} />
                                                            {idx < 3 && (
                                                                <div className={`w-2 h-2 rounded-full mx-1 ${
                                                                    isActive ? 'bg-indigo-500' : 'bg-gray-200'
                                                                }`} />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-3xl p-12 lg:p-16 text-center border border-gray-100 shadow-sm">
                            <div className="max-w-md mx-auto">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <HiOutlineShoppingBag className="w-12 h-12 text-blue-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
                                </h3>
                                <p className="text-gray-500 mb-8">
                                    {filter === 'all'
                                        ? "You haven't placed any orders yet. Start exploring our products and make your first purchase!"
                                        : `You don't have any orders with "${filter}" status. Try a different filter or start shopping.`}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    {filter !== 'all' && (
                                        <button
                                            onClick={() => setFilter('all')}
                                            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                        >
                                            View All Orders
                                        </button>
                                    )}
                                    <Link
                                        to="/products"
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all"
                                    >
                                        <HiOutlineShoppingBag className="w-5 h-5" />
                                        Start Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Pagination/Info */}
                {!isLoading && filteredOrders.length > 0 && (
                    <div className="mt-8 text-center text-sm text-gray-500">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardOrders;