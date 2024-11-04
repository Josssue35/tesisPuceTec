import React, { useState, useEffect } from 'react';

const SelectedProducts = ({ selectedProducts, onUpdateQuantity, onRemove }) => {
    const [totalPrice, setTotalPrice] = useState(0);

    const handleQuantityChange = async (id, newQuantity) => {
        await onUpdateQuantity(id, newQuantity);
        calculateTotalPrice(); // Actualiza el total después de cambiar la cantidad
    };

    const calculateTotalPrice = () => {
        const total = selectedProducts.reduce((sum, { product, quantity }) => {
            return sum + (product.price * quantity);
        }, 0);
        setTotalPrice(total);
    };

    const handleAcceptPurchase = () => {
        alert(`Compra aceptada! Total: $${totalPrice}`);
    };

    // Efecto para calcular el precio total al montar y al cambiar selectedProducts
    useEffect(() => {
        calculateTotalPrice();
    }, [selectedProducts]);

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
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)} // Asegúrate de que sea un número válido
                        style={{ width: '50px', marginLeft: '5px' }}
                    />
                    <button onClick={() => onRemove(product.id)} style={{ marginLeft: '10px' }}>
                        Quitar
                    </button>
                </div>
            ))}

            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button onClick={handleAcceptPurchase} style={{ marginTop: '10px' }}>
                Aceptar Compra
            </button>
        </div>
    );
};

export default SelectedProducts;
