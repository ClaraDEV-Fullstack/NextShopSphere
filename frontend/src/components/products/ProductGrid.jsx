import ProductCard from './ProductCard';
import Loader from '../common/Loader';

const ProductGrid = ({ products, isLoading }) => {
    if (isLoading) {
        return <Loader />;
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-secondary-500">No products found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;