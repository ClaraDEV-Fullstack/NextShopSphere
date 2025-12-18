import { useState } from 'react';
import { useSelector } from 'react-redux';
import { HiPencil, HiTrash, HiCheckBadge } from 'react-icons/hi2';
import StarRating from '../common/StarRating';
import ReviewForm from './ReviewForm';
import { reviewsAPI } from '../../api/api';
import toast from 'react-hot-toast';

const ReviewList = ({ reviews, productId, onReviewChange }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const handleUpdateReview = async (reviewData) => {
        try {
            await reviewsAPI.update(editingId, reviewData);
            toast.success('Review updated successfully');
            setEditingId(null);
            onReviewChange();
        } catch (error) {
            const msg = error.response?.data?.detail || 'Failed to update review';
            toast.error(msg);
            throw error;
        }
    };

    const handleDeleteReview = async (reviewId) => {
        setDeletingId(reviewId);
        try {
            await reviewsAPI.delete(reviewId);
            toast.success('Review deleted successfully');
            onReviewChange();
        } catch (error) {
            toast.error('Failed to delete review');
        } finally {
            setDeletingId(null);
        }
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8 text-secondary-500">
                No reviews yet. Be the first to review this product!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => {
                const isOwner = isAuthenticated && user?.id === review.user;
                const isEditing = editingId === review.id;

                if (isEditing) {
                    return (
                        <ReviewForm
                            key={review.id}
                            productId={productId}
                            existingReview={review}
                            onSubmit={handleUpdateReview}
                            onCancel={() => setEditingId(null)}
                        />
                    );
                }

                return (
                    <div key={review.id} className="border-b border-secondary-100 pb-6 last:border-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                    {review.user_avatar ? (
                                        <img src={review.user_avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span className="text-primary-600 font-semibold">
                      {review.user_name?.charAt(0).toUpperCase()}
                    </span>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-secondary-900">{review.user_name}</span>
                                        {review.is_verified_purchase && (
                                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <HiCheckBadge className="w-3 h-3" />
                        Verified Purchase
                      </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={review.rating} readonly size="sm" />
                                        <span className="text-xs text-secondary-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions for owner */}
                            {isOwner && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditingId(review.id)}
                                        className="p-2 text-secondary-400 hover:text-primary-600 transition"
                                    >
                                        <HiPencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        disabled={deletingId === review.id}
                                        className="p-2 text-secondary-400 hover:text-red-600 transition disabled:opacity-50"
                                    >
                                        {deletingId === review.id ? (
                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <HiTrash className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        {review.title && (
                            <h4 className="font-semibold text-secondary-900 mb-2">{review.title}</h4>
                        )}

                        {/* Comment */}
                        <p className="text-secondary-600">{review.comment}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default ReviewList;