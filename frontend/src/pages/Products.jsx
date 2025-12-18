// src/pages/Products.jsx

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    HiFilter,
    HiX,
    HiSearch,
    HiChevronLeft,
    HiChevronRight,
    HiChevronDown,
    HiChevronUp,
    HiViewGrid,
    HiViewList
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
            // Scroll to top of products
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

    // Get organized categories (main + subcategories)
    const organizedCategories = organizeCategories(categories);

    // Generate page numbers for pagination
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

    // Get current category name for display
    const getCurrentCategoryName = () => {
        if (!filters.category) return 'All Products';
        const cat = categories.find(c => c.slug === filters.category);
        return cat ? cat.name : 'All Products';
    };

    return (
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
                            {getCurrentCategoryName()}
                        </h1>
                        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                            {isLoading ? (
                                'Loading products...'
                            ) : (
                                <>
                                    {pagination.count} {pagination.count === 1 ? 'product' : 'products'} found
                                    {pagination.totalPages > 1 && (
                                        <span className="ml-2">
                                            • Page {filters.page} of {pagination.totalPages}
                                        </span>
                                    )}
                                </>
                            )}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {/* Search */}
                        <div className="relative flex-1 md:w-72">
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" />
                        </div>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden px-4 py-2.5 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl flex items-center gap-2 text-secondary-700 dark:text-secondary-300"
                        >
                            <HiFilter className="w-5 h-5" />
                            <span>Filters</span>
                            {hasActiveFilters && (
                                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className={`
                        ${showFilters ? 'fixed inset-0 z-50 bg-white dark:bg-secondary-900 p-6 overflow-y-auto' : 'hidden'} 
                        md:block md:static md:w-72 md:flex-shrink-0
                    `}>
                        {/* Mobile Header */}
                        <div className="flex justify-between items-center mb-6 md:hidden">
                            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Filters</h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg"
                            >
                                <HiX className="w-6 h-6 text-secondary-500" />
                            </button>
                        </div>

                        {/* Filter Card */}
                        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700 p-6 md:sticky md:top-4">
                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-4 flex items-center gap-1"
                                >
                                    <HiX className="w-4 h-4" />
                                    Clear all filters
                                </button>
                            )}

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Categories</h3>
                                <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                                    {/* All Categories Option */}
                                    <label className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category === ''}
                                            onChange={() => handleFilterChange('category', '')}
                                            className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                                        />
                                        <span className={`text-sm ${filters.category === '' ? 'font-medium text-primary-600' : 'text-secondary-600 dark:text-secondary-300'}`}>
                                            All Categories
                                        </span>
                                        <span className="ml-auto text-xs text-secondary-400">
                                            ({pagination.count})
                                        </span>
                                    </label>

                                    {/* Main Categories with Subcategories */}
                                    {organizedCategories.map((mainCat) => (
                                        <div key={mainCat.id} className="border-t border-secondary-100 dark:border-secondary-700 pt-1">
                                            {/* Main Category Header */}
                                            <div className="flex items-center">
                                                <label className="flex-1 flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        checked={filters.category === mainCat.slug}
                                                        onChange={() => handleFilterChange('category', mainCat.slug)}
                                                        className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                                                    />
                                                    <span className={`text-sm font-medium ${filters.category === mainCat.slug ? 'text-primary-600' : 'text-secondary-900 dark:text-white'}`}>
                                                        {mainCat.name}
                                                    </span>
                                                </label>

                                                {/* Expand/Collapse Button */}
                                                {mainCat.children && mainCat.children.length > 0 && (
                                                    <button
                                                        onClick={() => toggleCategory(mainCat.id)}
                                                        className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg"
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
                                            {mainCat.children && mainCat.children.length > 0 && expandedCategories[mainCat.id] && (
                                                <div className="ml-4 pl-4 border-l-2 border-secondary-100 dark:border-secondary-700 space-y-1 pb-2">
                                                    {mainCat.children.map((subCat) => (
                                                        <label
                                                            key={subCat.id}
                                                            className="flex items-center gap-3 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="category"
                                                                checked={filters.category === subCat.slug}
                                                                onChange={() => handleFilterChange('category', subCat.slug)}
                                                                className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                                                            />
                                                            <span className={`text-sm ${filters.category === subCat.slug ? 'font-medium text-primary-600' : 'text-secondary-500 dark:text-secondary-400'}`}>
                                                                {subCat.name}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Price Range</h3>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={filters.minPrice}
                                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                            placeholder="Min"
                                            min="0"
                                            className="w-full px-3 py-2 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <span className="text-secondary-400 self-center">-</span>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={filters.maxPrice}
                                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                            placeholder="Max"
                                            min="0"
                                            className="w-full px-3 py-2 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Quick Price Filters */}
                                <div className="flex flex-wrap gap-2 mt-3">
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
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                                filters.minPrice === range.min && filters.maxPrice === range.max
                                                    ? 'bg-primary-100 border-primary-300 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-400'
                                                    : 'border-secondary-200 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:border-primary-300 hover:text-primary-600'
                                            }`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">Sort By</h3>
                                <select
                                    value={filters.ordering}
                                    onChange={(e) => handleFilterChange('ordering', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="-created_at">Newest First</option>
                                    <option value="created_at">Oldest First</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="-price">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                    <option value="-name">Name: Z to A</option>
                                    <option value="-featured">Featured</option>
                                </select>
                            </div>

                            {/* Mobile Apply Button */}
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors md:hidden"
                            >
                                Show {pagination.count} Products
                            </button>
                        </div>
                    </aside>

                    {/* Products Section */}
                    <main className="flex-1">
                        {/* Products Grid */}
                        <ProductGrid products={products} isLoading={isLoading} />

                        {/* Pagination */}
                        {!isLoading && pagination.totalPages > 1 && (
                            <div className="mt-12 flex flex-col items-center gap-4">
                                {/* Page Info */}
                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Showing {((filters.page - 1) * pagination.pageSize) + 1} - {Math.min(filters.page * pagination.pageSize, pagination.count)} of {pagination.count} products
                                </p>

                                {/* Pagination Controls */}
                                <div className="flex items-center gap-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(filters.page - 1)}
                                        disabled={filters.page === 1}
                                        className={`p-2 rounded-lg border transition-colors ${
                                            filters.page === 1
                                                ? 'border-secondary-200 dark:border-secondary-700 text-secondary-300 dark:text-secondary-600 cursor-not-allowed'
                                                : 'border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                                        }`}
                                    >
                                        <HiChevronLeft className="w-5 h-5" />
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-1">
                                        {getPageNumbers().map((page, index) => (
                                            page === '...' ? (
                                                <span
                                                    key={`ellipsis-${index}`}
                                                    className="px-3 py-2 text-secondary-400"
                                                >
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`min-w-[40px] h-10 rounded-lg font-medium transition-colors ${
                                                        filters.page === page
                                                            ? 'bg-primary-600 text-white'
                                                            : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
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
                                        className={`p-2 rounded-lg border transition-colors ${
                                            filters.page === pagination.totalPages
                                                ? 'border-secondary-200 dark:border-secondary-700 text-secondary-300 dark:text-secondary-600 cursor-not-allowed'
                                                : 'border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                                        }`}
                                    >
                                        <HiChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Jump to Page (for many pages) */}
                                {pagination.totalPages > 10 && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-secondary-500 dark:text-secondary-400">Go to page:</span>
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
                                            className="w-16 px-2 py-1 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-center text-secondary-900 dark:text-white"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No Products Message */}
                        {!isLoading && products.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center">
                                    <HiSearch className="w-12 h-12 text-secondary-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                                    No products found
                                </h3>
                                <p className="text-secondary-500 dark:text-secondary-400 mb-6">
                                    Try adjusting your filters or search terms
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Products;