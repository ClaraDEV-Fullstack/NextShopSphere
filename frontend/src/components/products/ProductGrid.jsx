import ProductCard from './ProductCard';
import { useEffect, useState } from 'react';

const ProductGrid = ({ products = [], isLoading }) => {
    const [visibleProducts, setVisibleProducts] = useState([]);

    useEffect(() => {
        if (products.length) {
            setVisibleProducts([]);
            const timer = setTimeout(() => {
                setVisibleProducts(products);
            }, 80);
            return () => clearTimeout(timer);
        }
    }, [products]);

    if (isLoading) {
        return (
            <div className="py-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
                        >
                            <div className="aspect-square bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-3 w-1/3 bg-gray-200 rounded" />
                                <div className="h-4 bg-gray-200 rounded" />
                                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                                <div className="flex justify-between items-center">
                                    <div className="h-5 w-1/4 bg-gray-200 rounded" />
                                    <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!products.length) {
        return (
            <div className="text-center py-20 px-4">
                <h3 className="text-xl font-semibold text-gray-800">
                    No products found
                </h3>
                <p className="text-gray-500 mt-2">
                    Try adjusting your filters or come back later.
                </p>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {visibleProducts.map((product, index) => (
                    <div key={product.id} className="w-full">
                    <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
