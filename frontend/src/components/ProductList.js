import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SelectedProducts from './SelectedProducts';
import AdminSideMenu from './SideMenuAdmin';
import '../styles/ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [currentSection, setCurrentSection] = useState('menu');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/producto');
                setProducts(response.data);
            } catch (error) {
                console.error('Error al cargar productos:', error);
            }
        };

        fetchProducts();
    }, []);

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

    const filteredProducts = (description) =>
        products.filter(product => product.descripcion === description);

    const handleClearCart = () => {
        setSelectedProducts([]);
    };

    return (
        <div className="row">
            {/* Menú lateral */}
            <div className="col-md-2">
                <AdminSideMenu />
            </div>

            {/* Contenido principal */}
            <div className="col-md-10">
                <div className="section-buttons">
                    <button onClick={() => setCurrentSection('menu')} className={`section-btn ${currentSection === 'menu' ? 'active' : ''}`}>
                        Menú
                    </button>
                    <button onClick={() => setCurrentSection('bebidas')} className={`section-btn ${currentSection === 'bebidas' ? 'active' : ''}`}>
                        Bebidas
                    </button>
                </div>

                <div className="category-container">
                    {currentSection === 'menu' && (
                        <>
                            <Category title="Combos Personales" products={filteredProducts('Combos personales')} onAdd={handleAddProduct} />
                            <Category title="Promoción" products={filteredProducts('Promoción')} onAdd={handleAddProduct} />
                            <Category title="Porciones" products={filteredProducts('Porciones')} onAdd={handleAddProduct} />
                        </>
                    )}
                    {currentSection === 'bebidas' && (
                        <>
                            <Category title="Gaseosas" products={filteredProducts('Gaseosa')} onAdd={handleAddProduct} />
                            <Category title="Tea" products={filteredProducts('Tea')} onAdd={handleAddProduct} />
                            <Category title="Jugos" products={filteredProducts('Jugo')} onAdd={handleAddProduct} />
                            <Category title="Agua" products={filteredProducts('Agua')} onAdd={handleAddProduct} />
                        </>
                    )}
                </div>

                <div className="selected-products-container">
                    <SelectedProducts
                        selectedProducts={selectedProducts}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveProduct}
                        clearCart={handleClearCart}
                    />
                </div>
            </div>
        </div>

    );
};

const Category = ({ title, products, onAdd }) => (
    <div className="category">
        <h3>{title}</h3>
        <div className="product-list">
            {products.map(product => (
                <div key={product.id} className="product-item">
                    <button onClick={() => onAdd(product)} className="product-btn">
                        {product.nombre}
                    </button>
                    <span className="product-price">${product.precio}</span>
                </div>
            ))}
        </div>
    </div>
);

export default ProductList;
