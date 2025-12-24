import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineShoppingCart, HiOutlineSearch, HiOutlineMenu, HiOutlineX, HiMoon, HiSun, HiOutlineShoppingBag } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { logoutUser } from '../redux/authSlice';
import { selectCartCount, toggleCart } from '../redux/cartSlice';
import { useTheme } from '../hooks/useTheme';
import SmartSearch from './SmartSearch';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const userMenuRef = useRef(null);

    const cartCount = useSelector(selectCartCount);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logoutUser());
        toast.success('Logged out successfully');
        navigate('/');
        setIsUserMenuOpen(false);
    };

    return (
        <>
            {/* Top Bar */}
            <div className="hidden lg:block bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-8 text-[8px]">
                        <div className="flex items-center gap-2.5">
                            <a href="mailto:nextshopsphere@gmail.com" className="flex items-center gap-1 text-blue-100 hover:text-white">
                                <HiOutlineMail className="w-3 h-3" /> nextshopsphere@gmail.com
                            </a>
                            <a href="tel:+237683669723" className="flex items-center gap-1 text-blue-100 hover:text-white">
                                <HiOutlinePhone className="w-3 h-3" /> +237 683 669 723
                            </a>
                        </div>
                        <div className="flex items-center gap-2 text-[8px]">
                            <div className="flex items-center gap-1 text-blue-200">
                                <HiOutlineLocationMarker className="w-3 h-3" /> Douala, Cameroon
                            </div>
                            <div className="h-3 w-px bg-blue-600"></div>
                            <a href="https://wa.me/237683669723" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-400 hover:text-green-300">
                                <FaWhatsapp className="w-3 h-3" /> WhatsApp
                            </a>
                            <div className="h-3 w-px bg-blue-600"></div>
                            <Link to="/about" className="text-blue-100 hover:text-white">About</Link>
                            <Link to="/faq" className="text-blue-100 hover:text-white">FAQ</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl shadow-lg shadow-gray-200/50 dark:shadow-none' : 'bg-white dark:bg-secondary-900 border-b border-gray-100 dark:border-secondary-800'}`}>
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16 py-2">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-1.5 group">
                            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-500/30 flex items-center justify-center bg-white border border-gray-100">
                                {!logoError ? (
                                    <img src="/logo.png" alt="NextShopSphere" className="w-full h-full object-contain p-0.5" onError={() => setLogoError(true)} />
                                ) : (
                                    <span className="text-blue-600 font-bold text-lg">N</span>
                                )}
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-base font-bold">
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Next</span>
                                    <span className="text-green-500 dark:text-white">Shop</span>
                                    <span className="text-amber-500">Sphere</span>
                                </span>
                                <span className="text-[8px] text-gray-400 dark:text-gray-500 font-medium tracking-widest uppercase hidden sm:block">
                                    Shop with confidence
                                </span>
                            </div>
                        </Link>

                        {/* Search - Desktop */}
                        <button onClick={() => setIsSearchOpen(true)} className="hidden md:flex items-center gap-1.5 flex-1 max-w-lg mx-3 px-3 py-1.5 bg-gray-50 dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 rounded-2xl text-gray-400 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-secondary-700 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <HiOutlineSearch className="w-3 h-3 text-white" />
                            </div>
                            <span className="flex-1 text-left text-gray-500 dark:text-gray-400 text-[10px]">Search for products...</span>
                            <div className="flex items-center gap-1 px-1 py-0.5 bg-gray-200 dark:bg-secondary-600 rounded-lg text-[8px]">
                                <kbd className="font-mono text-gray-500 dark:text-gray-400">⌘</kbd>
                                <kbd className="font-mono text-gray-500 dark:text-gray-400">K</kbd>
                            </div>
                        </button>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-1.5 text-sm">
                            <Link to="/products" className="group flex items-center gap-1 px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                                <HiOutlineShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" /> Products
                            </Link>
                            <Link to="/contact" className="group flex items-center gap-1 px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                                <HiOutlineMail className="w-4 h-4 group-hover:scale-110 transition-transform" /> Contact
                            </Link>
                        </div>

                        {/* User & Cart - Desktop */}
                        <div className="hidden md:flex items-center gap-1.5">
                            <button onClick={toggleTheme} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-800 rounded-xl transition-colors">
                                {isDark ? <HiSun className="w-4 h-4 text-amber-400" /> : <HiMoon className="w-4 h-4 text-indigo-500" />}
                            </button>
                            <button onClick={() => dispatch(toggleCart())} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-800 rounded-xl transition-colors relative">
                                <HiOutlineShoppingCart className="w-4 h-4" />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 min-w-[16px] h-[16px] px-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                            {isAuthenticated ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-1 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors">
                                        <span className="text-gray-700 dark:text-gray-300 text-[12px] font-medium">{user.name}</span>
                                        <HiOutlineMenu className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 rounded-lg shadow-lg overflow-hidden text-sm z-50">
                                            <Link to="/profile" className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-secondary-700">Profile</Link>
                                            <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-secondary-700">Logout</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all text-sm">Login</Link>
                            )}
                        </div>

                        {/* Mobile Buttons */}
                        <div className="flex items-center gap-1 md:hidden">
                            <button onClick={() => setIsSearchOpen(true)} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-800 rounded-xl transition-colors">
                                <HiOutlineSearch className="w-4 h-4" />
                            </button>
                            <button onClick={toggleTheme} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-800 rounded-xl transition-colors">
                                {isDark ? <HiSun className="w-4 h-4 text-amber-400" /> : <HiMoon className="w-4 h-4 text-indigo-500" />}
                            </button>
                            <button onClick={() => dispatch(toggleCart())} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-800 rounded-xl transition-colors relative">
                                <HiOutlineShoppingCart className="w-4 h-4" />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 min-w-[16px] h-[16px] px-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-800 rounded-xl transition-colors">
                                {isMenuOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden flex flex-col gap-1 py-2 border-t border-gray-200 dark:border-secondary-700 bg-white dark:bg-secondary-900">
                            <Link to="/products" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-secondary-800">Products</Link>
                            <Link to="/contact" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-secondary-800">Contact</Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-secondary-800">Profile</Link>
                                    <button onClick={handleLogout} className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-secondary-800">Logout</button>
                                </>
                            ) : (
                                <Link to="/login" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-secondary-800">Login</Link>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* Search Component */}
            <SmartSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Navbar;
