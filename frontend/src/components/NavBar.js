import React from 'react';
import { FaBox, FaClipboardList } from 'react-icons/fa'; // Íconos para los botones
import '../styles/NavBar.css';

const Navbar = ({ onSelect }) => {
    return (
        <nav className="navbar">
            <div className="navbar-links">
                <div className="navbar-link" onClick={() => onSelect('productos')}>
                    <FaBox className="navbar-icon" /> {/* Ícono de productos */}
                    <span>Productos</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
