import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HiOutlineShoppingCart, HiOutlineHeart } from 'react-icons/hi';
import { addToCart } from '../../store/cartSlice';
import { getImageUrl } from '../../utils/helpers';  // Add this
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: getImageUrl(product.primary_image?.image),  // Update this
            slug: product.slug,
        }));
        toast.success('Added to cart!');
    };

    return (
        <Link to={`/products/${product.slug}`} className="card group">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-t-xl bg-secondary-100">
                <img
                    src={getImageUrl(product.primary_image?.image)}  // Update this
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Discount Badge */}
                {product.discount_percentage > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount_percentage}%
          </span>
                )}

                {/* Wishlist */}
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition">
                    <HiOutlineHeart className="w-5 h-5 text-secondary-600" />
                </button>
            </div>

            {/* Info */}
            <div className="p-4">
                {product.category && (
                    <p className="text-xs text-secondary-500 mb-1">{product.category.name}</p>
                )}

                <h3 className="font-medium text-secondary-800 mb-2 line-clamp-2">{product.name}</h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary-600">${product.price}</span>
                        {product.compare_price && (
                            <span className="text-sm text-secondary-400 line-through">${product.compare_price}</span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!product.in_stock}
                        className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                        <HiOutlineShoppingCart className="w-5 h-5" />
                    </button>
                </div>

                {!product.in_stock && (
                    <p className="text-xs text-red-500 mt-2">Out of stock</p>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;