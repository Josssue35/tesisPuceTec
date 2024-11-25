// src/App.js
import React from 'react';
import './App.css';
import ProductList from './components/ProductList';
import HomePage from './components/HomePage';
import OrdersPage from './components/Orders';
import Reports from './components/Reports';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
