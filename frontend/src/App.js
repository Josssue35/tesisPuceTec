import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProductList from './components/ProductList';
import HomePage from './components/HomePage';
import OrdersPage from './components/OrderPage';
import Reports from './components/Reports';
import Register from './components/Register';
import Staff from './components/Staff';

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
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/register" element={<Register />} />
          <Route path="/staff" element={<Staff />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
