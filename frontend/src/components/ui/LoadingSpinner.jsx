const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4',
    };

    return (
        <div className={`${sizes[size]} border-primary-200 border-t-primary-500 rounded-full animate-spin ${className}`} />
    );
};

export const FullPageLoader = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm">
        <div className="text-center">
            <LoadingSpinner size="xl" className="mx-auto mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400 animate-pulse">Loading...</p>
        </div>
    </div>
);

export const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400">Loading...</p>
        </div>
    </div>
);

export default LoadingSpinner;