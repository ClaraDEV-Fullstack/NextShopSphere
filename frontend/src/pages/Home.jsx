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
    HiTag
} from 'react-icons/hi';
import { productsAPI, categoriesAPI } from '../api/api';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);
    const [onSale, setOnSale] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [
                    featuredRes,
                    newArrivalsRes,
                    bestsellersRes,
                    onSaleRes,
                    categoriesRes
                ] = await Promise.all([
                    productsAPI.getFeatured(),
                    productsAPI.getNewArrivals(),
                    productsAPI.getBestsellers(),
                    productsAPI.getOnSale(),
                    categoriesAPI.getFeatured()
                ]);

                setFeaturedProducts(featuredRes.data?.results || featuredRes.data || []);
                setNewArrivals(newArrivalsRes.data?.results || newArrivalsRes.data || []);
                setBestsellers(bestsellersRes.data?.results || bestsellersRes.data || []);
                setOnSale(onSaleRes.data?.results || onSaleRes.data || []);
                setCategories(categoriesRes.data?.results || categoriesRes.data || []);

                console.log('Categories loaded:', categoriesRes.data);
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCategoryIcon = (category) => {
        const iconMap = {
            'laptop': '💻',
            'shirt': '👗',
            'home': '🏠',
            'sparkles': '✨',
            'book-open': '📚',
            'fire': '🔥',
            'puzzle': '🧸',
            'cloud-download': '📱',
            'tag': '🏷️',
        };

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

        return iconMap[category.icon] || slugMap[category.slug] || '🏷️';
    };

    const getCategoryColor = (category) => {
        const colorMap = {
            'laptop': 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20',
            'shirt': 'from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-800/20',
            'home': 'from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20',
            'sparkles': 'from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20',
            'book-open': 'from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20',
            'fire': 'from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20',
            'puzzle': 'from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20',
            'cloud-download': 'from-cyan-100 to-cyan-50 dark:from-cyan-900/30 dark:to-cyan-800/20',
            'tag': 'from-gray-100 to-gray-50 dark:from-gray-900/30 dark:to-gray-800/20',
        };

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

        return colorMap[category.icon] || slugColorMap[category.slug] || 'from-gray-100 to-gray-50 dark:from-gray-900/30 dark:to-gray-800/20';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section - Full width is OK for hero */}
            <section className="relative min-h-[100vh] md:min-h-[80vh] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">

                {/* Animated Curvy Blob Shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Large Blob - Top Right */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0],
                            x: [0, 20, 0],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-20 -right-20 md:-top-40 md:-right-40 w-[300px] md:w-[600px] h-[300px] md:h-[600px] opacity-30"
                    >
                        <svg viewBox="0 0 600 600" className="w-full h-full">
                            <path
                                fill="url(#blob-gradient-1)"
                                d="M432.4,363.6c-47.5,60.3-155.2,107.1-231.8,85.5C124,427.5,78.6,337.5,71.4,253.5c-7.2,84,23.4-162,89.1-198c65.7,36,166.5-30,232.2,18c65.7,48,96.3,138,39.7,290.1Z"
                            />
                            <defs>
                                <linearGradient id="blob-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>

                    {/* Medium Blob - Bottom Left */}
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                            rotate: [0, -10, 0],
                            y: [0, 30, 0],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -bottom-16 -left-16 md:-bottom-32 md:-left-32 w-[250px] md:w-[500px] h-[250px] md:h-[500px] opacity-25"
                    >
                        <svg viewBox="0 0 500 500" className="w-full h-full">
                            <path
                                fill="url(#blob-gradient-2)"
                                d="M421.9,293.1c-21.3,67.6-85.3,132.9-161.1,141.3c-75.8,8.4-163.5-40.2-196.5-113.4C31.4,247.8,53.1,150,110.2,93.4c57.1-56.6,149.6-72,215.4-36.4C391.4,92.6,443.2,225.5,421.9,293.1z"
                            />
                            <defs>
                                <linearGradient id="blob-gradient-2" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>

                    {/* Small Blob - Center Right */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 15, 0],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="hidden md:block absolute top-1/3 right-1/4 w-[300px] h-[300px] opacity-20"
                    >
                        <svg viewBox="0 0 300 300" className="w-full h-full">
                            <path
                                fill="url(#blob-gradient-3)"
                                d="M254.4,182.3c-12.1,41.7-51.9,80.5-98.3,86.8c-46.4,6.3-99.3-19.9-119.2-66.5C17,156,29.9,89,69.3,50.8c39.4-38.2,105.4-47.7,147.5-22.1C258.9,54.3,266.5,140.6,254.4,182.3z"
                            />
                            <defs>
                                <linearGradient id="blob-gradient-3" x1="50%" y1="0%" x2="50%" y2="100%">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>

                    {/* Extra Small Blob - Top Left */}
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            y: [0, -20, 0],
                            x: [0, 20, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-10 left-10 md:top-20 md:left-1/4 w-[100px] md:w-[200px] h-[100px] md:h-[200px] opacity-20"
                    >
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <path
                                fill="url(#blob-gradient-4)"
                                d="M169.6,121.5c-8.1,27.8-34.6,53.7-65.5,57.9c-30.9,4.2-66.2-13.3-79.5-44.3c-13.3-31.4-7.5-75.7,22.6-101.5C74.4,7.8,123.4-0.9,156.8,18.1C190.2,37.1,177.7,93.7,169.6,121.5z"
                            />
                            <defs>
                                <linearGradient id="blob-gradient-4" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f472b6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>
                </div>

                {/* Curved Wave Dividers */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <svg
                        className="absolute -top-1 left-0 w-full opacity-10"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="white"
                            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235.576,213.3C672,192,768,160,864,160C960,160,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                        />
                    </svg>

                    <svg
                        className="absolute -bottom-1 left-0 w-full"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                    >
                        <path
                            className="fill-white dark:fill-secondary-900"
                            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                    </svg>
                </div>

                {/* Floating Circles */}
                <div className="absolute inset-0 hidden sm:block">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: 5 + i * 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.5,
                            }}
                            className="absolute rounded-full border border-white/20"
                            style={{
                                width: `${60 + i * 40}px`,
                                height: `${60 + i * 40}px`,
                                left: `${10 + i * 15}%`,
                                top: `${20 + (i % 3) * 25}%`,
                            }}
                        />
                    ))}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-primary-900/90 via-primary-800/60 to-primary-900/40 md:to-transparent z-[1]" />

                {/* Main Content Container */}
                <div className="relative z-10 h-full w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                    <div className="h-full flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center justify-center">

                        {/* Left Content */}
                        <div className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mb-4 md:mb-6"
                            >
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-md rounded-full text-xs md:text-sm font-medium border border-white/20">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
                                    </span>
                                    Free shipping on orders over $50
                                </span>
                            </motion.div>

                            {/* Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-4 md:mb-6"
                            >
                                <span className="block">Elevate Your</span>
                                <span className="block mt-1 md:mt-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                    Shopping Experience
                                </span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                            >
                                Discover premium products across electronics, fashion, beauty & more.
                                Curated collections with unbeatable prices and fast delivery.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-row gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-10 justify-center lg:justify-start"
                            >
                                <Link
                                    to="/products"
                                    className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-primary-900 font-semibold rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-yellow-400/30 text-xs sm:text-sm md:text-base"
                                >
                                    <HiShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                    <span>Shop Now</span>
                                    <HiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    to="/products?on_sale=true"
                                    className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 text-xs sm:text-sm md:text-base"
                                >
                                    <HiTag className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                    <span>View Deals</span>
                                </Link>
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-xs md:text-sm text-white/70"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1.5 md:-space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-primary-800 flex items-center justify-center text-[10px] md:text-xs font-bold text-primary-900"
                                            >
                                                {String.fromCharCode(64 + i)}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="ml-1 md:ml-2">50K+ Happy Customers</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <HiStar key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                        ))}
                                    </div>
                                    <span>4.9/5 Rating</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Content - Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative flex items-center justify-center order-1 lg:order-2 w-full"
                        >
                            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-lg xl:max-w-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-[30px] md:rounded-[40px] blur-2xl md:blur-3xl transform scale-90" />

                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="hidden sm:block absolute -inset-3 md:-inset-4 rounded-[40px] md:rounded-[50px] border-2 border-dashed border-white/10"
                                />

                                <motion.div
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative"
                                >
                                    <img
                                        src="/images/hero-shopping.jpg"  // Changed to local image
                                        alt="Premium Shopping Experience"
                                        className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] xl:h-[500px] object-cover rounded-[30px] md:rounded-[40px] shadow-2xl"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent rounded-[30px] md:rounded-[40px]" />
                                </motion.div>

                                {/* Floating Cards */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 xl:-top-6 xl:-right-8 bg-white rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 shadow-xl"
                                >
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg md:rounded-xl flex items-center justify-center">
                                            <HiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-[10px] md:text-xs text-gray-500">New Arrivals</p>
                                            <p className="text-xs md:text-sm font-bold text-gray-900">1000+ Products</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 md:-bottom-4 md:-left-4 xl:-bottom-6 xl:-left-8 bg-white rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 shadow-xl"
                                >
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center">
                                            <HiTag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-[10px] md:text-xs text-gray-500">Special Offer</p>
                                            <p className="text-xs md:text-sm font-bold text-gray-900">Up to 50% OFF</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="hidden sm:block absolute bottom-10 md:bottom-16 -right-2 sm:-right-3 md:-right-4 xl:-right-8 bg-white/95 backdrop-blur-sm rounded-lg md:rounded-2xl px-2 md:px-4 py-1.5 md:py-2 shadow-lg"
                                >
                                    <div className="flex items-center gap-1 md:gap-2">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <HiStar key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-xs md:text-sm font-semibold text-gray-900">4.9</span>
                                        <span className="hidden md:inline text-xs text-gray-500">(2.5k reviews)</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="bg-white dark:bg-secondary-900 py-6 md:py-8 border-b border-secondary-100 dark:border-secondary-800">
                <div className="w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 md:gap-4"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                                <HiTruck className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-semibold text-secondary-900 dark:text-white text-sm md:text-base truncate">Free Shipping</div>
                                <div className="text-xs md:text-sm text-secondary-500 truncate">On orders over $50</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 md:gap-4"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                <HiShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-semibold text-secondary-900 dark:text-white text-sm md:text-base truncate">Secure Payment</div>
                                <div className="text-xs md:text-sm text-secondary-500 truncate">100% protected</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 md:gap-4"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                <HiCreditCard className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-semibold text-secondary-900 dark:text-white text-sm md:text-base truncate">Easy Returns</div>
                                <div className="text-xs md:text-sm text-secondary-500 truncate">30 day returns</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 md:gap-4"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                <HiStar className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-semibold text-secondary-900 dark:text-white text-sm md:text-base truncate">24/7 Support</div>
                                <div className="text-xs md:text-sm text-secondary-500 truncate">Dedicated help</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ FEATURED CATEGORIES SECTION - UPDATED ============ */}
            {categories.length > 0 && (
                <section className="py-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <div className="w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Shop by Category
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Browse our wide selection of {categories.length} categories
                            </p>
                        </motion.div>

                        {/* Categories Grid - UPDATED: 3 columns on mobile */}
                        <div className="flex justify-center">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 w-full">
                                {categories.map((category, index) => (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.03 }}
                                        whileHover={{ y: -5 }}
                                        className="group"
                                    >
                                        <Link
                                            to={`/products?category=${category.slug}`}
                                            className="relative bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 text-center overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500 flex flex-col items-center h-full"
                                        >
                                            {/* Icon Container */}
                                            <div className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center mb-2 md:mb-3 transition-transform duration-300 group-hover:scale-110 border-emerald-100 dark:border-emerald-800`}>
                                                <span className="text-lg md:text-xl">
                                                    {getCategoryIcon(category)}
                                                </span>
                                            </div>

                                            {/* Category Name */}
                                            <div className="relative z-10 flex-grow flex flex-col justify-center">
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-[10px] md:text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 min-h-[1.5rem] md:min-h-[2rem] flex items-center justify-center text-center leading-tight">
                                                    {category.name}
                                                </h3>

                                                {/* Product Count */}
                                                {category.product_count !== undefined && category.product_count !== null && (
                                                    <p className="text-[9px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
                                                        {category.product_count} {category.product_count === 1 ? 'item' : 'items'}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Hover overlay with green tint */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* View All Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="mt-8 text-center"
                        >
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg border border-emerald-500"
                            >
                                View All Products
                                <HiArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Show message if no categories */}
            {categories.length === 0 && !isLoading && (
                <section className="py-16 bg-secondary-50 dark:bg-secondary-800/50">
                    <div className="w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4 text-center">
                        <p className="text-secondary-500">No categories available</p>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-16 md:py-20 bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/30 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-800 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100/50 dark:bg-teal-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4 relative">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 md:mb-12">
                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
                                    <HiSparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-1">
                                        Featured Products
                                    </h2>
                                    <p className="text-secondary-500 dark:text-secondary-400 text-base md:text-lg">
                                        Handpicked just for you
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/products?featured=true"
                                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-secondary-800 text-emerald-600 dark:text-emerald-400 font-semibold rounded-full shadow-sm border-emerald-100 dark:border-secondary-700 hover:shadow-md hover:border-emerald-200 dark:hover:border-secondary-600 transition-all group"
                            >
                                View All
                                <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                            {featuredProducts.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Mobile View All */}
                        <div className="mt-10 text-center sm:hidden">
                            <Link
                                to="/products?featured=true"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all"
                            >
                                View All Featured
                                <HiArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Sale Banner */}
            {onSale.length > 0 && (
                <section className="py-12 md:py-16 bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-900">
                    <div className="w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4">
                        <div className="text-center mb-8 md:mb-10">
                            <span className="inline-block px-4 py-2 bg-amber-500/30 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                                🔥 Limited Time Offer
                            </span>
                            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Hot Deals & Discounts</h2>
                            <p className="text-amber-800 max-w-2xl mx-auto text-sm md:text-base">
                                Don't miss out on these amazing deals. Save up to 50% on selected items!
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                            {onSale.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <div className="text-center mt-8 md:mt-10">
                            <Link
                                to="/products?on_sale=true"
                                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all shadow-lg"
                            >
                                View All Deals
                                <HiArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* New Arrivals */}
            {newArrivals.length > 0 && (
                <section className="py-12 md:py-16 bg-secondary-50 dark:bg-secondary-800/50">
                    <div className="w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10">
                            <div className="flex items-center gap-3 mb-4 md:mb-0">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <HiLightningBolt className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white">
                                        New Arrivals
                                    </h2>
                                    <p className="text-secondary-500 dark:text-secondary-400 text-sm md:text-base">
                                        The latest additions to our collection
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/products?ordering=-created_at"
                                className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                            >
                                View All
                                <HiArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                            {newArrivals.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bestsellers */}
            {bestsellers.length > 0 && (
                <section className="py-12 md:py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="w-[95%] lg:w-[90%] max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10">
                            <div className="flex items-center gap-3 mb-4 md:mb-0">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                                    <HiStar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        Bestsellers
                                    </h2>
                                    <p className="text-gray-600 mt-1 text-sm md:text-base">
                                        Most loved by our customers
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/products?is_bestseller=true"
                                className="hidden md:flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                View All
                                <HiArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-3xl blur-xl"></div>
                            <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                                {bestsellers.slice(0, 8).map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-emerald-100 transform hover:-translate-y-1"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 md:mt-12 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-xs md:text-sm font-medium">
                                <HiStar className="w-4 h-4" />
                                Based on customer ratings and sales data
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;