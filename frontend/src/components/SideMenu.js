import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AdminSideMenu.css';
import logo from '../resources/logoDelValle.png';

const SideMenu = () => {
    const navigate = useNavigate();


    const fullname = localStorage.getItem('fullname') || 'Usuario';

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('cedula');
        localStorage.removeItem('userRole');
        localStorage.removeItem('fullname');
        navigate('/login');
    };

    return (
        <div className="side-menu">
            <div className="logo-container">
                <Link to="/homepage">
                    <img
                        src={logo}
                        alt="Logo"
                        className="logo-image"
                    />
                </Link>
            </div>
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

            <div className="side-menu-footer">
                <div className="user-info">
                    <i className="bi bi-person-circle"></i>
                    <span>{fullname}</span>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </div>
    );
};

export default SideMenu;