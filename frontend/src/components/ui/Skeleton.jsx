const Skeleton = ({ className = '', variant = 'rectangular' }) => {
    const baseClasses = 'animate-pulse bg-secondary-200 dark:bg-secondary-700';

    const variants = {
        rectangular: 'rounded-lg',
        circular: 'rounded-full',
        text: 'rounded',
    };

    return (
        <div className={`${baseClasses} ${variants[variant]} ${className}`} />
    );
};

export const SkeletonCard = () => (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl p-4 shadow-sm">
        <Skeleton className="w-full h-48 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-10 rounded-full" variant="circular" />
        </div>
    </div>
);

export const SkeletonProductGrid = ({ count = 8 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
);

export default Skeleton;