// src/pages/Products.jsx

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiFilter,
    HiX,
    HiSearch,
    HiChevronLeft,
    HiChevronRight,
    HiChevronDown,
    HiChevronUp,
    HiAdjustments,
    HiShoppingBag
} from 'react-icons/hi';
import { productsAPI, categoriesAPI } from '../api/api';
import ProductGrid from '../components/products/ProductGrid';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Pagination state
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        currentPage: 1,
        totalPages: 1,
        pageSize: 12,
    });

    // Expanded categories state (for accordion)
    const [expandedCategories, setExpandedCategories] = useState({});

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('min_price') || '',
        maxPrice: searchParams.get('max_price') || '',
        search: searchParams.get('search') || '',
        ordering: searchParams.get('ordering') || '-created_at',
        page: parseInt(searchParams.get('page')) || 1,
    });

    // Featured categories data
    const featuredCategories = [
        { name: 'Electronics', slug: 'electronics', icon: '💻', color: 'from-blue-500 to-blue-600' },
        { name: 'Fashion', slug: 'fashion', icon: '👗', color: 'from-pink-500 to-pink-600' },
        { name: 'Home & Living', slug: 'home-living', icon: '🏠', color: 'from-amber-500 to-amber-600' },
        { name: 'Beauty', slug: 'beauty-skincare', icon: '✨', color: 'from-purple-500 to-purple-600' },
        { name: 'Books', slug: 'books-education', icon: '📚', color: 'from-green-500 to-green-600' },
        { name: 'Sports', slug: 'sports-fitness', icon: '🏃', color: 'from-red-500 to-red-600' },
        { name: 'Kids & Toys', slug: 'kids-toys', icon: '🧸', color: 'from-yellow-500 to-yellow-600' },
        { name: 'Digital', slug: 'digital-products', icon: '📱', color: 'from-cyan-500 to-cyan-600' },
    ];

    // Organize categories into hierarchy
    const organizeCategories = (categoriesList) => {
        const mainCategories = categoriesList.filter(cat => !cat.parent);
        const subCategories = categoriesList.filter(cat => cat.parent);

        return mainCategories.map(main => ({
            ...main,
            children: subCategories.filter(sub => sub.parent === main.id)
        }));
    };

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoriesAPI.getAll();
                const data = response.data;
                let categoriesList = [];

                if (Array.isArray(data)) {
                    categoriesList = data;
                } else if (data.results) {
                    categoriesList = data.results;
                }

                setCategories(categoriesList);

                // Auto-expand category that matches current filter
                if (filters.category) {
                    const selectedCat = categoriesList.find(c => c.slug === filters.category);
                    if (selectedCat && selectedCat.parent) {
                        const parentCat = categoriesList.find(c => c.id === selectedCat.parent);
                        if (parentCat) {
                            setExpandedCategories(prev => ({ ...prev, [parentCat.id]: true }));
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products with pagination
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: filters.page,
                page_size: pagination.pageSize,
            };

            if (filters.category) params.category = filters.category;
            if (filters.minPrice) params.min_price = filters.minPrice;
            if (filters.maxPrice) params.max_price = filters.maxPrice;
            if (filters.search) params.search = filters.search;
            if (filters.ordering) params.ordering = filters.ordering;

            const response = await productsAPI.getAll(params);
            const data = response.data;

            if (Array.isArray(data)) {
                setProducts(data);
                setPagination(prev => ({
                    ...prev,
                    count: data.length,
                    totalPages: 1,
                    next: null,
                    previous: null,
                }));
            } else if (data.results) {
                setProducts(data.results);
                const totalPages = Math.ceil(data.count / pagination.pageSize);
                setPagination(prev => ({
                    ...prev,
                    count: data.count,
                    next: data.next,
                    previous: data.previous,
                    totalPages: totalPages,
                }));
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.pageSize]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };

        // Reset to page 1 when filters change (except page itself)
        if (key !== 'page') {
            newFilters.page = 1;
        }

        setFilters(newFilters);

        // Update URL params
        const newParams = new URLSearchParams();
        if (newFilters.category) newParams.set('category', newFilters.category);
        if (newFilters.minPrice) newParams.set('min_price', newFilters.minPrice);
        if (newFilters.maxPrice) newParams.set('max_price', newFilters.maxPrice);
        if (newFilters.search) newParams.set('search', newFilters.search);
        if (newFilters.ordering && newFilters.ordering !== '-created_at') {
            newParams.set('ordering', newFilters.ordering);
        }
        if (newFilters.page > 1) newParams.set('page', newFilters.page.toString());

        setSearchParams(newParams);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            handleFilterChange('page', newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            search: '',
            ordering: '-created_at',
            page: 1,
        });
        setSearchParams({});
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.search;

    const organizedCategories = organizeCategories(categories);

    const getPageNumbers = () => {
        const pages = [];
        const { currentPage, totalPages } = { currentPage: filters.page, totalPages: pagination.totalPages };

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    const getCurrentCategoryName = () => {
        if (!filters.category) return 'All Products';
        const cat = categories.find(c => c.slug === filters.category);
        return cat ? cat.name : 'All Products';
    };

    const activeFilterCount = [
        filters.category,
        filters.minPrice,
        filters.maxPrice,
        filters.search
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">
                            {getCurrentCategoryName()}
                        </h1>
                        <p className="text-white/80 text-sm md:text-base">
                            Find the perfect products tailored just for you
                        </p>
                    </motion.div>
                </div>

                {/* Curved Bottom */}
                <div className="h-4 md:h-6">
                    <svg viewBox="0 0 1440 24" fill="none" className="w-full h-full" preserveAspectRatio="none">
                        <path
                            d="M0 24h1440V0c-211.5 16-435.7 24-672 24S211.5 16 0 0v24z"
                            className="fill-secondary-50 dark:fill-secondary-900"
                        />
                    </svg>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-100 dark:border-secondary-700 p-3 md:p-4 mb-4"
                >
                    <div className="flex flex-row gap-2 md:gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-secondary-400" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-9 md:pl-10 pr-3 py-2.5 md:py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-700/50 text-secondary-900 dark:text-white text-sm placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative hidden sm:block">
                            <select
                                value={filters.ordering}
                                onChange={(e) => handleFilterChange('ordering', e.target.value)}
                                className="h-full pl-3 pr-8 py-2.5 md:py-3 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-700/50 text-secondary-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                            >
                                <option value="-created_at">Newest</option>
                                <option value="price">Price ↑</option>
                                <option value="-price">Price ↓</option>
                                <option value="name">A-Z</option>
                                <option value="-featured">Featured</option>
                            </select>
                            <HiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-2.5 md:py-3 rounded-lg font-medium text-sm transition-all ${
                                showFilters || hasActiveFilters
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-200'
                            }`}
                        >
                            <HiAdjustments className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden md:inline">Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="w-5 h-5 text-xs font-bold bg-white text-primary-600 rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Active Filters Tags */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-700">
                            {filters.category && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                                    {getCurrentCategoryName()}
                                    <button onClick={() => handleFilterChange('category', '')} className="hover:text-primary-900">
                                        <HiX className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            )}

                            {(filters.minPrice || filters.maxPrice) && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                                    ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                                    <button onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', ''); }}>
                                        <HiX className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            )}

                            {filters.search && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                                    "{filters.search}"
                                    <button onClick={() => handleFilterChange('search', '')}>
                                        <HiX className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            )}

                            <button
                                onClick={clearFilters}
                                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Featured Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base md:text-lg font-bold text-secondary-900 dark:text-white">
                            Shop by Category
                        </h2>
                        {filters.category && (
                            <button
                                onClick={() => handleFilterChange('category', '')}
                                className="text-xs md:text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                            >
                                View All
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
                        {featuredCategories.map((cat) => (
                            <motion.button
                                key={cat.slug}
                                onClick={() => handleFilterChange('category', cat.slug)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className={`relative p-2 md:p-3 rounded-xl text-center transition-all ${
                                    filters.category === cat.slug
                                        ? 'bg-gradient-to-br ' + cat.color + ' text-white shadow-lg'
                                        : 'bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md'
                                }`}
                            >
                                <div className="text-xl md:text-2xl mb-0.5">{cat.icon}</div>
                                <div className={`text-[10px] md:text-xs font-medium truncate ${
                                    filters.category === cat.slug
                                        ? 'text-white'
                                        : 'text-secondary-700 dark:text-secondary-300'
                                }`}>
                                    {cat.name}
                                </div>
                                {filters.category === cat.slug && (
                                    <motion.div
                                        layoutId="activeCategoryIndicator"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-md"
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Results Info */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        {isLoading ? (
                            'Loading products...'
                        ) : (
                            <>
                                <span className="font-medium text-secondary-900 dark:text-white">{pagination.count}</span> products found
                                {pagination.totalPages > 1 && (
                                    <span className="ml-1">• Page {filters.page} of {pagination.totalPages}</span>
                                )}
                            </>
                        )}
                    </p>

                    {/* Mobile Sort */}
                    <div className="relative sm:hidden">
                        <select
                            value={filters.ordering}
                            onChange={(e) => handleFilterChange('ordering', e.target.value)}
                            className="pl-2 pr-6 py-1.5 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                        >
                            <option value="-created_at">Newest</option>
                            <option value="price">Price ↑</option>
                            <option value="-price">Price ↓</option>
                            <option value="name">A-Z</option>
                        </select>
                        <HiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary-400 pointer-events-none" />
                    </div>
                </div>

                <div className="flex gap-6 lg:gap-8">
                    {/* Sidebar */}
                    <AnimatePresence>
                        {showFilters && (
                            <>
                                {/* Mobile Overlay */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowFilters(false)}
                                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                                />

                                {/* Sidebar Content */}
                                <motion.aside
                                    initial={{ x: -300, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -300, opacity: 0 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-secondary-800 overflow-y-auto shadow-2xl md:static md:z-0 md:w-64 md:flex-shrink-0 md:shadow-none md:rounded-xl md:border md:border-secondary-100 md:dark:border-secondary-700"
                                >
                                    {/* Mobile Header */}
                                    <div className="flex justify-between items-center p-4 border-b border-secondary-100 dark:border-secondary-700 md:hidden">
                                        <h2 className="text-lg font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                                            <HiFilter className="w-5 h-5 text-primary-600" />
                                            Filters
                                        </h2>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                                        >
                                            <HiX className="w-5 h-5 text-secondary-500" />
                                        </button>
                                    </div>

                                    <div className="p-4 space-y-5">
                                        {/* Clear Filters */}
                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearFilters}
                                                className="w-full py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium flex items-center justify-center gap-1 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <HiX className="w-4 h-4" />
                                                Clear all filters
                                            </button>
                                        )}

                                        {/* Category Filter */}
                                        <div>
                                            <h4 className="font-semibold text-secondary-900 dark:text-white mb-3 text-sm">
                                                Categories
                                            </h4>
                                            <div className="space-y-1 max-h-[300px] overflow-y-auto">
                                                {/* All Categories Option */}
                                                <label className={`flex items-center gap-2.5 cursor-pointer py-2 px-3 rounded-lg transition-all text-sm ${
                                                    filters.category === ''
                                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium'
                                                        : 'hover:bg-secondary-50 dark:hover:bg-secondary-700/50 text-secondary-600 dark:text-secondary-300'
                                                }`}>
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        checked={filters.category === ''}
                                                        onChange={() => handleFilterChange('category', '')}
                                                        className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                                                    />
                                                    All Categories
                                                </label>

                                                {/* Main Categories with Subcategories */}
                                                {organizedCategories.map((mainCat) => (
                                                    <div key={mainCat.id}>
                                                        <div className={`flex items-center rounded-lg transition-all ${
                                                            filters.category === mainCat.slug
                                                                ? 'bg-primary-50 dark:bg-primary-900/20'
                                                                : 'hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
                                                        }`}>
                                                            <label className="flex-1 flex items-center gap-2.5 cursor-pointer py-2 px-3 text-sm">
                                                                <input
                                                                    type="radio"
                                                                    name="category"
                                                                    checked={filters.category === mainCat.slug}
                                                                    onChange={() => handleFilterChange('category', mainCat.slug)}
                                                                    className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                                                                />
                                                                <span className={filters.category === mainCat.slug ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-secondary-700 dark:text-secondary-300'}>
                                                                    {mainCat.name}
                                                                </span>
                                                            </label>

                                                            {mainCat.children && mainCat.children.length > 0 && (
                                                                <button
                                                                    onClick={() => toggleCategory(mainCat.id)}
                                                                    className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-600 rounded-lg mr-1"
                                                                >
                                                                    {expandedCategories[mainCat.id] ? (
                                                                        <HiChevronUp className="w-4 h-4 text-secondary-400" />
                                                                    ) : (
                                                                        <HiChevronDown className="w-4 h-4 text-secondary-400" />
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Subcategories */}
                                                        <AnimatePresence>
                                                            {mainCat.children && mainCat.children.length > 0 && expandedCategories[mainCat.id] && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    className="ml-4 pl-3 border-l-2 border-secondary-200 dark:border-secondary-600 space-y-0.5 overflow-hidden"
                                                                >
                                                                    {mainCat.children.map((subCat) => (
                                                                        <label
                                                                            key={subCat.id}
                                                                            className={`flex items-center gap-2.5 cursor-pointer py-1.5 px-2 rounded-lg text-sm ${
                                                                                filters.category === subCat.slug
                                                                                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                                                                                    : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700'
                                                                            }`}
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                name="category"
                                                                                checked={filters.category === subCat.slug}
                                                                                onChange={() => handleFilterChange('category', subCat.slug)}
                                                                                className="w-3.5 h-3.5 text-primary-600 border-secondary-300 focus:ring-primary-500"
                                                                            />
                                                                            {subCat.name}
                                                                        </label>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-secondary-100 dark:border-secondary-700"></div>

                                        {/* Price Filter */}
                                        <div>
                                            <h4 className="font-semibold text-secondary-900 dark:text-white mb-3 text-sm">
                                                Price Range
                                            </h4>
                                            <div className="flex gap-2 items-center mb-3">
                                                <div className="flex-1 relative">
                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary-400 text-xs">$</span>
                                                    <input
                                                        type="number"
                                                        value={filters.minPrice}
                                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                                        placeholder="Min"
                                                        min="0"
                                                        className="w-full pl-6 pr-2 py-2 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-700/50 text-secondary-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <span className="text-secondary-300">—</span>
                                                <div className="flex-1 relative">
                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary-400 text-xs">$</span>
                                                    <input
                                                        type="number"
                                                        value={filters.maxPrice}
                                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                                        placeholder="Max"
                                                        min="0"
                                                        className="w-full pl-6 pr-2 py-2 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-700/50 text-secondary-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            {/* Quick Price Filters */}
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {[
                                                    { label: 'Under $25', min: '', max: '25' },
                                                    { label: '$25 - $50', min: '25', max: '50' },
                                                    { label: '$50 - $100', min: '50', max: '100' },
                                                    { label: '$100+', min: '100', max: '' },
                                                ].map((range) => (
                                                    <button
                                                        key={range.label}
                                                        onClick={() => {
                                                            handleFilterChange('minPrice', range.min);
                                                            handleFilterChange('maxPrice', range.max);
                                                        }}
                                                        className={`px-2 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                                                            filters.minPrice === range.min && filters.maxPrice === range.max
                                                                ? 'bg-primary-600 border-primary-600 text-white'
                                                                : 'border-secondary-200 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:border-primary-400'
                                                        }`}
                                                    >
                                                        {range.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Mobile Apply Button */}
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 md:hidden"
                                        >
                                            <HiShoppingBag className="w-5 h-5" />
                                            Show {pagination.count} Products
                                        </button>
                                    </div>
                                </motion.aside>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Products Section */}
                    <main className="flex-1 min-w-0">
                        {/* Products Grid */}
                        <ProductGrid products={products} isLoading={isLoading} />

                        {/* Pagination */}
                        {!isLoading && pagination.totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8"
                            >
                                <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-100 dark:border-secondary-700 p-4">
                                    <div className="flex flex-col items-center gap-3">
                                        {/* Page Info */}
                                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                            Showing {((filters.page - 1) * pagination.pageSize) + 1} - {Math.min(filters.page * pagination.pageSize, pagination.count)} of {pagination.count}
                                        </p>

                                        {/* Pagination Controls */}
                                        <div className="flex items-center gap-1">
                                            {/* Previous Button */}
                                            <button
                                                onClick={() => handlePageChange(filters.page - 1)}
                                                disabled={filters.page === 1}
                                                className={`p-2 rounded-lg border transition-all ${
                                                    filters.page === 1
                                                        ? 'border-secondary-200 dark:border-secondary-700 text-secondary-300 dark:text-secondary-600 cursor-not-allowed'
                                                        : 'border-secondary-200 dark:border-secondary-600 text-secondary-600 dark:text-secondary-300 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600'
                                                }`}
                                            >
                                                <HiChevronLeft className="w-4 h-4" />
                                            </button>

                                            {/* Page Numbers */}
                                            <div className="flex items-center gap-0.5">
                                                {getPageNumbers().map((page, index) => (
                                                    page === '...' ? (
                                                        <span
                                                            key={`ellipsis-${index}`}
                                                            className="px-2 py-1 text-secondary-400 text-sm"
                                                        >
                                                            ···
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`min-w-[36px] h-9 rounded-lg font-medium text-sm transition-all ${
                                                                filters.page === page
                                                                    ? 'bg-primary-600 text-white'
                                                                    : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                                ))}
                                            </div>

                                            {/* Next Button */}
                                            <button
                                                onClick={() => handlePageChange(filters.page + 1)}
                                                disabled={filters.page === pagination.totalPages}
                                                className={`p-2 rounded-lg border transition-all ${
                                                    filters.page === pagination.totalPages
                                                        ? 'border-secondary-200 dark:border-secondary-700 text-secondary-300 dark:text-secondary-600 cursor-not-allowed'
                                                        : 'border-secondary-200 dark:border-secondary-600 text-secondary-600 dark:text-secondary-300 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600'
                                                }`}
                                            >
                                                <HiChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Jump to Page */}
                                        {pagination.totalPages > 10 && (
                                            <div className="flex items-center gap-2 text-xs pt-2 border-t border-secondary-100 dark:border-secondary-700 w-full justify-center">
                                                <span className="text-secondary-500">Go to:</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={pagination.totalPages}
                                                    value={filters.page}
                                                    onChange={(e) => {
                                                        const page = parseInt(e.target.value);
                                                        if (page >= 1 && page <= pagination.totalPages) {
                                                            handlePageChange(page);
                                                        }
                                                    }}
                                                    className="w-14 px-2 py-1 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-700 text-center text-secondary-900 dark:text-white"
                                                />
                                                <span className="text-secondary-500">of {pagination.totalPages}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* No Products Message */}
                        {!isLoading && products.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-100 dark:border-secondary-700 p-8 text-center"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center">
                                    <HiSearch className="w-8 h-8 text-secondary-400" />
                                </div>
                                <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-2">
                                    No products found
                                </h3>
                                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                                    Try adjusting your filters or search terms
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm transition-all"
                                >
                                    <HiX className="w-4 h-4" />
                                    Clear filters
                                </button>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Products;