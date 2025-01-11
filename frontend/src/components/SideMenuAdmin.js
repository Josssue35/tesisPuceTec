import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SideMenu.css';
import logo from '../resources/logoDelValle.png';

const AdminSideMenu = () => {
    const navigate = useNavigate();

    // Obtener el nombre del usuario logueado desde localStorage
    const fullname = localStorage.getItem('fullname') || 'Usuario';
    const userRole = localStorage.getItem('userRole');

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('cedula');
        localStorage.removeItem('userRole');
        localStorage.removeItem('fullname');
        navigate('/login');
    };


    const isAdmin = userRole === 'admin';

    return (
        <div className="side-menu">
            {/* Logo */}
            <div className="logo-container">
                <Link to="/homepage">
                    <img
                        src={logo}
                        alt="Logo"
                        className="logo-image"
                    />
                </Link>
            </div>

            {/* Opciones del menú */}
            <nav className="menu-options">
                {isAdmin && (
                    <>
                        <Link to="/inventories" className="menu-item">
                            <i className="bi bi-boxes"></i>
                            <span>Inventarios</span>
                        </Link>
                        <Link to="/staff" className="menu-item">
                            <i className="bi bi-people-fill"></i>
                            <span>Personal</span>
                        </Link>
                        <Link to="/log" className="menu-item">
                            <i className="bi bi-journal-text"></i>
                            <span>Bitácora</span>
                        </Link>
                    </>
                )}
                <Link to="/products" className="menu-item">
                    <i className="bi bi-basket-fill"></i>
                    <span>Menú</span>
                </Link>
                <Link to="/reports" className="menu-item">
                    <i className="bi bi-bar-chart-fill"></i>
                    <span>Reportería</span>
                </Link>
            </nav>

            {/* Footer con el nombre del usuario y botón de cerrar sesión */}
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

export default AdminSideMenu;