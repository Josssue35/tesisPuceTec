import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProductList from './components/ProductList';
import HomePage from './components/HomePage';
import OrdersPage from './components/OrderPage'; // Asegúrate de que esta sea la importación correcta
import Reports from './components/Reports'; // Importar Reports desde la rama modeloFront

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
