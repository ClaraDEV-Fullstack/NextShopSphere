import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineSearch } from 'react-icons/hi';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
                <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
                    Page Not Found
                </h2>
                <p className="text-secondary-500 dark:text-secondary-400 mb-8 max-w-md mx-auto">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
                    >
                        <HiOutlineHome className="w-5 h-5" />
                        Go Home
                    </Link>
                    <Link
                        to="/products"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-xl font-medium transition-colors"
                    >
                        <HiOutlineSearch className="w-5 h-5" />
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;