import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiMinus, HiPlus, HiShoppingCart, HiCheck, HiStar, HiHeart, HiOutlineHeart, HiChevronRight, HiHome, HiTag, HiUser, HiChatAlt2, HiDocumentText } from 'react-icons/hi';
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
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState(null);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [slug]);

    const fetchProduct = async () => {
        setIsLoading(true);
        try {
            const response = await productsAPI.getBySlug(slug);
            setProduct(response.data);

            // Fetch reviews
            fetchReviews(slug, response.data.id);

            // Fetch related products
            if (response.data.category) {
                const relatedRes = await productsAPI.getAll({
                    category: response.data.category.slug
                });
                const data = relatedRes.data;
                const allProducts = Array.isArray(data) ? data : (data.results || []);
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

            const reviewsData = reviewsRes.data;
            setReviews(Array.isArray(reviewsData) ? reviewsData : (reviewsData.results || []));
            setReviewStats(statsRes.data);

            // Check if user has reviewed
            if (isAuthenticated) {
                const checkRes = await reviewsAPI.checkReview(productId);
                setHasReviewed(checkRes.data.has_reviewed);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        for (let i = 0; i < quantity; i++) {
            dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: getImageUrl(product.images?.[0]?.image),
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
            const msg = error.response?.data?.product?.[0] ||
                error.response?.data?.detail ||
                'Failed to submit review';
            toast.error(msg);
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                        <Loader size="lg" />
                    </div>
                    <p className="text-gray-500 font-medium">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl mb-6">
                        <HiTag className="w-12 h-12 text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
                    <p className="text-gray-500 mb-8">This product doesn't exist or has been removed.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                    >
                        <HiChevronRight className="w-4 h-4 rotate-180" />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const images = product.images?.length > 0
        ? product.images
        : [{ image: null, alt_text: product.name }];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Breadcrumb */}
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li>
                            <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
                                <HiHome className="w-4 h-4" />
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link to="/products" className="hover:text-blue-600">Products</Link>
                        </li>
                        {product.category && (
                            <>
                                <li>/</li>
                                <li>
                                    <Link to={`/products?category=${product.category.slug}`} className="hover:text-blue-600">
                                        {product.category.name}
                                    </Link>
                                </li>
                            </>
                        )}
                        <li>/</li>
                        <li className="text-gray-900 truncate max-w-xs">{product.name}</li>
                    </ol>
                </nav>

                {/* Product Details */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Images */}
                    <div>
                        <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl overflow-hidden mb-4 shadow-lg">
                            <img
                                src={getImageUrl(images[selectedImage]?.image)}
                                alt={images[selectedImage]?.alt_text || product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                                            selectedImage === index
                                                ? 'border-blue-500 shadow-lg transform scale-105'
                                                : 'border-transparent hover:border-blue-300'
                                        }`}
                                    >
                                        <img src={getImageUrl(img.image)} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        {product.category && (
                            <Link
                                to={`/products?category=${product.category.slug}`}
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-3 bg-blue-50 px-3 py-1 rounded-full"
                            >
                                <HiTag className="w-4 h-4" />
                                {product.category.name}
                            </Link>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                        {/* Rating Summary */}
                        {reviewStats && reviewStats.total_reviews > 0 && (
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                    <StarRating rating={Math.round(reviewStats.average_rating)} readonly size="md" />
                                </div>
                                <span className="text-gray-600 font-medium">
                                    {reviewStats.average_rating} ({reviewStats.total_reviews} reviews)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-blue-600">${product.price}</span>
                            {product.compare_price && (
                                <>
                                    <span className="text-xl text-gray-400 line-through">${product.compare_price}</span>
                                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        -{product.discount_percentage}%
                                    </span>
                                </>
                            )}
                        </div>

                        {product.short_description && (
                            <p className="text-gray-600 mb-8 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                                {product.short_description}
                            </p>
                        )}

                        {/* Stock */}
                        <div className="flex items-center gap-2 mb-8">
                            {product.in_stock ? (
                                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                                    <HiCheck className="w-5 h-5" />
                                    <span className="font-medium">In Stock ({product.stock} available)</span>
                                </div>
                            ) : (
                                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-full font-medium">
                                    Out of Stock
                                </div>
                            )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-gray-100 disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    <HiMinus className="w-5 h-5" />
                                </button>
                                <span className="px-4 font-medium text-lg min-w-[3rem] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="p-3 hover:bg-gray-100 disabled:opacity-50"
                                    disabled={quantity >= product.stock}
                                >
                                    <HiPlus className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!product.in_stock}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <HiShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>

                            <div className="bg-white border border-gray-300 rounded-xl p-1 shadow-sm">
                                <WishlistButton productId={product.id} size="md" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                            <span>SKU:</span>
                            <span className="font-medium text-gray-700">{product.sku}</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl p-6 mb-16 shadow-sm border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                        <HiDocumentText className="w-6 h-6 text-blue-500" />
                        <h2 className="text-2xl font-bold text-gray-900">Description</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Reviews Section */}
                <div className="mb-16">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <HiChatAlt2 className="w-6 h-6 text-blue-500" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                Customer Reviews
                                {reviewStats && ` (${reviewStats.total_reviews})`}
                            </h2>
                        </div>

                        {isAuthenticated && !hasReviewed && !showReviewForm && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                            >
                                Write a Review
                            </button>
                        )}
                    </div>

                    {/* Review Stats */}
                    {reviewStats && reviewStats.total_reviews > 0 && (
                        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-blue-100">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Average Rating */}
                                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                                    <div className="text-5xl font-bold text-blue-600 mb-2">
                                        {reviewStats.average_rating}
                                    </div>
                                    <StarRating rating={Math.round(reviewStats.average_rating)} readonly size="lg" />
                                    <p className="text-gray-500 mt-2">{reviewStats.total_reviews} reviews</p>
                                </div>

                                {/* Rating Distribution */}
                                <div className="flex-1">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = reviewStats.rating_distribution[star] || 0;
                                        const percentage = reviewStats.total_reviews
                                            ? (count / reviewStats.total_reviews) * 100
                                            : 0;

                                        return (
                                            <div key={star} className="flex items-center gap-3 mb-3">
                                                <span className="text-sm text-gray-600 w-6">{star}★</span>
                                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-500 w-8">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Review Form */}
                    {showReviewForm && (
                        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-blue-100">
                            <ReviewForm
                                productId={product.id}
                                onSubmit={handleSubmitReview}
                                onCancel={() => setShowReviewForm(false)}
                            />
                        </div>
                    )}

                    {/* Login to Review */}
                    {!isAuthenticated && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 text-center border border-blue-100">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                                    <HiUser className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Login to Review</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">Please login to your account to write a review for this product.</p>
                            <Link to="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                                Login
                                <HiChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}

                    {/* Already Reviewed Notice */}
                    {isAuthenticated && hasReviewed && !showReviewForm && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
                            <p className="text-blue-700 flex items-center gap-2">
                                <HiStar className="w-5 h-5" />
                                You have already reviewed this product. You can edit your review below.
                            </p>
                        </div>
                    )}

                    {/* Reviews List */}
                    <ReviewList
                        reviews={reviews}
                        productId={product.id}
                        onReviewChange={() => fetchReviews(slug, product.id)}
                    />
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <HiTag className="w-6 h-6 text-blue-500" />
                            <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                        </div>
                        <ProductGrid products={relatedProducts} isLoading={false} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;