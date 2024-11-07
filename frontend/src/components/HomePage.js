// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h1>Bienvenido a la Tienda</h1>
            <Link to="/products">Ver Productos</Link>
        </div>
    );
};

export default HomePage;
