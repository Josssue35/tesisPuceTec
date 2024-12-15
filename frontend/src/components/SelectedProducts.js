import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProductList.css';

const SelectedProducts = ({ selectedProducts, onUpdateQuantity, onRemove, clearCart }) => {
    const [totalPrice, setTotalPrice] = useState(0);

    // Calcula el precio total
    useEffect(() => {
        const total = selectedProducts.reduce((sum, { product, quantity }) => {
            return sum + parseFloat(product.precio) * quantity;
        }, 0);
        setTotalPrice(total);
    }, [selectedProducts]);

    // Maneja el cambio de cantidad
    const handleQuantityChange = (id, change) => {
        const product = selectedProducts.find((p) => p.product.id === id);
        const newQuantity = Math.max(0, (product.quantity || 0) + change);
        onUpdateQuantity(id, newQuantity);
    };

    const handleAcceptPurchase = async () => {
        if (selectedProducts.length === 0) {
            alert('No tienes productos seleccionados para comprar.');
            return;
        }

        try {

            const userId = localStorage.getItem('fullname');

            const pedidoData = {
                userId: userId,
                totalPrice: parseFloat(totalPrice),
                productos: selectedProducts.map(({ product, quantity }) => ({
                    productId: product.id,
                    quantity: quantity,
                    price: product.precio,
                })),
            };

            // Envía la solicitud al servidor
            const response = await axios.post('/api/pedido', pedidoData);
            console.log(totalPrice)
            console.log('Pedido creado:', response.data);
            alert(`Compra aceptada! Total: $${totalPrice.toFixed(2)}`);

            // Limpia el carrito después de una compra exitosa
            if (typeof clearCart === 'function') {
                clearCart();
            } else {
                console.warn('clearCart no está definida o no es una función.');
            }
        } catch (error) {
            console.error('Error al realizar la compra:', error);

            alert('Hubo un problema al procesar el pedido. Por favor, intenta de nuevo.');
        }
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
