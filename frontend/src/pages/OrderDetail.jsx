import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiCheckCircle, HiExclamation, HiTrash, HiLockClosed, HiLocationMarker, HiCreditCard, HiCube, HiTruck, HiShieldCheck, HiClock, HiPhone, HiDocumentText, HiChevronRight, HiUser, HiCalendar, HiCurrencyDollar } from 'react-icons/hi';
import { ordersAPI } from '../api/api';
import { getImageUrl } from '../utils/helpers';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await ordersAPI.getById(id);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleCancelOrder = async () => {
        setIsCancelling(true);
        try {
            const response = await ordersAPI.cancel(id);
            setOrder(response.data);
            toast.success('Order cancelled successfully');
            setShowConfirm(false);
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Failed to cancel order';
            toast.error(errorMsg);
        } finally {
            setIsCancelling(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-500',
            processing: 'bg-blue-500',
            shipped: 'bg-indigo-500',
            delivered: 'bg-emerald-500',
            cancelled: 'bg-gray-400',
        };
        return colors[status] || 'bg-gray-400';
    };

    const getStatusBgColor = (status) => {
        const colors = {
            pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
            processing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
            shipped: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
            delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
            cancelled: 'bg-gray-50 text-gray-600 ring-gray-500/20',
        };
        return colors[status] || 'bg-gray-50 text-gray-600';
    };

    const orderSteps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStepIndex = orderSteps.indexOf(order?.status);

    const canCancel = order && ['pending', 'processing'].includes(order.status);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                        <Loader size="lg" />
                    </div>
                    <p className="text-gray-500 font-medium">Loading order...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl mb-6">
                        <HiDocumentText className="w-12 h-12 text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
                    <p className="text-gray-500 mb-8">This order doesn't exist or has been removed.</p>
                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                    >
                        <HiArrowLeft className="w-4 h-4" />
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-blue-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <HiExclamation className="w-8 h-8 text-amber-600" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Cancel Order?</h3>
                        <p className="text-gray-500 text-center text-sm mb-6">
                            Order #{order.id} will be cancelled and items returned to stock.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all"
                                disabled={isCancelling}
                            >
                                No, Keep It
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={isCancelling}
                                className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-5 py-3 rounded-xl font-semibold hover:from-gray-900 hover:to-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isCancelling ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'Yes, Cancel'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Header */}
            <div className="bg-white border-b border-blue-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
                    >
                        <HiArrowLeft className="w-4 h-4" />
                        All Orders
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order #{order.id}</h1>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${getStatusBgColor(order.status)}`}>
                                    {order.status_display}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <HiCalendar className="w-4 h-4" />
                                <span>
                                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                                </span>
                            </div>
                        </div>

                        {canCancel && (
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="self-start flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                            >
                                <HiTrash className="w-4 h-4" />
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Status Messages */}
                {order.status === 'pending' && (
                    <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-8 text-white shadow-lg">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                            <HiCheckCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="font-bold">Order Confirmed!</p>
                            <p className="text-sm text-emerald-100">We'll notify you when it ships.</p>
                        </div>
                    </div>
                )}

                {order.status === 'cancelled' && (
                    <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl mb-8 shadow-sm">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                            <HiExclamation className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-700">Order Cancelled</p>
                            <p className="text-sm text-gray-600">Items have been returned to stock.</p>
                        </div>
                    </div>
                )}

                {/* Order Progress */}
                {order.status !== 'cancelled' && (
                    <div className="mb-10 bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
                        <div className="flex items-center justify-between mb-3">
                            {orderSteps.map((step, index) => (
                                <div key={step} className="flex-1 flex items-center">
                                    <div className="relative flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                            index <= currentStepIndex
                                                ? `${getStatusColor(order.status)} text-white shadow-lg`
                                                : 'bg-gray-200 text-gray-400'
                                        }`}>
                                            {index === 0 && <HiClock className="w-6 h-6" />}
                                            {index === 1 && <HiCube className="w-6 h-6" />}
                                            {index === 2 && <HiTruck className="w-6 h-6" />}
                                            {index === 3 && <HiCheckCircle className="w-6 h-6" />}
                                        </div>
                                        <span className={`text-xs mt-2 font-medium capitalize ${
                                            index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                            {step}
                                        </span>
                                    </div>
                                    {index < orderSteps.length - 1 && (
                                        <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                                            index < currentStepIndex ? getStatusColor(order.status) : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Items */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Items in this order</h2>
                                <span className="text-sm text-gray-500">{order.items.length} items</span>
                            </div>

                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-blue-100">
                                {order.items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center gap-4 p-5 hover:bg-blue-50 transition-colors ${
                                            index !== order.items.length - 1 ? 'border-b border-blue-100' : ''
                                        }`}
                                    >
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                                            {item.product_slug ? (
                                                <Link to={`/products/${item.product_slug}`}>
                                                    <img
                                                        src={getImageUrl(item.product_image)}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </Link>
                                            ) : (
                                                <img
                                                    src={getImageUrl(item.product_image)}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {item.product_slug ? (
                                                <Link
                                                    to={`/products/${item.product_slug}`}
                                                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors block truncate"
                                                >
                                                    {item.product_name}
                                                </Link>
                                            ) : (
                                                <span className="font-medium text-gray-900 block truncate">{item.product_name}</span>
                                            )}
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-gray-500">
                                                    ${item.product_price} × {item.quantity}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                                                    Qty: {item.quantity}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">${item.subtotal}</p>
                                        </div>

                                        {item.product_slug && (
                                            <Link to={`/products/${item.product_slug}`} className="text-gray-300 hover:text-blue-500 transition-colors">
                                                <HiChevronRight className="w-5 h-5" />
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>

                            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 divide-y divide-blue-100">
                                {/* Payment */}
                                <div className="flex items-center gap-4 p-5">
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center shadow-sm">
                                        <HiCreditCard className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Payment</p>
                                        <p className={`font-medium ${
                                            order.payment_status === 'paid' ? 'text-emerald-600' :
                                                order.payment_status === 'pending' ? 'text-amber-600' : 'text-gray-600'
                                        }`}>
                                            {order.payment_status_display}
                                        </p>
                                    </div>
                                    {order.payment_status === 'paid' && (
                                        <HiCheckCircle className="w-6 h-6 text-emerald-500" />
                                    )}
                                </div>

                                {/* Shipping */}
                                <div className="flex items-start gap-4 p-5">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center shadow-sm">
                                        <HiLocationMarker className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Shipping to</p>
                                        <p className="font-medium text-gray-900">{order.shipping_address}</p>
                                        <p className="text-sm text-gray-600">{order.shipping_city}, {order.shipping_country}</p>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <HiPhone className="w-4 h-4" />
                                            {order.shipping_phone}
                                        </p>
                                    </div>
                                </div>

                                {/* Notes */}
                                {order.notes && (
                                    <div className="flex items-start gap-4 p-5">
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center shadow-sm">
                                            <HiDocumentText className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Notes</p>
                                            <p className="text-gray-700">{order.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Summary */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="text-gray-900">${order.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className={parseFloat(order.shipping_cost) === 0 ? 'text-emerald-600 font-medium' : 'text-gray-900'}>
                                            {parseFloat(order.shipping_cost) === 0 ? 'Free' : `$${order.shipping_cost}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tax</span>
                                        <span className="text-gray-900">${order.tax}</span>
                                    </div>
                                    <div className="h-px bg-blue-100 my-4" />
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-blue-600">${order.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            {order.payment_status === 'pending' && order.status !== 'cancelled' && (
                                <Link
                                    to={`/payment/${order.id}`}
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all"
                                >
                                    <HiLockClosed className="w-5 h-5" />
                                    Pay ${order.total}
                                </Link>
                            )}

                            {canCancel && (
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <HiTrash className="w-4 h-4" />
                                    Cancel Order
                                </button>
                            )}

                            {/* Trust */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                <HiShieldCheck className="w-4 h-4 text-emerald-500" />
                                Secure & Protected
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;