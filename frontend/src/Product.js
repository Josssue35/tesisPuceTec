// src/Product.js
import React from 'react';

const Product = ({ product, onAdd }) => {
    const handleAddClick = () => {
        onAdd(product);
    };

    return (
        <button onClick={handleAddClick} style={{ margin: '5px', padding: '10px' }}>
            {product.name} - ${product.price}
        </button>
    );
};

export default Product;
