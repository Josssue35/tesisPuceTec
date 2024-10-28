// src/ProductList.js
import React, { useState } from 'react';
import SelectedProducts from './SelectedProducts';
import './styles.css';

const ProductList = ({ products }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentSection, setCurrentSection] = useState('menu');

  const handleAddProduct = (product) => {
    const existingProduct = selectedProducts.find(p => p.product.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map(p =>
          p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveProduct(id);
    } else {
      setSelectedProducts(
        selectedProducts.map(p =>
          p.product.id === id ? { ...p, quantity: newQuantity } : p
        )
      );
    }
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts(selectedProducts.filter(p => p.product.id !== id));
  };

  const categories = [...new Set(products.map(product => product.category))];

  return (
    <div className="menu-container">
      <div className="section-container">
        <div className="section-buttons">
          <button onClick={() => setCurrentSection('menu')} className="product-btn">
            Menú
          </button>
          <button onClick={() => setCurrentSection('bebidas')} className="product-btn">
            Bebidas
          </button>
        </div>

        <div className="category-container">
          {categories.map((category) => {
            // Solo muestra categorías según la sección seleccionada
            if (
              (currentSection === 'menu' && category !== 'Bebidas') ||
              (currentSection === 'bebidas' && category === 'Bebidas')
            ) {
              return (
                <div key={category} className="category">
                  <h3>{category}</h3>
                  <div className="product-list">
                    {products.filter(product => product.category === category).map(product => (
                      <div key={product.id} className="product-button">
                        <button
                          onClick={() => handleAddProduct(product)}
                          className="product-btn"
                        >
                          {product.name}
                        </button>
                        <div className="price-tooltip">${product.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="selected-products-container">
        <SelectedProducts
          selectedProducts={selectedProducts}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemoveProduct}
        />
      </div>
    </div>
  );
};

export default ProductList;
