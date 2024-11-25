// src/components/SideMenu.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SideMenu.css';
import logo from '../resources/logoDelValle.png';



const SideMenu = () => {
    return (
        <div className="side-menu">
            {/* Logo */}
            <div className="logo-container">
                <Link to="/">
                    <img
                        src={logo}
                        alt="Logo"
                        className="logo-image"
                    />
                </Link>
            </div>

            {/* Opciones del menú */}
            <nav className="menu-options">
                <Link to="/products" className="menu-item">
                    <i className="bi bi-basket-fill"></i>
                    <span>Menú</span>
                </Link>
                <Link to="/reports" className="menu-item">
                    <i className="bi bi-bar-chart-fill"></i>
                    <span>Reportería</span>
                </Link>
                <Link to="/admin" className="menu-item">
                    <i className="bi bi-person-circle"></i>
                    <span>Administrador</span>
                </Link>
            </nav>
        </div>
    );
};

export default SideMenu;
