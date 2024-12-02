// src/App.js
import React from 'react';
import './App.css'; // Mantener la importación de App.css
import Login from './components/Login'; // Mantener la importación de Login desde la rama loggin
import ProductList from './components/ProductList';
import HomePage from './components/HomePage';
import OrdersPage from './components/Orders';
import Reports from './components/Reports'; // Importar Reports desde la rama modeloFront

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
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
