import { useState } from 'react';
import StarRating from '../common/StarRating';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId, onSubmit, existingReview, onCancel }) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [title, setTitle] = useState(existingReview?.title || '');
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please write a review');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                product: productId,
                rating,
                title: title.trim(),
                comment: comment.trim(),
            });

            if (!existingReview) {
                // Reset form if new review
                setRating(0);
                setTitle('');
                setComment('');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>

            {/* Rating */}
            <div className="mb-4">
                <label className="label">Your Rating *</label>
                <StarRating rating={rating} onRate={setRating} size="lg" />
            </div>

            {/* Title */}
            <div className="mb-4">
                <label className="label">Review Title (optional)</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your review..."
                    className="input"
                    maxLength={200}
                />
            </div>

            {/* Comment */}
            <div className="mb-6">
                <label className="label">Your Review *</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike about this product?"
                    rows={4}
                    className="input"
                    required
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                        </>
                    ) : existingReview ? (
                        'Update Review'
                    ) : (
                        'Submit Review'
                    )}
                </button>

                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn-secondary">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ReviewForm;