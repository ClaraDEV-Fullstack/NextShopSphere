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

    // Expiry date validation error
    const [expiryError, setExpiryError] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await ordersAPI.getById(orderId);
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

    // Validate expiry date - must be current or future
    const validateExpiry = (value) => {
        if (value.length < 5) return ''; // Not complete yet

        const [month, year] = value.split('/');
        const expMonth = parseInt(month, 10);
        const expYear = parseInt('20' + year, 10); // Convert YY to YYYY

        const now = new Date();
        const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed
        const currentYear = now.getFullYear();

        // Validate month range
        if (expMonth < 1 || expMonth > 12) {
            return 'Invalid month (01-12)';
        }

        // Check if card is expired
        if (expYear < currentYear) {
            return 'Card has expired - year is in the past';
        }

        if (expYear === currentYear && expMonth < currentMonth) {
            return 'Card has expired - date is in the past';
        }

        return '';
    };

    // Handle expiry change with validation
    const handleExpiryChange = (e) => {
        const formatted = formatExpiry(e.target.value);
        setCardExpiry(formatted);

        // Validate when complete (MM/YY = 5 characters)
        if (formatted.length === 5) {
            const validationError = validateExpiry(formatted);
            setExpiryError(validationError);
        } else {
            setExpiryError('');
        }
    };

    // Detect card brand
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

        // Validate expiry date before submission
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

                // Navigate to success page WITH order data
                navigate('/payment/success', {
                    state: {
                        orderId: orderId,
                        order_id: orderId,
                        amount: order.total,
                        total: order.total,
                        transactionId: response.data.payment?.transaction_id ||
                            response.data.transaction_id ||
                            `TXN-${orderId}-${Date.now()}`,
                        transaction_id: response.data.payment?.transaction_id ||
                            response.data.transaction_id ||
                            `TXN-${orderId}-${Date.now()}`,
                        orderDetails: {
                            id: orderId,
                            total: order.total,
                            subtotal: order.subtotal,
                            shipping_cost: order.shipping_cost,
                            tax: order.tax,
                            items_count: order.items?.length || 0,
                            shipping_address: order.shipping_address,
                            shipping_city: order.shipping_city,
                            shipping_country: order.shipping_country,
                        }
                    }
                });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message ||
                err.response?.data?.card_number?.[0] ||
                'Payment failed. Please try again.';
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
            <div className="max-w-lg mx-auto px-4 py-16 text-center bg-white rounded-2xl shadow-lg">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-100 rounded-full">
                        <HiExclamation className="w-10 h-10 text-blue-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                <Link to="/orders" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <HiArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                </Link>
            </div>
        );
    }

    const cardBrand = getCardBrand(cardNumber);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {/* Header */}
            <div className="mb-10">
                <Link to={`/orders/${orderId}`} className="group inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-6">
                    <HiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Order
                </Link>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Payment</h1>
                        <p className="text-gray-600">Complete payment for Order #{order.id}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <HiCurrencyDollar className="w-4 h-4 mr-2" />
                            Amount Due: ${order.total}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Payment Form */}
                <div>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-700">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <HiCreditCard className="w-6 h-6" />
                                Card Details
                            </h2>
                            <p className="text-blue-100 text-sm mt-1">Enter your payment information securely</p>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                {/* Card Number */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                    <div className="relative rounded-lg shadow-sm">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                            placeholder="4242 4242 4242 4242"
                                            maxLength="19"
                                            required
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-20"
                                        />
                                        {cardBrand && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                {cardBrand}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Expiry & CVV */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                        <input
                                            type="text"
                                            value={cardExpiry}
                                            onChange={handleExpiryChange}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            required
                                            className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                expiryError
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        {expiryError && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <HiExclamation className="w-3 h-3" />
                                                {expiryError}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                        <input
                                            type="text"
                                            value={cardCvv}
                                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            placeholder="123"
                                            maxLength="4"
                                            required
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Cardholder Name */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                                    <input
                                        type="text"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm flex items-center gap-2">
                                        <HiExclamation className="w-5 h-5 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isProcessing || expiryError}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing Payment...
                                        </>
                                    ) : (
                                        <>
                                            <HiLockClosed className="w-5 h-5" />
                                            Pay ${order.total}
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-sm text-gray-600 mt-4 flex items-center justify-center gap-1">
                                    <HiShieldCheck className="w-4 h-4 text-green-500" />
                                    Your payment is secure and encrypted
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Test Cards Info */}
                    <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                        <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                            <HiInformationCircle className="w-5 h-5" />
                            Test Card Numbers:
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-800 rounded-full text-xs">✓</span>
                                <code className="bg-white px-2 py-1 rounded border border-blue-200">4242 4242 4242 4242</code> - Visa (Success)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-800 rounded-full text-xs">✓</span>
                                <code className="bg-white px-2 py-1 rounded border border-blue-200">5555 5555 5555 4444</code> - Mastercard (Success)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-800 rounded-full text-xs">✗</span>
                                <code className="bg-white px-2 py-1 rounded border border-blue-200">4000 0000 0000 0002</code> - Declined
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-800 rounded-full text-xs">✗</span>
                                <code className="bg-white px-2 py-1 rounded border border-blue-200">4000 0000 0000 9995</code> - Insufficient funds
                            </li>
                        </ul>
                        <p className="text-xs text-blue-600 mt-3">Use any future expiry date and any 3-digit CVV</p>
                    </div>

                    {/* Portfolio Note */}
                    <div className="mt-4 p-5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-800 flex items-start gap-2">
                            <HiInformationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span><strong>Portfolio Note:</strong> This is a mock payment system for demonstration. In production, this would integrate with Stripe, PayPal, or Flutterwave.</span>
                        </p>
                    </div>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 sticky top-6">
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-700">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <HiTruck className="w-6 h-6" />
                                Order Summary
                            </h2>
                            <p className="text-blue-100 text-sm mt-1">Review your order before payment</p>
                        </div>

                        <div className="p-6">
                            {/* Items */}
                            <div className="space-y-5 mb-8 max-h-96 overflow-y-auto pr-2">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border border-blue-200">
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
                                            <p className="font-medium text-gray-900 truncate">{item.product_name}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Qty: {item.quantity}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            {/* Fixed: Calculate price from subtotal if not available */}
                                            <p className="font-semibold text-gray-900">
                                                ${(item.price || (item.subtotal / item.quantity)).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600">each</p>
                                            <p className="font-bold text-lg text-blue-600 mt-1">
                                                ${item.subtotal}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-blue-100 pt-6">
                                {/* Totals */}
                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">${order.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-medium">
                                            {parseFloat(order.shipping_cost) === 0 ? (
                                                <span className="text-green-600">Free</span>
                                            ) : (
                                                `$${order.shipping_cost}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span className="font-medium">${order.tax}</span>
                                    </div>
                                    <div className="border-t border-blue-100 pt-4">
                                        <div className="flex justify-between text-xl font-bold text-gray-900">
                                            <span>Total</span>
                                            <span className="text-blue-600">${order.total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mt-8 pt-6 border-t border-blue-100">
                                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <HiTruck className="w-5 h-5 text-blue-600" />
                                    Shipping To:
                                </h3>
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <p className="text-sm text-gray-700">
                                        {order.shipping_address}<br />
                                        {order.shipping_city}, {order.shipping_country}<br />
                                        <span className="inline-flex items-center gap-1 mt-2">
                                            <HiInformationCircle className="w-4 h-4 text-blue-600" />
                                            {order.shipping_phone}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Security Note */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <HiShieldCheck className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800">Secure Payment</h3>
                                        <div className="mt-2 text-sm text-green-700">
                                            <p>Your payment information is encrypted and secure. We do not store your card details.</p>
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