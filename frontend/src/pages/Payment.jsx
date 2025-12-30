// src/pages/Payment.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft, HiLockClosed, HiCreditCard, HiExclamation, HiShieldCheck, HiTruck, HiCurrencyDollar, HiInformationCircle } from 'react-icons/hi';
import { ordersAPI, paymentsAPI } from '../api/api';
import { getImageUrl } from '../utils/helpers';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Payment = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Card form state
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryError, setExpiryError] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await ordersAPI.getById(orderId);
            console.log('Payment - Order data:', response.data);
            console.log('Payment - Order items:', response.data.items);
            setOrder(response.data);

            if (response.data.payment_status === 'paid') {
                toast.success('This order is already paid');
                navigate(`/orders/${orderId}`);
            }
        } catch (err) {
            console.error('Error:', err);
            toast.error('Failed to load order');
        } finally {
            setIsLoading(false);
        }
    };

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : value;
    };

    // Format expiry date
    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    // Validate expiry date
    const validateExpiry = (value) => {
        if (value.length < 5) return '';
        const [month, year] = value.split('/');
        const expMonth = parseInt(month, 10);
        const expYear = parseInt('20' + year, 10);
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        if (expMonth < 1 || expMonth > 12) return 'Invalid month (01-12)';
        if (expYear < currentYear) return 'Card has expired';
        if (expYear === currentYear && expMonth < currentMonth) return 'Card has expired';
        return '';
    };

    const handleExpiryChange = (e) => {
        const formatted = formatExpiry(e.target.value);
        setCardExpiry(formatted);
        if (formatted.length === 5) {
            setExpiryError(validateExpiry(formatted));
        } else {
            setExpiryError('');
        }
    };

    const getCardBrand = (number) => {
        const n = number.replace(/\s+/g, '');
        if (n.startsWith('4')) return 'Visa';
        if (n.startsWith('5') || n.startsWith('2')) return 'Mastercard';
        if (n.startsWith('3')) return 'Amex';
        if (n.startsWith('6')) return 'Discover';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const expiryValidation = validateExpiry(cardExpiry);
        if (expiryValidation) {
            setExpiryError(expiryValidation);
            toast.error(expiryValidation);
            return;
        }

        setIsProcessing(true);

        try {
            const response = await paymentsAPI.process({
                order_id: parseInt(orderId),
                card_number: cardNumber.replace(/\s+/g, ''),
                card_expiry: cardExpiry,
                card_cvv: cardCvv,
                card_holder_name: cardName,
            });

            if (response.data.status === 'success') {
                toast.success('Payment successful!');
                navigate('/payment/success', {
                    state: {
                        orderId: orderId,
                        amount: order.total,
                        transactionId: response.data.payment?.transaction_id || `TXN-${orderId}-${Date.now()}`,
                        orderDetails: {
                            id: orderId,
                            total: order.total,
                            items_count: order.items?.length || 0,
                        }
                    }
                });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.card_number?.[0] || 'Payment failed';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <Loader size="lg" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-sm w-full mx-auto px-4 py-8 sm:py-12 md:py-16 text-center bg-white rounded-xl sm:rounded-2xl shadow-lg">
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="p-3 sm:p-4 bg-blue-100 rounded-full">
                            <HiExclamation className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Order Not Found</h1>
                    <Link to="/orders" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base">
                        <HiArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const cardBrand = getCardBrand(cardNumber);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8 md:mb-10">
                    <Link
                        to={`/orders/${orderId}`}
                        className="group inline-flex items-center text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-3 sm:mb-4 md:mb-6"
                    >
                        <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Order
                    </Link>
                    <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Payment</h1>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600">Complete payment for Order #{order.id}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                            <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                                <HiCurrencyDollar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                                Amount Due: ${order.total}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
                    {/* Payment Form */}
                    <div className="order-2 lg:order-1">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-blue-100">
                            <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-indigo-700">
                                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2">
                                    <HiCreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                                    Card Details
                                </h2>
                                <p className="text-blue-100 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">Enter your payment information securely</p>
                            </div>

                            <div className="p-4 sm:p-5 md:p-6">
                                <form onSubmit={handleSubmit}>
                                    {/* Card Number */}
                                    <div className="mb-4 sm:mb-5 md:mb-6">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Card Number</label>
                                        <div className="relative rounded-lg shadow-sm">
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                placeholder="4242 4242 4242 4242"
                                                maxLength="19"
                                                required
                                                className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-16 sm:pr-20"
                                            />
                                            {cardBrand && (
                                                <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs md:text-sm font-medium text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                                    {cardBrand}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expiry & CVV */}
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                value={cardExpiry}
                                                onChange={handleExpiryChange}
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                required
                                                className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                    expiryError ? 'border-red-500 focus:ring-red-500' : 'border border-gray-300'
                                                }`}
                                            />
                                            {expiryError && (
                                                <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                                                    <HiExclamation className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{expiryError}</span>
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">CVV</label>
                                            <input
                                                type="text"
                                                value={cardCvv}
                                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                placeholder="123"
                                                maxLength="4"
                                                required
                                                className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Cardholder Name */}
                                    <div className="mb-4 sm:mb-5 md:mb-6">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Cardholder Name</label>
                                        <input
                                            type="text"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            placeholder="John Doe"
                                            required
                                            className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs sm:text-sm flex items-start gap-2">
                                            <HiExclamation className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isProcessing || expiryError}
                                        className="w-full py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-sm sm:text-base font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm sm:text-base">Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <HiLockClosed className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span>Pay ${order.total}</span>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-[10px] sm:text-xs md:text-sm text-gray-600 mt-3 sm:mt-4 flex items-center justify-center gap-1">
                                        <HiShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                                        Your payment is secure and encrypted
                                    </p>
                                </form>
                            </div>
                        </div>

                        {/* Test Cards Info */}
                        <div className="mt-4 sm:mt-5 md:mt-6 p-3 sm:p-4 md:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl">
                            <h4 className="font-medium text-blue-800 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base">
                                <HiInformationCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                Test Card Numbers:
                            </h4>
                            <ul className="text-[10px] sm:text-xs md:text-sm text-blue-700 space-y-1.5 sm:space-y-2">
                                <li className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-green-100 text-green-800 rounded-full text-[10px] sm:text-xs flex-shrink-0">✓</span>
                                    <code className="bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-blue-200 text-[10px] sm:text-xs">4242 4242 4242 4242</code>
                                    <span className="text-green-600">Success</span>
                                </li>
                                <li className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-red-100 text-red-800 rounded-full text-[10px] sm:text-xs flex-shrink-0">✗</span>
                                    <code className="bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-blue-200 text-[10px] sm:text-xs">4000 0000 0000 0002</code>
                                    <span className="text-red-600">Declined</span>
                                </li>
                            </ul>
                            <p className="text-[9px] sm:text-[10px] md:text-xs text-blue-600 mt-2 sm:mt-3">Use any future expiry date and any 3-digit CVV</p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-blue-100 lg:sticky lg:top-6">
                            <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-indigo-700">
                                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2">
                                    <HiTruck className="w-5 h-5 sm:w-6 sm:h-6" />
                                    Order Summary
                                </h2>
                                <p className="text-blue-100 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">Review your order before payment</p>
                            </div>

                            <div className="p-4 sm:p-5 md:p-6">
                                {/* Items */}
                                <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8 max-h-48 sm:max-h-60 md:max-h-80 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex gap-2 sm:gap-3 md:gap-4 p-2 sm:p-2.5 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            {/* Product Image */}
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                                                <img
                                                    src={getImageUrl(item.product_image)}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover"

                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNODAgODVIMTIwVjExNUg4MFY4NVoiIGZpbGw9IiNEMUQ1REIiLz48cGF0aCBkPSJNNzAgMTI1SDEzMFYxMzBINzBWMTI1WiIgZmlsbD0iI0QxRDVEQiIvPjwvc3ZnPg==';
                                                    }}
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate text-[11px] sm:text-xs md:text-sm">{item.product_name}</p>
                                                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                                                    <span className="text-[9px] sm:text-[10px] md:text-xs bg-gray-200 text-gray-600 px-1 sm:px-1.5 py-0.5 rounded">
                                                        Qty: {item.quantity}
                                                    </span>
                                                    <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">
                                                        × ${item.product_price}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right flex-shrink-0">
                                                <p className="font-bold text-blue-600 text-xs sm:text-sm md:text-base">${item.subtotal}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                                    {/* Totals */}
                                    <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                                        <div className="flex justify-between text-[11px] sm:text-xs md:text-sm text-gray-600">
                                            <span>Subtotal</span>
                                            <span className="font-medium">${order.subtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] sm:text-xs md:text-sm text-gray-600">
                                            <span>Shipping</span>
                                            <span className={`font-medium ${parseFloat(order.shipping_cost) === 0 ? 'text-green-600' : ''}`}>
                                                {parseFloat(order.shipping_cost) === 0 ? 'Free' : `$${order.shipping_cost}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[11px] sm:text-xs md:text-sm text-gray-600">
                                            <span>Tax</span>
                                            <span className="font-medium">${order.tax}</span>
                                        </div>

                                        <div className="border-t border-gray-200 pt-2.5 sm:pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-gray-900 text-sm sm:text-base">Total</span>
                                                <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">${order.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                                    <h3 className="font-medium text-gray-900 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                        <HiTruck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                                        Shipping To:
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3 text-[11px] sm:text-xs md:text-sm text-gray-700">
                                        <p>{order.shipping_address}</p>
                                        <p>{order.shipping_city}, {order.shipping_country}</p>
                                        <p className="text-gray-500 mt-0.5 sm:mt-1">{order.shipping_phone}</p>
                                    </div>
                                </div>

                                {/* Security Note */}
                                <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-start gap-1.5 sm:gap-2">
                                        <HiShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="text-[11px] sm:text-xs md:text-sm font-medium text-green-800">Secure Payment</h3>
                                            <p className="text-[10px] sm:text-xs text-green-700 mt-0.5 sm:mt-1">Your payment is encrypted and secure.</p>
                                        </div>
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

export default Payment;