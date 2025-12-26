// src/pages/ProductDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    HiMinus, HiPlus, HiShoppingCart, HiCheck, HiStar,
    HiChevronRight, HiHome, HiTag, HiUser, HiChatAlt2,
    HiDocumentText, HiShare, HiHeart
} from 'react-icons/hi';
import { productsAPI, reviewsAPI } from '../api/api';
import { addToCart, openCart } from '../store/cartSlice';
import Loader from '../components/common/Loader';
import ProductGrid from '../components/products/ProductGrid';
import StarRating from '../components/common/StarRating';
import WishlistButton from '../components/common/WishlistButton';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import { getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Reviews
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState(null);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Active tab for mobile
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchProduct = async () => {
        setIsLoading(true);
        try {
            const response = await productsAPI.getBySlug(slug);
            setProduct(response.data);
            fetchReviews(slug, response.data.id);

            if (response.data.category) {
                const relatedRes = await productsAPI.getAll({ category: response.data.category.slug });
                const allProducts = Array.isArray(relatedRes.data) ? relatedRes.data : (relatedRes.data.results || []);
                const related = allProducts.filter(p => p.id !== response.data.id).slice(0, 4);
                setRelatedProducts(related);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReviews = async (productSlug, productId) => {
        try {
            const [reviewsRes, statsRes] = await Promise.all([
                reviewsAPI.getByProduct(productSlug),
                reviewsAPI.getProductStats(productSlug),
            ]);
            setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : (reviewsRes.data.results || []));
            setReviewStats(statsRes.data);

            if (isAuthenticated) {
                const checkRes = await reviewsAPI.checkReview(productId);
                setHasReviewed(checkRes.data.has_reviewed);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    // At the top, update the handleAddToCart function:
    const handleAddToCart = () => {
        if (!product) return;

        // Get the primary image URL correctly
        let imageUrl = null;

        if (product.images && product.images.length > 0) {
            // Use image_url from the first image
            imageUrl = getImageUrl(product.images[0]);
        } else if (product.primary_image) {
            imageUrl = getImageUrl(product.primary_image);
        }

        for (let i = 0; i < quantity; i++) {
            dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: imageUrl,
                slug: product.slug,
            }));
        }
        dispatch(openCart());
        toast.success(`Added ${quantity} item(s) to cart!`);
    };

    const handleSubmitReview = async (reviewData) => {
        try {
            await reviewsAPI.create(reviewData);
            toast.success('Review submitted successfully!');
            setShowReviewForm(false);
            fetchReviews(slug, product.id);
        } catch (error) {
            const msg = error.response?.data?.product?.[0] || error.response?.data?.detail || 'Failed to submit review';
            toast.error(msg);
            throw error;
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                    <Loader size="lg" />
                    <p className="text-gray-500 mt-4 text-sm">Loading product...</p>
                </div>
            </div>
        );
    }

    // Not Found State
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiTag className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-xl font-bold mb-2">Product Not Found</h1>
                    <p className="text-gray-500 mb-6 text-sm">This product doesn't exist or has been removed.</p>
                    <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors">
                        <HiChevronRight className="w-4 h-4 rotate-180" />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    // Prepare images array - USE image_url field
    const images = [];

    if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
            // Prefer image_url (processed URL from serializer)
            const imgUrl = getImageUrl(img);
            if (imgUrl && !images.find(i => i.image === imgUrl)) {
                images.push({
                    image: imgUrl,
                    alt: img.alt_text || product.name
                });
            }
        });
    }

// Fallback if no images
    if (images.length === 0) {
        images.push({
            image: '/placeholder-product.jpg',
            alt: product.name
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">

            {/* Breadcrumb - Compact */}
            <div className="bg-white border-b border-gray-100">
                <div className="w-[95%] lg:w-[90%] max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-3">
                    <nav className="text-xs md:text-sm">
                        <ol className="flex items-center gap-1.5 md:gap-2 text-gray-500 overflow-x-auto whitespace-nowrap">
                            <li>
                                <Link to="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                    <HiHome className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    <span className="hidden sm:inline">Home</span>
                                </Link>
                            </li>
                            <li className="text-gray-300">/</li>
                            <li>
                                <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
                            </li>
                            {product.category && (
                                <>
                                    <li className="text-gray-300">/</li>
                                    <li>
                                        <Link to={`/products?category=${product.category.slug}`} className="hover:text-blue-600 transition-colors">
                                            {product.category.name}
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li className="text-gray-300">/</li>
                            <li className="text-gray-900 font-medium truncate max-w-[120px] md:max-w-xs">{product.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-[95%] lg:w-[90%] max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">

                {/* Product Detail Grid */}
                <div className="grid lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12 mb-8 md:mb-16">

                    {/* Images Section */}
                    <div className="space-y-3 md:space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            {images[selectedImage]?.image ? (
                                <img
                                    src={images[selectedImage].image}
                                    alt={images[selectedImage].alt}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                                    <HiTag className="w-16 h-16 text-gray-300" />
                                </div>
                            )}

                            {/* Discount Badge */}
                            {product.discount_percentage > 0 && (
                                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs md:text-sm font-bold shadow-lg">
                                    -{product.discount_percentage}%
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-2 right-2 md:top-3 md:right-3 flex flex-col gap-1.5">
                                {product.is_new && (
                                    <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] md:text-xs font-medium">NEW</span>
                                )}
                                {product.is_bestseller && (
                                    <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] md:text-xs font-medium">BESTSELLER</span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-14 h-14 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                                            selectedImage === idx
                                                ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <img src={img.image} alt={img.alt} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4 md:space-y-6">

                        {/* Category Badge */}
                        {product.category && (
                            <Link
                                to={`/products?category=${product.category.slug}`}
                                className="inline-flex items-center gap-1.5 text-xs md:text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full transition-colors"
                            >
                                <HiTag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                {product.category.name}
                            </Link>
                        )}

                        {/* Product Name */}
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        {reviewStats && reviewStats.total_reviews > 0 && (
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                    <HiStar className="w-4 h-4 text-amber-500 fill-current" />
                                    <span className="text-sm font-semibold text-amber-700">{reviewStats.average_rating}</span>
                                </div>
                                <span className="text-xs md:text-sm text-gray-500">
                                    ({reviewStats.total_reviews} {reviewStats.total_reviews === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>
                        )}

                        {/* Price Section */}
                        <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
                            <span className="text-2xl md:text-3xl font-bold text-blue-600">${product.price}</span>
                            {product.compare_price && (
                                <span className="text-lg md:text-xl text-gray-400 line-through">${product.compare_price}</span>
                            )}
                            {product.discount_percentage > 0 && (
                                <span className="text-xs md:text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                                    Save ${(product.compare_price - product.price).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Short Description */}
                        {product.short_description && (
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-100">
                                {product.short_description}
                            </p>
                        )}

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            {product.in_stock ? (
                                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
                                    <HiCheck className="w-4 h-4" />
                                    <span>In Stock</span>
                                    <span className="text-emerald-600">({product.stock} available)</span>
                                </div>
                            ) : (
                                <div className="text-red-700 bg-red-50 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
                                    Out of Stock
                                </div>
                            )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="p-2.5 md:p-3 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <HiMinus className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <span className="px-4 md:px-5 font-semibold text-base md:text-lg min-w-[2.5rem] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                    className="p-2.5 md:p-3 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <HiPlus className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.in_stock}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                            >
                                <HiShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                                Add to Cart
                            </button>

                            {/* Wishlist Button */}
                            <div className="hidden sm:block">
                                <WishlistButton productId={product.id} size="md" />
                            </div>
                        </div>

                        {/* Mobile Wishlist */}
                        <div className="flex sm:hidden gap-2">
                            <WishlistButton productId={product.id} size="md" className="flex-1" />
                            <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <HiShare className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* SKU */}
                        <div className="text-xs md:text-sm text-gray-500 bg-gray-50 p-2.5 md:p-3 rounded-lg inline-flex items-center gap-2">
                            <span>SKU:</span>
                            <span className="font-mono font-medium text-gray-700">{product.sku}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs Section - Mobile Friendly */}
                <div className="mb-8 md:mb-16">
                    {/* Tab Headers */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4 md:mb-6 overflow-x-auto">
                        {[
                            { id: 'description', label: 'Description', icon: HiDocumentText },
                            { id: 'reviews', label: `Reviews (${reviewStats?.total_reviews || 0})`, icon: HiChatAlt2 },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">

                        {/* Description Tab */}
                        {activeTab === 'description' && (
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                                    <HiDocumentText className="w-5 h-5 text-blue-500" />
                                    Product Description
                                </h2>
                                <div className="prose prose-sm md:prose-base max-w-none text-gray-600">
                                    <p className="leading-relaxed whitespace-pre-line">{product.description}</p>
                                </div>

                                {/* Specifications if available */}
                                {product.specifications?.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {product.specifications.map((spec, idx) => (
                                                <div key={idx} className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg text-sm">
                                                    <span className="text-gray-500">{spec.name}</span>
                                                    <span className="font-medium text-gray-900">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div>
                                {/* Review Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <HiChatAlt2 className="w-5 h-5 text-blue-500" />
                                        Customer Reviews
                                    </h2>
                                    {isAuthenticated && !hasReviewed && !showReviewForm && (
                                        <button
                                            onClick={() => setShowReviewForm(true)}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                                        >
                                            Write a Review
                                        </button>
                                    )}
                                </div>

                                {/* Rating Summary */}
                                {reviewStats && reviewStats.total_reviews > 0 && (
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 mb-6">
                                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                                            {/* Average Rating */}
                                            <div className="text-center sm:pr-6 sm:border-r border-blue-200">
                                                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-1">{reviewStats.average_rating}</div>
                                                <StarRating rating={Math.round(reviewStats.average_rating)} readonly size="md" />
                                                <p className="text-xs md:text-sm text-gray-500 mt-1">{reviewStats.total_reviews} reviews</p>
                                            </div>

                                            {/* Rating Distribution */}
                                            <div className="flex-1 space-y-1.5 md:space-y-2">
                                                {[5, 4, 3, 2, 1].map(star => {
                                                    const count = reviewStats.rating_distribution?.[star] || 0;
                                                    const percentage = reviewStats.total_reviews ? (count / reviewStats.total_reviews) * 100 : 0;
                                                    return (
                                                        <div key={star} className="flex items-center gap-2 md:gap-3">
                                                            <span className="text-xs md:text-sm text-gray-600 w-4">{star}</span>
                                                            <HiStar className="w-3.5 h-3.5 text-amber-400 fill-current" />
                                                            <div className="flex-1 h-2 md:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Review Form */}
                                {showReviewForm && (
                                    <div className="mb-6">
                                        <ReviewForm
                                            productId={product.id}
                                            onSubmit={handleSubmitReview}
                                            onCancel={() => setShowReviewForm(false)}
                                        />
                                    </div>
                                )}

                                {/* Login Prompt */}
                                {!isAuthenticated && (
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 text-center border border-blue-100">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <HiUser className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">Login to Review</h3>
                                        <p className="text-sm text-gray-600 mb-4">Please login to write a review for this product.</p>
                                        <Link
                                            to="/login"
                                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Login
                                            <HiChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}

                                {/* Already Reviewed */}
                                {isAuthenticated && hasReviewed && !showReviewForm && (
                                    <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                                        <p className="text-blue-700 flex items-center gap-2 text-sm">
                                            <HiStar className="w-5 h-5" />
                                            You have already reviewed this product.
                                        </p>
                                    </div>
                                )}

                                {/* Reviews List */}
                                <ReviewList
                                    reviews={reviews}
                                    productId={product.id}
                                    onReviewChange={() => fetchReviews(slug, product.id)}
                                />

                                {/* No Reviews */}
                                {(!reviews || reviews.length === 0) && (
                                    <div className="text-center py-8">
                                        <HiChatAlt2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <HiTag className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                                </div>
                                <h2 className="text-lg md:text-2xl font-bold text-gray-900">Related Products</h2>
                            </div>
                            <Link
                                to={`/products?category=${product.category?.slug}`}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                View All
                                <HiChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <ProductGrid products={relatedProducts} isLoading={false} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;