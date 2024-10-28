import React from 'react';

const SelectedProducts = ({ selectedProducts, onUpdateQuantity, onRemove }) => {
    return (
        <div>
            <h2>Productos Seleccionados</h2>
            {selectedProducts.map(({ product, quantity }) => (
                <div key={product.id} style={{ marginBottom: '10px' }}>
                    <span>{product.name} - ${product.price} x </span>
                    <input
                        type="number"
                        value={quantity}
                        min="0"
                        onChange={(e) => onUpdateQuantity(product.id, parseInt(e.target.value))}
                        style={{ width: '50px', marginLeft: '5px' }}
                    />
                    <button onClick={() => onRemove(product.id)} style={{ marginLeft: '10px' }}>
                        Quitar
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SelectedProducts;
