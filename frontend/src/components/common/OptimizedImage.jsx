// src/components/common/OptimizedImage.jsx

import { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({
                            src,
                            alt,
                            className = '',
                            placeholderClassName = '',
                            width = 400,
                            height = 400,
                            quality = 'auto',
                            format = 'auto'
                        }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    // Cloudinary optimization - transform URL for better performance
    const getOptimizedUrl = (url, options = {}) => {
        if (!url) return '/placeholder-product.jpg';

        // Check if it's a Cloudinary URL
        if (url.includes('cloudinary.com')) {
            // Extract the base URL and add transformations
            const parts = url.split('/upload/');
            if (parts.length === 2) {
                const transformations = [
                    `w_${options.width || width}`,
                    `h_${options.height || height}`,
                    'c_fill',
                    `q_${quality}`,
                    `f_${format}`,
                    'dpr_auto'
                ].join(',');

                return `${parts[0]}/upload/${transformations}/${parts[1]}`;
            }
        }

        return url;
    };

    // Get tiny placeholder URL for blur-up effect
    const getPlaceholderUrl = (url) => {
        if (!url) return null;

        if (url.includes('cloudinary.com')) {
            const parts = url.split('/upload/');
            if (parts.length === 2) {
                return `${parts[0]}/upload/w_20,h_20,c_fill,q_10,f_auto,e_blur:1000/${parts[1]}`;
            }
        }

        return null;
    };

    // Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px', // Start loading 100px before entering viewport
                threshold: 0.01
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const optimizedSrc = getOptimizedUrl(src);
    const placeholderSrc = getPlaceholderUrl(src);

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${placeholderClassName}`}>
            {/* Blur placeholder */}
            {placeholderSrc && !isLoaded && (
                <img
                    src={placeholderSrc}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover filter blur-lg scale-110 ${className}`}
                    aria-hidden="true"
                />
            )}

            {/* Skeleton placeholder */}
            {!isLoaded && !placeholderSrc && (
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-700 dark:to-secondary-800 animate-pulse" />
            )}

            {/* Main image - only load when in view */}
            {isInView && !hasError && (
                <img
                    src={optimizedSrc}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    onError={() => {
                        setHasError(true);
                        setIsLoaded(true);
                    }}
                    className={`${className} transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            )}

            {/* Error fallback */}
            {hasError && (
                <img
                    src="/placeholder-product.jpg"
                    alt={alt}
                    className={className}
                />
            )}
        </div>
    );
};

export default OptimizedImage;