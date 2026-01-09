// src/pages/Home.jsx

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import {
    HiArrowRight,
    HiShoppingBag,
    HiTruck,
    HiShieldCheck,
    HiCreditCard,
    HiSparkles,
    HiLightningBolt,
    HiStar,
    HiTag,
    HiHeart,
    HiGift
} from 'react-icons/hi';
import { productsAPI, categoriesAPI } from '../api/api';
import ProductCard from '../components/products/ProductCard';

// ========== PRODUCT SECTION SKELETON LOADER ==========
const ProductSectionSkeleton = ({ count = 4 }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-secondary-800 rounded-xl overflow-hidden border border-secondary-200 dark:border-secondary-700 animate-pulse"
                >
                    {/* Image Skeleton */}
                    <div className="relative h-32 sm:h-40 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-700 dark:to-secondary-800">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shimmer" />
                    </div>
                    {/* Content Skeleton */}
                    <div className="p-3 space-y-2">
                        <div className="h-3 w-16 bg-secondary-200 dark:bg-secondary-700 rounded-full" />
                        <div className="h-4 w-full bg-secondary-200 dark:bg-secondary-700 rounded" />
                        <div className="h-4 w-3/4 bg-secondary-200 dark:bg-secondary-700 rounded" />
                        <div className="flex gap-0.5 pt-1">
                            {[...Array(5)].map((_, j) => (
                                <div key={j} className="w-3 h-3 bg-secondary-200 dark:bg-secondary-700 rounded-full" />
                            ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-secondary-100 dark:border-secondary-700">
                            <div className="h-5 w-16 bg-secondary-200 dark:bg-secondary-700 rounded" />
                            <div className="w-8 h-8 bg-secondary-200 dark:bg-secondary-700 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// ========== CATEGORY SKELETON LOADER ==========
const CategorySkeleton = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2 md:gap-3">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-secondary-800 rounded-lg sm:rounded-xl p-2 sm:p-3 animate-pulse"
                >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto rounded-lg bg-secondary-200 dark:bg-secondary-700 mb-1 sm:mb-2" />
                    <div className="h-2 sm:h-3 w-full bg-secondary-200 dark:bg-secondary-700 rounded mx-auto" />
                </div>
            ))}
        </div>
    );
};

// ========== INLINE LOADING SPINNER FOR SECTIONS ==========
const SectionLoader = () => {
    return (
        <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
                <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full border-3 border-primary-200 dark:border-primary-800"></div>
                    <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary-600 animate-spin"></div>
                </div>
                <span className="text-xs text-secondary-500">Loading...</span>
            </div>
        </div>
    );
};

const Home = () => {
    // Separate loading states for each section
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [featuredLoading, setFeaturedLoading] = useState(true);

    const [newArrivals, setNewArrivals] = useState([]);
    const [newArrivalsLoading, setNewArrivalsLoading] = useState(true);

    const [bestsellers, setBestsellers] = useState([]);
    const [bestsellersLoading, setBestsellersLoading] = useState(true);

    const [onSale, setOnSale] = useState([]);
    const [onSaleLoading, setOnSaleLoading] = useState(true);

    // Fetch categories first (fast, needed for categories section)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoriesAPI.getFeatured();
                setCategories(response.data?.results || response.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products in parallel but update state independently
    useEffect(() => {
        // Featured Products
        const fetchFeatured = async () => {
            try {
                const response = await productsAPI.getFeatured();
                setFeaturedProducts(response.data?.results || response.data || []);
            } catch (error) {
                console.error('Error fetching featured:', error);
            } finally {
                setFeaturedLoading(false);
            }
        };

        // New Arrivals
        const fetchNewArrivals = async () => {
            try {
                const response = await productsAPI.getNewArrivals();
                setNewArrivals(response.data?.results || response.data || []);
            } catch (error) {
                console.error('Error fetching new arrivals:', error);
            } finally {
                setNewArrivalsLoading(false);
            }
        };

        // Bestsellers
        const fetchBestsellers = async () => {
            try {
                const response = await productsAPI.getBestsellers();
                setBestsellers(response.data?.results || response.data || []);
            } catch (error) {
                console.error('Error fetching bestsellers:', error);
            } finally {
                setBestsellersLoading(false);
            }
        };

        // On Sale
        const fetchOnSale = async () => {
            try {
                const response = await productsAPI.getOnSale();
                setOnSale(response.data?.results || response.data || []);
            } catch (error) {
                console.error('Error fetching on sale:', error);
            } finally {
                setOnSaleLoading(false);
            }
        };

        // Fetch all in parallel
        fetchFeatured();
        fetchNewArrivals();
        fetchBestsellers();
        fetchOnSale();
    }, []);

    const getCategoryIcon = (category) => {
        const slugMap = {
            'electronics': '💻',
            'fashion': '👗',
            'home-living': '🏠',
            'beauty-skincare': '✨',
            'books-education': '📚',
            'sports-fitness': '🏃',
            'kids-toys': '🧸',
            'digital-products': '📱',
        };
        return slugMap[category.slug] || '🏷️';
    };

    const getCategoryColor = (category) => {
        const slugColorMap = {
            'electronics': 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20',
            'fashion': 'from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-800/20',
            'home-living': 'from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20',
            'beauty-skincare': 'from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20',
            'books-education': 'from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20',
            'sports-fitness': 'from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20',
            'kids-toys': 'from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20',
            'digital-products': 'from-cyan-100 to-cyan-50 dark:from-cyan-900/30 dark:to-cyan-800/20',
        };
        return slugColorMap[category.slug] || 'from-gray-100 to-gray-50 dark:from-gray-900/30 dark:to-gray-800/20';
    };

    return (
        <div className="min-h-screen">
            {/* ==================== HERO SECTION - ALWAYS VISIBLE ==================== */}
            <section className="relative min-h-[65vh] sm:min-h-[70vh] md:min-h-[85vh] lg:min-h-[90vh] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">

                {/* ===== DECORATIVE BACKGROUND ELEMENTS ===== */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                            backgroundSize: '40px 40px'
                        }} />
                    </div>

                    {/* Large Curvy Blob - Top Right */}
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                            rotate: [0, 8, 0],
                            x: [0, 20, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-32 -right-32 md:-top-48 md:-right-24 lg:-top-32 lg:right-0 w-64 h-64 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] opacity-40"
                    >
                        <svg viewBox="0 0 600 600" className="w-full h-full">
                            <defs>
                                <linearGradient id="blob1-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
                                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                            <path
                                fill="url(#blob1-gradient)"
                                d="M432.4,363.6c-47.5,60.3-155.2,107.1-231.8,85.5C124,427.5,78.6,337.5,71.4,253.5c-7.2-84,23.4-162,89.1-198c65.7-36,166.5-30,232.2,18c65.7,48,96.3,138,39.7,290.1Z"
                            />
                        </svg>
                    </motion.div>

                    {/* Medium Curvy Blob - Bottom Left */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, -10, 0],
                            y: [0, 30, 0],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-32 -left-32 md:-bottom-40 md:-left-20 lg:-bottom-20 lg:left-0 w-64 h-64 md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] opacity-30"
                    >
                        <svg viewBox="0 0 500 500" className="w-full h-full">
                            <defs>
                                <linearGradient id="blob2-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                                    <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#d946ef" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                            <path
                                fill="url(#blob2-gradient)"
                                d="M421.9,293.1c-21.3,67.6-85.3,132.9-161.1,141.3c-75.8,8.4-163.5-40.2-196.5-113.4C31.4,247.8,53.1,150,110.2,93.4c57.1-56.6,149.6-72,215.4-36.4C391.4,92.6,443.2,225.5,421.9,293.1z"
                            />
                        </svg>
                    </motion.div>

                    {/* Small Floating Blob - Center */}
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, 40, 0],
                            y: [0, -30, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="hidden lg:block absolute top-1/3 left-1/3 w-[300px] h-[300px] opacity-20"
                    >
                        <svg viewBox="0 0 300 300" className="w-full h-full">
                            <defs>
                                <linearGradient id="blob3-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                            <path
                                fill="url(#blob3-gradient)"
                                d="M254.4,182.3c-12.1,41.7-51.9,80.5-98.3,86.8c-46.4,6.3-99.3-19.9-119.2-66.5C17,156,29.9,89,69.3,50.8c39.4-38.2,105.4-47.7,147.5-22.1C258.9,54.3,266.5,140.6,254.4,182.3z"
                            />
                        </svg>
                    </motion.div>

                    {/* Floating Circles - Desktop Only */}
                    <div className="hidden md:block absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [0, -40, 0],
                                    opacity: [0.05, 0.15, 0.05],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 8 + i * 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.7,
                                }}
                                className="absolute rounded-full border border-white/20"
                                style={{
                                    width: `${80 + i * 40}px`,
                                    height: `${80 + i * 40}px`,
                                    left: `${5 + i * 12}%`,
                                    top: `${15 + (i % 4) * 20}%`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* ===== CURVY WAVE DIVIDERS AT BOTTOM ===== */}
                <div className="absolute -bottom-1 left-0 right-0 z-20">
                    <svg
                        viewBox="0 0 1440 200"
                        fill="none"
                        className="absolute bottom-0 w-full h-20 sm:h-24 md:h-32 lg:h-40"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,128 C180,180 280,100 480,128 C680,156 780,80 960,100 C1140,120 1260,180 1440,140 L1440,200 L0,200 Z"
                            className="fill-primary-800/30"
                        />
                    </svg>

                    <svg
                        viewBox="0 0 1440 200"
                        fill="none"
                        className="absolute bottom-0 w-full h-16 sm:h-20 md:h-28 lg:h-36"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,100 C240,150 360,60 600,100 C840,140 960,50 1200,90 C1320,110 1380,140 1440,120 L1440,200 L0,200 Z"
                            className="fill-white/10 dark:fill-white/5"
                        />
                    </svg>

                    <svg
                        viewBox="0 0 1440 200"
                        fill="none"
                        className="relative w-full h-14 sm:h-18 md:h-24 lg:h-32"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,120 C120,140 240,80 420,100 C600,120 720,160 900,130 C1080,100 1200,150 1320,120 C1380,105 1420,130 1440,120 L1440,200 L0,200 Z"
                            className="fill-white dark:fill-secondary-900"
                        />
                    </svg>
                </div>

                {/* ===== DECORATIVE CURVY LINES - Desktop Only ===== */}
                <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.svg
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="absolute left-0 top-0 w-1/3 h-full"
                        viewBox="0 0 400 800"
                        fill="none"
                    >
                        <motion.path
                            d="M-50,0 Q150,200 50,400 Q-50,600 150,800"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                    </motion.svg>

                    <motion.svg
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.1 }}
                        transition={{ duration: 2, delay: 0.8 }}
                        className="absolute right-0 top-0 w-1/3 h-full"
                        viewBox="0 0 400 800"
                        fill="none"
                    >
                        <motion.path
                            d="M450,0 Q250,200 350,400 Q450,600 250,800"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                    </motion.svg>
                </div>

                {/* ===== MAIN CONTENT ===== */}
                <div className="relative z-10 h-full w-[92%] sm:w-[95%] lg:w-[90%] max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20">
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center">

                        {/* ===== LEFT CONTENT ===== */}
                        <div className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mb-3 sm:mb-4 lg:mb-6"
                            >
                                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs lg:text-sm font-medium border border-white/20 shadow-lg">
                                    <span className="flex h-1.5 w-1.5 lg:h-2 lg:w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-full w-full bg-green-400"></span>
                                    </span>
                                    🚚 Free shipping over $50
                                </span>
                            </motion.div>

                            {/* Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.1] mb-3 sm:mb-4 lg:mb-6"
                            >
                                <span className="block">Discover Your</span>
                                <span className="block mt-0.5 sm:mt-1 lg:mt-2">
                                    <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
                                        Perfect Style
                                    </span>
                                </span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/80 mb-4 sm:mb-6 lg:mb-8 max-w-lg lg:max-w-xl mx-auto lg:mx-0 leading-relaxed"
                            >
                                Explore thousands of premium products with unbeatable prices.
                                From electronics to fashion, find everything you need.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-row gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8 justify-center lg:justify-start"
                            >
                                <Link
                                    to="/products"
                                    className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 px-4 sm:px-6 md:px-7 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 bg-white text-primary-900 font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-yellow-400/30 hover:scale-105 text-xs sm:text-sm md:text-base"
                                >
                                    <HiShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                    <span>Shop Now</span>
                                    <HiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    to="/products?on_sale=true"
                                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-7 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base"
                                >
                                    <HiTag className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                    <span>Deals</span>
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8"
                            >
                                {[
                                    { value: '50K+', label: 'Customers' },
                                    { value: '10K+', label: 'Products' },
                                    { value: '4.9★', label: 'Rating' }
                                ].map((stat, i) => (
                                    <div key={i} className="text-center lg:text-left">
                                        <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white">{stat.value}</div>
                                        <div className="text-[10px] sm:text-xs lg:text-sm text-white/60">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Trust Badges - Desktop Only */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="hidden lg:flex items-center gap-6 mt-8 pt-8 border-t border-white/10"
                            >
                                {[
                                    { icon: HiTruck, text: 'Free Shipping' },
                                    { icon: HiShieldCheck, text: 'Secure Payment' },
                                    { icon: HiStar, text: '24/7 Support' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-white/70">
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-sm">{item.text}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* ===== RIGHT CONTENT - HERO IMAGE ===== */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative flex items-center justify-center order-1 lg:order-2"
                        >
                            {/* Decorative Rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="hidden lg:block absolute -inset-6 xl:-inset-10 rounded-full border-2 border-dashed border-white/10"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                                className="hidden lg:block absolute -inset-12 xl:-inset-16 rounded-full border border-white/5"
                            />

                            {/* Glow Effect */}
                            <div className="absolute inset-0 lg:-inset-8 bg-gradient-to-br from-yellow-400/30 via-orange-500/20 to-pink-500/20 rounded-3xl lg:rounded-[50px] blur-2xl lg:blur-3xl transform scale-90" />

                            {/* Main Image Container */}
                            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
                                <motion.div
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative"
                                >
                                    <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[2rem] xl:rounded-[2.5rem] overflow-hidden shadow-2xl lg:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]">
                                        <img
                                            src="/images/hero-shopping.jpg"
                                            alt="Premium Shopping Experience"
                                            className="w-full h-36 sm:h-48 md:h-64 lg:h-[400px] xl:h-[480px] 2xl:h-[550px] object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 via-primary-900/10 to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-purple-500/10" />
                                    </div>
                                </motion.div>

                                {/* Floating Badges */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30, y: 20 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                    transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 lg:-bottom-6 lg:-left-6 xl:-bottom-8 xl:-left-8 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-2 sm:p-3 lg:p-4 shadow-xl lg:shadow-2xl"
                                >
                                    <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                                            <HiGift className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-white" />
                                        </div>
                                        <div className="pr-1">
                                            <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500">Special Offer</p>
                                            <p className="text-[10px] sm:text-xs lg:text-base font-bold text-gray-900">Up to 50% OFF</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, type: "spring", stiffness: 100 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="absolute top-2 -right-1 sm:top-4 sm:-right-2 lg:top-8 lg:-right-6 xl:top-10 xl:-right-8 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl px-2.5 py-1.5 sm:px-3 sm:py-2 lg:px-5 lg:py-3 shadow-xl lg:shadow-2xl"
                                >
                                    <div className="flex items-center gap-1 lg:gap-2">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <HiStar key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-gray-900">4.9</span>
                                    </div>
                                    <p className="text-[8px] sm:text-[9px] lg:text-xs text-gray-500 mt-0.5 lg:mt-1">2.5k+ reviews</p>
                                </motion.div>

                                {/* Desktop Only Floating Badges */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    className="hidden lg:flex absolute bottom-1/4 -right-4 xl:-right-6 w-12 h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl items-center justify-center shadow-xl shadow-red-500/30"
                                >
                                    <HiHeart className="w-6 h-6 xl:w-7 xl:h-7 text-white" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                                    whileHover={{ scale: 1.1, rotate: -10 }}
                                    className="hidden lg:flex absolute top-1/4 -left-4 xl:-left-6 w-12 h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl items-center justify-center shadow-xl shadow-amber-500/30"
                                >
                                    <HiSparkles className="w-6 h-6 xl:w-7 xl:h-7 text-white" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ==================== FEATURES BAR ==================== */}
            <section className="bg-white dark:bg-secondary-900 py-4 sm:py-6 md:py-8 border-b border-secondary-100 dark:border-secondary-800">
                <div className="w-[92%] sm:w-[95%] lg:w-[90%] max-w-7xl mx-auto px-3 sm:px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {[
                            { icon: HiTruck, title: 'Free Shipping', desc: 'Orders $50+', color: 'primary' },
                            { icon: HiShieldCheck, title: 'Secure', desc: '100% protected', color: 'green' },
                            { icon: HiCreditCard, title: 'Easy Returns', desc: '30 days', color: 'orange' },
                            { icon: HiStar, title: '24/7 Support', desc: 'Always here', color: 'purple' }
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 sm:gap-3">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                                    <feature.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${feature.color}-600`} />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-semibold text-secondary-900 dark:text-white text-xs sm:text-sm truncate">{feature.title}</div>
                                    <div className="text-[10px] sm:text-xs text-secondary-500 truncate">{feature.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== CATEGORIES SECTION - INSTANT LOAD ==================== */}
            <section className="py-6 sm:py-10 md:py-14 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 dark:opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 0.5px, transparent 0)`,
                        backgroundSize: '24px 24px',
                        color: '#94a3b8'
                    }} />
                </div>

                <div className="w-[92%] sm:w-[95%] lg:w-[90%] max-w-7xl mx-auto px-3 sm:px-4 relative">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-4 sm:mb-6"
                    >
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-xs font-semibold rounded-full mb-2">
                            <HiSparkles className="w-3 h-3" />
                            CATEGORIES
                        </span>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary-900 dark:text-white">
                            Shop by Category
                        </h2>
                    </motion.div>

                    {/* Categories Grid or Skeleton */}
                    {categoriesLoading ? (
                        <CategorySkeleton count={8} />
                    ) : categories.length > 0 ? (
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2 md:gap-3">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    whileHover={{ y: -3, scale: 1.02 }}
                                >
                                    <Link
                                        to={`/products?category=${category.slug}`}
                                        className="block bg-white dark:bg-secondary-800 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-emerald-400 dark:hover:border-emerald-500 group"
                                    >
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto rounded-lg bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform`}>
                                            <span className="text-sm sm:text-base md:text-lg">{getCategoryIcon(category)}</span>
                                        </div>
                                        <h3 className="font-medium text-secondary-900 dark:text-white text-[8px] sm:text-[10px] md:text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 leading-tight">
                                            {category.name}
                                        </h3>
                                        {category.product_count !== undefined && (
                                            <p className="hidden sm:block text-[8px] sm:text-[9px] text-secondary-400 mt-0.5">
                                                {category.product_count}
                                            </p>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-secondary-500 py-8">No categories available</p>
                    )}

                    {/* View All Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 sm:mt-6 text-center"
                    >
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md shadow-emerald-500/20 text-xs sm:text-sm"
                        >
                            View All Products
                            <HiArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ==================== FEATURED PRODUCTS ==================== */}
            <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-green-50/50 to-teal-50 dark:from-secondary-900 dark:via-emerald-900/10 dark:to-secondary-900 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-emerald-200/40 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-teal-200/40 to-transparent rounded-full blur-3xl" />

                <div className="w-[92%] sm:w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4 relative">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <HiSparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                                    Featured Products
                                    {!featuredLoading && featuredProducts.length > 0 && (
                                        <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full">
                                            {featuredProducts.length}
                                        </span>
                                    )}
                                </h2>
                                <p className="text-xs sm:text-sm text-secondary-500">Handpicked just for you</p>
                            </div>
                        </div>
                        <Link
                            to="/products?featured=true"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
                        >
                            View All <HiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Products Grid or Skeleton */}
                    {featuredLoading ? (
                        <ProductSectionSkeleton count={8} />
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
                            {featuredProducts.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            {/* ==================== HOT DEALS / ON SALE ==================== */}
            <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50 dark:from-secondary-900 dark:via-amber-900/10 dark:to-secondary-900 relative overflow-hidden">
                {/* Decorative Fire Pattern */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-200/50 to-transparent rounded-full blur-3xl" />

                <div className="w-[92%] sm:w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4 relative">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 relative">
                                <HiTag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                                    Hot Deals
                                    <span className="px-2 py-0.5 text-[10px] sm:text-xs font-bold bg-red-500 text-white rounded animate-pulse">
                                        SALE
                                    </span>
                                </h2>
                                <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400">Save up to 50% off</p>
                            </div>
                        </div>
                        <Link
                            to="/products?on_sale=true"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 rounded-lg transition-colors"
                        >
                            View All <HiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Products Grid or Skeleton */}
                    {onSaleLoading ? (
                        <ProductSectionSkeleton count={4} />
                    ) : onSale.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
                            {onSale.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            {/* ==================== NEW ARRIVALS ==================== */}
            <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-blue-50 via-sky-50/50 to-indigo-50 dark:from-secondary-900 dark:via-blue-900/10 dark:to-secondary-900 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200/50 to-transparent rounded-full blur-3xl" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-200/50 to-transparent rounded-full blur-3xl" />

                <div className="w-[92%] sm:w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4 relative">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <HiLightningBolt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                                    New Arrivals
                                    <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
                                        NEW
                                    </span>
                                </h2>
                                <p className="text-xs sm:text-sm text-secondary-500">Fresh additions to our collection</p>
                            </div>
                        </div>
                        <Link
                            to="/products?ordering=-created_at"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                        >
                            View All <HiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Products Grid or Skeleton */}
                    {newArrivalsLoading ? (
                        <ProductSectionSkeleton count={8} />
                    ) : newArrivals.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
                            {newArrivals.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            {/* ==================== BESTSELLERS ==================== */}
            <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-purple-50 via-violet-50/50 to-fuchsia-50 dark:from-secondary-900 dark:via-purple-900/10 dark:to-secondary-900 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-200/50 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-fuchsia-200/50 to-transparent rounded-full blur-3xl" />

                <div className="w-[92%] sm:w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4 relative">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                <HiStar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                                    Bestsellers
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] sm:text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full">
                                        <HiStar className="w-3 h-3" /> TOP
                                    </span>
                                </h2>
                                <p className="text-xs sm:text-sm text-secondary-500">Customer favorites</p>
                            </div>
                        </div>
                        <Link
                            to="/products?is_bestseller=true"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors"
                        >
                            View All <HiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Products Grid or Skeleton */}
                    {bestsellersLoading ? (
                        <ProductSectionSkeleton count={8} />
                    ) : bestsellers.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
                            {bestsellers.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            {/* ==================== NEWSLETTER / CTA SECTION ==================== */}
            <section className="py-10 sm:py-14 md:py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }} />
                </div>

                <div className="w-[92%] sm:w-[95%] lg:w-[90%] max-w-4xl mx-auto px-4 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                            Ready to Start Shopping?
                        </h2>
                        <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-xl mx-auto">
                            Join thousands of happy customers and discover amazing deals every day.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-700 font-bold rounded-full hover:bg-yellow-400 hover:text-primary-900 transition-all shadow-xl text-sm sm:text-base"
                            >
                                <HiShoppingBag className="w-5 h-5" />
                                Browse Products
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 transition-all text-sm sm:text-base"
                            >
                                Create Account
                                <HiArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;