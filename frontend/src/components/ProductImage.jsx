// src/components/ProductImage.jsx

import { cloudinaryOptimize } from '../utils/cloudinary';

const ProductImage = ({ src, alt }) => {
    return (
        <img
            src={cloudinaryOptimize(src, 400)}
            loading="lazy"
            decoding="async"
            alt={alt}
            className="w-full h-full object-cover"
        />
    );
};

export default ProductImage;
