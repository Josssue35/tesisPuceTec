// src/App.js
import React from 'react';

import ProductList from './components/ProductList';
import HomePage from './components/HomePage';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
