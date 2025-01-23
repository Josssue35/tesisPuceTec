import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import HomePage from './pages/HomePage';
import Reports from './pages/Reports';
import Register from './pages/Register';
import Staff from './pages/Staff';
import Inventory from './pages/Inventory';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          {/* Redirige a la página de login por defecto */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/register" element={<Register />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/inventarios" element={<Inventory />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
