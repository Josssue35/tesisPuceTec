import React, { useState, useEffect } from 'react';
import '../styles/ProductList.css';

const SelectedProducts = ({ selectedProducts, onUpdateQuantity, onRemove }) => {
    const [totalPrice, setTotalPrice] = useState(0);

    // Calcula el precio total
    const calculateTotalPrice = () => {
        const total = selectedProducts.reduce((sum, { product, quantity }) => {
            return sum + parseFloat(product.precio) * quantity; // Usamos parseFloat para asegurar que el precio sea un número
        }, 0);
        setTotalPrice(total);
    };

    // Actualiza el total cada vez que cambia la lista de productos seleccionados
    useEffect(() => {
        calculateTotalPrice();
    }, [selectedProducts]);

    // Maneja el cambio de cantidad
    const handleQuantityChange = (id, change) => {
        const product = selectedProducts.find((p) => p.product.id === id);
        const newQuantity = Math.max(0, (product.quantity || 0) + change); // Asegura que la cantidad no sea negativa
        onUpdateQuantity(id, newQuantity);
    };

    // Maneja la acción de aceptar la compra
    const handleAcceptPurchase = () => {
        alert(`Compra aceptada! Total: $${totalPrice.toFixed(2)}`);
        // Puedes implementar aquí la lógica para finalizar la compra (enviar la orden, etc.)
    };

    return (
        <div className="selected-products-container">
            <h2>Productos Seleccionados</h2>
            <div className="product-list">
                {selectedProducts.length === 0 ? (
                    <p>No has seleccionado productos</p>
                ) : (
                    selectedProducts.map(({ product, quantity }) => (
                        <div key={product.id} className="product-item">
                            <div className="product-info">
                                <span className="product-name">{product.nombre}</span>
                                <span className="product-price">${product.precio}</span>
                            </div>
                            <div className="quantity-control">
                                <button
                                    onClick={() => handleQuantityChange(product.id, -1)}
                                    className="quantity-btn decrement-btn"
                                >
                                    -
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(product.id, 1)}
                                    className="quantity-btn increment-btn"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => onRemove(product.id)}
                                    className="remove-btn"
                                >
                                    Quitar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="total-price">
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
            </div>

            <button onClick={handleAcceptPurchase} className="accept-btn">
                Aceptar Compra
            </button>
        </div>
    );
};

export default SelectedProducts;
