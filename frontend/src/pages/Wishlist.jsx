import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiHeart, HiTrash, HiShoppingCart, HiX, HiOutlineShoppingBag, HiEmojiSad } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { wishlistAPI } from '../api/api';
import { addToCart } from '../store/cartSlice';
import { getImageUrl } from '../utils/helpers';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Wishlist = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const fetchWishlist = async () => {
        try {
            const response = await wishlistAPI.getAll();
            const data = response.data;
            setItems(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (itemId) => {
        setRemovingId(itemId);
        try {
            await wishlistAPI.remove(itemId);
            setItems(items.filter(item => item.id !== itemId));
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove item');
        } finally {
            setRemovingId(null);
        }
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: getImageUrl(product.primary_image?.image),
            slug: product.slug,
        }));
        toast.success('Added to cart!');
    };

    const handleClearAll = async () => {
        try {
            await wishlistAPI.clear();
            setItems([]);
            toast.success('Wishlist cleared');
            setShowClearConfirm(false);
        } catch (error) {
            toast.error('Failed to clear wishlist');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                        <Loader size="lg" />
                    </div>
                    <p className="text-gray-500 font-medium">Loading wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 py-8">
            {/* Clear Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-amber-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <HiHeart className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Clear Wishlist?</h3>
                        <p className="text-gray-500 text-center text-sm mb-6">
                            All items will be removed from your wishlist. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-5 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-yellow-600 transition-all"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                                    <HiHeart className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                            </div>
                            <p className="text-gray-600">Save your favorite items for later</p>
                        </div>

                        {items.length > 0 && (
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <HiTrash className="w-4 h-4" />
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>Click on items to view details</span>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-amber-100">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HiEmojiSad className="w-12 h-12 text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Save items you love to your wishlist. They'll appear here so you can find them easily.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md"
                        >
                            <HiOutlineShoppingBag className="w-5 h-5" />
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {items.map((item) => {
                            const product = item.product_details;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-amber-100 group"
                                >
                                    <div className="flex">
                                        {/* Image */}
                                        <Link
                                            to={`/products/${product.slug}`}
                                            className="w-32 h-32 flex-shrink-0 overflow-hidden"
                                        >
                                            <img
                                                src={getImageUrl(product.primary_image?.image)}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0 p-5 flex flex-col">
                                            <div className="flex-1">
                                                <Link
                                                    to={`/products/${product.slug}`}
                                                    className="font-bold text-gray-900 hover:text-amber-600 transition-colors line-clamp-2 mb-1"
                                                >
                                                    {product.name}
                                                </Link>

                                                {product.category && (
                                                    <p className="text-sm text-gray-500 mb-3">{product.category.name}</p>
                                                )}

                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-xl font-bold text-amber-600">${product.price}</span>
                                                    {product.compare_price && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ${product.compare_price}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stock Status */}
                                                <div className="flex items-center gap-2">
                                                    {product.in_stock ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            In Stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!product.in_stock}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <HiShoppingCart className="w-4 h-4" />
                                                    Add to Cart
                                                </button>

                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    disabled={removingId === item.id}
                                                    className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                                                >
                                                    {removingId === item.id ? (
                                                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <HiTrash className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;