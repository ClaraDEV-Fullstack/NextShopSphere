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
                // Fetch all data in parallel
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
                    categoriesAPI.getFeatured()  // This calls /categories/featured/
                ]);

                // Handle responses - check for both array and paginated responses
                setFeaturedProducts(featuredRes.data?.results || featuredRes.data || []);
                setNewArrivals(newArrivalsRes.data?.results || newArrivalsRes.data || []);
                setBestsellers(bestsellersRes.data?.results || bestsellersRes.data || []);
                setOnSale(onSaleRes.data?.results || onSaleRes.data || []);
                setCategories(categoriesRes.data?.results || categoriesRes.data || []);

                console.log('Categories loaded:', categoriesRes.data); // Debug log
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Icon mapping based on backend icon field OR slug
    const getCategoryIcon = (category) => {
        // First try to use the icon field from backend
        const iconMap = {
            'laptop': '💻',
            'shirt': '👗',
            'home': '🏠',
            'sparkles': '✨',
            'book-open': '📚',
            'fire': '🏃',
            'puzzle': '🧸',
            'cloud-download': '📱',
            'tag': '📦',
        };

        // Fallback slug mapping
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

        // Try icon field first, then slug, then default
        return iconMap[category.icon] || slugMap[category.slug] || '📦';
    };

    // Color mapping for category cards
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
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 overflow-hidden z-0">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-yellow-400/10"
                                style={{
                                    width: `${Math.random() * 300 + 100}px`,
                                    height: `${Math.random() * 300 + 100}px`,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="text-center md:text-left">
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-yellow-400/30"
                                >
                                    🎉 Free shipping on orders over $50
                                </motion.span>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="text-4xl md:text-6xl font-bold leading-tight mb-6"
                                >
                                    Discover Your
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        className="block text-yellow-300"
                                    >
                                        Perfect Style
                                    </motion.span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-lg md:text-xl text-white/80 mb-8 max-w-lg"
                                >
                                    Shop the latest trends in electronics, fashion, beauty, and more.
                                    Quality products at unbeatable prices.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            to="/products"
                                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-primary-900 font-semibold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg hover:shadow-xl hover:shadow-yellow-500/20"
                                        >
                                            <HiShoppingBag className="w-5 h-5" />
                                            Shop Now
                                        </Link>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            to="/products?on_sale=true"
                                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                                        >
                                            <HiTag className="w-5 h-5" />
                                            View Deals
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Hero Stats */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="hidden md:grid grid-cols-2 gap-6"
                            >
                                {/* Happy Customers */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-yellow-400/30 transition-all duration-300"
                                >
                                    {/* Decorative background element */}
                                    <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-yellow-400/10 group-hover:bg-yellow-400/20 transition-colors duration-300"></div>

                                    <div className="relative z-10">
                                        <div className="text-5xl font-bold text-yellow-300 mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                                            50K+
                                        </div>
                                        <div className="text-white/80 group-hover:text-white transition-colors duration-300">
                                            Happy Customers
                                        </div>
                                        <div className="mt-3 flex justify-center">
                                            <div className="w-10 h-1 bg-yellow-400 rounded-full group-hover:w-16 transition-all duration-300"></div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Products */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-blue-400/30 transition-all duration-300"
                                >
                                    {/* Decorative background element */}
                                    <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-blue-400/10 group-hover:bg-blue-400/20 transition-colors duration-300"></div>

                                    <div className="relative z-10">
                                        <div className="text-5xl font-bold text-yellow-300 mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                                            1000+
                                        </div>
                                        <div className="text-white/80 group-hover:text-white transition-colors duration-300">
                                            Products
                                        </div>
                                        <div className="mt-3 flex justify-center">
                                            <div className="w-10 h-1 bg-blue-400 rounded-full group-hover:w-16 transition-all duration-300"></div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Brands */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-green-400/30 transition-all duration-300"
                                >
                                    {/* Decorative background element */}
                                    <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-green-400/10 group-hover:bg-green-400/20 transition-colors duration-300"></div>

                                    <div className="relative z-10">
                                        <div className="text-5xl font-bold text-yellow-300 mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                                            100+
                                        </div>
                                        <div className="text-white/80 group-hover:text-white transition-colors duration-300">
                                            Brands
                                        </div>
                                        <div className="mt-3 flex justify-center">
                                            <div className="w-10 h-1 bg-green-400 rounded-full group-hover:w-16 transition-all duration-300"></div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Rating */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-purple-400/30 transition-all duration-300"
                                >
                                    {/* Decorative background element */}
                                    <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-purple-400/10 group-hover:bg-purple-400/20 transition-colors duration-300"></div>

                                    <div className="relative z-10">
                                        <div className="text-5xl font-bold text-yellow-300 mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                                            4.9⭐
                                        </div>
                                        <div className="text-white/80 group-hover:text-white transition-colors duration-300">
                                            Rating
                                        </div>
                                        <div className="mt-3 flex justify-center">
                                            <div className="w-10 h-1 bg-purple-400 rounded-full group-hover:w-16 transition-all duration-300"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Wave SVG */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                              className="fill-white dark:fill-secondary-900"/>
                    </svg>
                </div>
            </section>

            {/* Features Bar */}
            <section className="bg-white dark:bg-secondary-900 py-8 border-b border-secondary-100 dark:border-secondary-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <HiTruck className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <div className="font-semibold text-secondary-900 dark:text-white">Free Shipping</div>
                                <div className="text-sm text-secondary-500">On orders over $50</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <HiShieldCheck className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="font-semibold text-secondary-900 dark:text-white">Secure Payment</div>
                                <div className="text-sm text-secondary-500">100% protected</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <HiCreditCard className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <div className="font-semibold text-secondary-900 dark:text-white">Easy Returns</div>
                                <div className="text-sm text-secondary-500">30 day returns</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <HiStar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <div className="font-semibold text-secondary-900 dark:text-white">24/7 Support</div>
                                <div className="text-sm text-secondary-500">Dedicated help</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ FEATURED CATEGORIES SECTION ============ */}
            {categories.length > 0 && (
                <section className="py-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <div className="max-w-7xl mx-auto px-4">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Shop by Category
                            </h2>
                            <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Browse our wide selection of {categories.length} categories
                            </p>
                        </motion.div>

                        {/* Categories Grid */}
                        <div className="flex justify-center">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4 w-full">
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
                                            className="relative bg-white dark:bg-gray-800 rounded-xl p-4 text-center overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col items-center h-full"
                                        >
                                            {/* Icon Container */}
                                            <div className={`relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105`}>
                                    <span className="text-xl">
                                        {getCategoryIcon(category)}
                                    </span>
                                            </div>

                                            {/* Category Name */}
                                            <div className="relative z-10 flex-grow flex flex-col justify-center">
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[2rem] flex items-center justify-center text-center">
                                                    {category.name}
                                                </h3>

                                                {/* Product Count */}
                                                {category.product_count !== undefined && category.product_count !== null && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {category.product_count} {category.product_count === 1 ? 'item' : 'items'}
                                                    </p>
                                                )}

                                                {/* Subcategories count if available */}
                                                {category.children && category.children.length > 0 && (
                                                    <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                                                        {category.children.length} subcategories
                                                    </p>
                                                )}
                                            </div>

                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
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
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-secondary-500">No categories available</p>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-20 bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/30 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-800 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100/50 dark:bg-teal-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 relative">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
                                    <HiSparkles className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-1">
                                        Featured Products
                                    </h2>
                                    <p className="text-secondary-500 dark:text-secondary-400 text-lg">
                                        Handpicked just for you
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/products?featured=true"
                                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-secondary-800 text-emerald-600 dark:text-emerald-400 font-semibold rounded-full shadow-sm border border-emerald-100 dark:border-secondary-700 hover:shadow-md hover:border-emerald-200 dark:hover:border-secondary-600 transition-all group"
                            >
                                View All
                                <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {featuredProducts.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Mobile View All */}
                        <div className="mt-10 text-center sm:hidden">
                            <Link
                                to="/products?featured=true"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all"
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
                <section className="py-16 bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-900">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-10">
                <span className="inline-block px-4 py-2 bg-amber-500/30 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                    🔥 Limited Time Offer
                </span>
                            <h2 className="text-4xl font-bold mb-4">Hot Deals & Discounts</h2>
                            <p className="text-amber-800 max-w-2xl mx-auto">
                                Don't miss out on these amazing deals. Save up to 50% on selected items!
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {onSale.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Link
                                to="/products?on_sale=true"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all shadow-lg"
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
                <section className="py-16 bg-secondary-50 dark:bg-secondary-800/50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <HiLightningBolt className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">
                                        New Arrivals
                                    </h2>
                                    <p className="text-secondary-500 dark:text-secondary-400">
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

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {newArrivals.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bestsellers */}
            {bestsellers.length > 0 && (
                <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
                            <div className="flex items-center gap-3 mb-6 md:mb-0">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                                    <HiStar className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Bestsellers
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        Most loved by our customers
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/products?is_bestseller=true"
                                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                            >
                                View All
                                <HiArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-3xl blur-xl"></div>
                            <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
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