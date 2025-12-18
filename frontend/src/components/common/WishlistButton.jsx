import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { wishlistAPI } from '../../api/api';
import toast from 'react-hot-toast';

const WishlistButton = ({ productId, size = 'md', showText = false }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    useEffect(() => {
        if (isAuthenticated && productId) {
            checkWishlist();
        }
    }, [isAuthenticated, productId]);

    const checkWishlist = async () => {
        try {
            const response = await wishlistAPI.check(productId);
            setIsWishlisted(response.data.in_wishlist);
        } catch (error) {
            console.error('Error checking wishlist:', error);
        }
    };

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error('Please login to add to wishlist');
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            const response = await wishlistAPI.toggle(productId);
            setIsWishlisted(response.data.action === 'added');
            toast.success(response.data.message);
        } catch (error) {
            toast.error('Failed to update wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`flex items-center gap-2 transition ${
                isWishlisted
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-secondary-400 hover:text-red-500'
            } disabled:opacity-50`}
        >
            {isLoading ? (
                <div className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
            ) : isWishlisted ? (
                <HiHeart className={sizes[size]} />
            ) : (
                <HiOutlineHeart className={sizes[size]} />
            )}

            {showText && (
                <span className="text-sm font-medium">
          {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
            )}
        </button>
    );
};

export default WishlistButton;