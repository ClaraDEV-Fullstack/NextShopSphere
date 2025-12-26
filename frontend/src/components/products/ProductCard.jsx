// src/components/products/ProductCard.jsx

import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HiOutlineShoppingCart, HiOutlineHeart } from 'react-icons/hi';
import { addToCart } from '../../store/cartSlice';
import { getImageUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    // Get image URL - prefer image_url from the serializer
    const imageUrl = getImageUrl(product.primary_image);

    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(
            addToCart({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: imageUrl,  // Use the processed URL
                slug: product.slug,
            })
        );
        toast.success('Added to cart');
    };

    return (
        <Link
            to={`/products/${product.slug}`}
            className="
                group flex flex-col w-full bg-white rounded-xl overflow-hidden
                shadow-sm transition-all duration-300
                sm:hover:shadow-lg sm:hover:-translate-y-1
            "
        >
            {/* IMAGE */}
            <div className="relative w-full h-56 overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 sm:group-hover:scale-110"
                    onError={(e) => {
                        console.warn('Image failed to load:', imageUrl);
                        e.target.src = '/placeholder-product.jpg';
                    }}
                />

                {product.discount_percentage > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount_percentage}%
                    </span>
                )}

                <button
                    onClick={(e) => e.preventDefault()}
                    className="
                        absolute top-2 right-2 p-2 rounded-full bg-white/90
                        shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                        transition
                    "
                    aria-label="Wishlist"
                >
                    <HiOutlineHeart className="w-5 h-5 text-gray-700" />
                </button>

                {!product.in_stock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* INFO */}
            <div className="flex flex-col p-4 flex-1">
                {product.category && (
                    <p className="text-[11px] uppercase text-gray-500 mb-1">
                        {product.category.name}
                    </p>
                )}

                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
                    {product.name}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-lg font-bold text-gray-900">
                            ${product.price}
                        </span>
                        {product.compare_price && (
                            <span className="block text-xs text-gray-400 line-through">
                                ${product.compare_price}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!product.in_stock}
                        className={`
                            p-2.5 rounded-lg transition
                            ${
                            product.in_stock
                                ? 'bg-primary-600 text-white active:scale-95'
                                : 'bg-gray-200 text-gray-400'
                        }
                        `}
                    >
                        <HiOutlineShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;