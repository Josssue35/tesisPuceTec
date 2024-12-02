import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage-container">
            <h1 className="homepage-title">Bienvenido a la Tienda</h1>
            <div className="section-links">
                <Link to="/products" className="section-card">
                    <i className="bi bi-basket-fill"></i>
                    <span>Menú</span>
                </Link>
                <Link to="/reports" className="section-card">
                    <i className="bi bi-bar-chart-fill"></i>
                    <span>Reportería</span>
                </Link>
                <Link to="/admin" className="section-card">
                    <i className="bi bi-person-circle"></i>
                    <span>Administrador</span>
                </Link>
                <Link to="/orders" className="section-card">
                    <i className="bi bi-receipt"></i>
                    <span>Pedidos</span>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
