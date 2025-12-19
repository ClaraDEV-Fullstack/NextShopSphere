import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    HiArrowLeft,
    HiCheckCircle,
    HiExclamation,
    HiTrash,
    HiLockClosed,
    HiLocationMarker,
    HiCreditCard,
    HiCube,
    HiTruck,
    HiShieldCheck,
    HiClock,
    HiPhone,
    HiDocumentText,
    HiChevronRight,
    HiCalendar
} from 'react-icons/hi';
import { ordersAPI } from '../api/api';
import { getImageUrl } from '../utils/helpers';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const OrderDetail = () => {
    const { id } = useParams();
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
            pending: 'bg-amber-50 text-amber-700 border-amber-200',
            processing: 'bg-blue-50 text-blue-700 border-blue-200',
            shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-600 border-gray-200';
    };

    const orderSteps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStepIndex = orderSteps.indexOf(order?.status);

    // Only pending orders can be cancelled
    const canCancel = order && order.status === 'pending';

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center mx-auto mb-2">
                        <Loader size="sm" />
                    </div>
                    <p className="text-gray-500 text-xs">Loading...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <HiDocumentText className="w-6 h-6 text-gray-400" />
                    </div>
                    <h1 className="text-base font-bold text-gray-900 mb-1">Order Not Found</h1>
                    <p className="text-gray-500 text-sm mb-4">This order doesn't exist.</p>
                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <HiArrowLeft className="w-4 h-4" />
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-5 max-w-xs w-full shadow-xl">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <HiExclamation className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 text-center mb-1">Cancel Order?</h3>
                        <p className="text-gray-500 text-center text-xs mb-4">
                            Order #{order.id} will be cancelled.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                                disabled={isCancelling}
                            >
                                Keep
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={isCancelling}
                                className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm"
                            >
                                {isCancelling ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'Cancel'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition-colors mb-2"
                    >
                        <HiArrowLeft className="w-3.5 h-3.5" />
                        Back
                    </Link>

                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-lg font-bold text-gray-900">Order #{order.id}</h1>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBgColor(order.status)}`}>
                                    {order.status_display || order.status}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                <HiCalendar className="w-3 h-3" />
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">${order.total}</p>
                            <p className="text-[10px] text-gray-500">{order.items.length} items</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-4">
                {/* Status Alert */}
                {order.status === 'pending' && (
                    <div className="flex items-center gap-2.5 p-3 bg-emerald-500 rounded-lg mb-4 text-white">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <HiCheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-semibold text-xs">Order Confirmed!</p>
                            <p className="text-[10px] text-emerald-100">We'll notify you when it ships.</p>
                        </div>
                    </div>
                )}

                {order.status === 'cancelled' && (
                    <div className="flex items-center gap-2.5 p-3 bg-gray-200 rounded-lg mb-4">
                        <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center flex-shrink-0">
                            <HiExclamation className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 text-xs">Order Cancelled</p>
                            <p className="text-[10px] text-gray-600">Items returned to stock.</p>
                        </div>
                    </div>
                )}

                {/* Progress Tracker */}
                {order.status !== 'cancelled' && (
                    <div className="bg-white rounded-xl p-3 mb-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                            {orderSteps.map((step, index) => (
                                <div key={step} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-shrink-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                            index <= currentStepIndex
                                                ? `${getStatusColor(order.status)} text-white`
                                                : 'bg-gray-200 text-gray-400'
                                        }`}>
                                            {index === 0 && <HiClock className="w-4 h-4" />}
                                            {index === 1 && <HiCube className="w-4 h-4" />}
                                            {index === 2 && <HiTruck className="w-4 h-4" />}
                                            {index === 3 && <HiCheckCircle className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-[9px] mt-1 font-medium capitalize text-center ${
                                            index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                            {step}
                                        </span>
                                    </div>
                                    {index < orderSteps.length - 1 && (
                                        <div className={`h-0.5 flex-1 mx-1 rounded-full ${
                                            index < currentStepIndex ? getStatusColor(order.status) : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* Left Column - Items & Details */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Order Items */}
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-gray-900">Items</h2>
                                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {order.items.length} items
                                </span>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                                        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                                                    className="font-medium text-gray-900 hover:text-primary-600 text-sm truncate block"
                                                >
                                                    {item.product_name}
                                                </Link>
                                            ) : (
                                                <span className="font-medium text-gray-900 text-sm truncate block">
                                                    {item.product_name}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[11px] text-gray-500">
                                                    ${item.product_price} × {item.quantity}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <p className="font-bold text-gray-900 text-sm">${item.subtotal}</p>
                                            <span className="text-[10px] text-gray-500">Qty: {item.quantity}</span>
                                        </div>

                                        {item.product_slug && (
                                            <Link to={`/products/${item.product_slug}`} className="text-gray-300 hover:text-primary-500">
                                                <HiChevronRight className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping & Payment Details */}
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            <div className="px-3 py-2 border-b border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-900">Details</h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {/* Payment */}
                                <div className="flex items-center gap-3 p-3">
                                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <HiCreditCard className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-gray-500">Payment</p>
                                        <p className={`font-medium text-sm ${
                                            order.payment_status === 'paid' ? 'text-emerald-600' :
                                                order.payment_status === 'pending' ? 'text-amber-600' : 'text-gray-600'
                                        }`}>
                                            {order.payment_status_display || order.payment_status}
                                        </p>
                                    </div>
                                    {order.payment_status === 'paid' && (
                                        <HiCheckCircle className="w-5 h-5 text-emerald-500" />
                                    )}
                                </div>

                                {/* Shipping Address */}
                                <div className="flex items-start gap-3 p-3">
                                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <HiLocationMarker className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-gray-500">Shipping Address</p>
                                        <p className="font-medium text-gray-900 text-sm">{order.shipping_address}</p>
                                        <p className="text-xs text-gray-600">{order.shipping_city}, {order.shipping_country}</p>
                                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                                            <HiPhone className="w-3 h-3" />
                                            {order.shipping_phone}
                                        </p>
                                    </div>
                                </div>

                                {/* Notes */}
                                {order.notes && (
                                    <div className="flex items-start gap-3 p-3">
                                        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <HiDocumentText className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-gray-500">Notes</p>
                                            <p className="text-gray-700 text-sm">{order.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary & Actions */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl border border-gray-100 p-4">
                            <h2 className="text-sm font-semibold text-gray-900 mb-3">Summary</h2>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-900">${order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className={parseFloat(order.shipping_cost) === 0 ? 'text-emerald-600 font-medium' : 'text-gray-900'}>
                                        {parseFloat(order.shipping_cost) === 0 ? 'Free' : `$${order.shipping_cost}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="text-gray-900">${order.tax}</span>
                                </div>

                                <div className="h-px bg-gray-100 my-2" />

                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-primary-600">${order.total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            {order.payment_status === 'pending' && order.status !== 'cancelled' && (
                                <Link
                                    to={`/payment/${order.id}`}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 shadow-sm transition-all text-sm"
                                >
                                    <HiLockClosed className="w-4 h-4" />
                                    Pay ${order.total}
                                </Link>
                            )}

                            {canCancel && (
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="w-full py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm border border-gray-200"
                                >
                                    <HiTrash className="w-4 h-4" />
                                    Cancel Order
                                </button>
                            )}

                            <Link
                                to="/orders"
                                className="w-full py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm hover:bg-gray-100"
                            >
                                <HiArrowLeft className="w-4 h-4" />
                                Back to Orders
                            </Link>
                        </div>

                        {/* Trust Badge */}
                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 p-2 bg-gray-50 rounded-lg border border-gray-100">
                            <HiShieldCheck className="w-4 h-4 text-emerald-500" />
                            Secure & Protected
                        </div>

                        {/* Need Help */}
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <p className="text-xs font-medium text-gray-900 mb-1">Need Help?</p>
                            <p className="text-[10px] text-gray-500 mb-2">Contact our support team</p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Contact Support
                                <HiChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;