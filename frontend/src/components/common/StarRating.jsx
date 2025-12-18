import { HiStar } from 'react-icons/hi';

const StarRating = ({ rating, onRate, size = 'md', readonly = false }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
    };

    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readonly && onRate && onRate(star)}
                    disabled={readonly}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition`}
                >
                    <HiStar
                        className={`${sizes[size]} ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRating;