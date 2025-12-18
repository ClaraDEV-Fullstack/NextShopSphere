import { useState, useEffect } from 'react';
import { HiArrowUp } from 'react-icons/hi';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg shadow-primary-500/30 transition-all duration-300 ${
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
            aria-label="Scroll to top"
        >
            <HiArrowUp className="w-5 h-5" />
        </button>
    );
};

export default ScrollToTopButton;