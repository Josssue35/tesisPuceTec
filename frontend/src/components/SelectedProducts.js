import React, { useState, useEffect } from 'react';
import './styles.css'; // Asegúrate de tener una hoja de estilos moderna

const SelectedProducts = ({ selectedProducts, onUpdateQuantity, onRemove }) => {
    const [totalPrice, setTotalPrice] = useState(0);

    // Calcula el precio total
    const calculateTotalPrice = () => {
        const total = selectedProducts.reduce((sum, { product, quantity }) => {
            return sum + (parseFloat(product.precio) * quantity); // Usamos parseFloat para asegurar que el precio sea un número
        }, 0);
        setTotalPrice(total);
    };

    // Actualiza el total cada vez que cambia la lista de productos seleccionados
    useEffect(() => {
        calculateTotalPrice();
    }, [selectedProducts]);

    // Maneja el cambio de cantidad
    const handleQuantityChange = (id, newQuantity) => {
        onUpdateQuantity(id, newQuantity);
        calculateTotalPrice(); // Recalcula el precio total
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
                                <input
                                    type="number"
                                    value={quantity}
                                    min="0"
                                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)} // Asegura que sea un número válido
                                    className="quantity-input"
                                />
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
