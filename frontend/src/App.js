// src/App.js
import React from 'react';
import ProductList from './ProductList';

const App = () => {
  const products = [
    // Productos de comida
    { id: 1, name: 'Promo 1: Pollo + Pollo', price: 19.00, category: 'Promociones' },
    { id: 2, name: 'Promo 2: Pollo + Medio', price: 16.00, category: 'Promociones' },
    { id: 3, name: 'Promo 3: Medio + Cuarto', price: 8.75, category: 'Promociones' },
    { id: 4, name: 'Combo Personal 1: Cuarto de pollo', price: 4.25, category: 'Combos Personales' },
    { id: 5, name: 'Combo Personal 2: Octavo de Pollo', price: 3.25, category: 'Combos Personales' },
    { id: 6, name: 'Combo Personal 3: Papi Pollo', price: 2.50, category: 'Combos Personales' },
    { id: 7, name: 'Porción de Arroz', price: 1.00, category: 'Porciones' },
    { id: 8, name: 'Porción de Papas', price: 1.00, category: 'Porciones' },
    { id: 9, name: 'Porción de Ensalada', price: 1.00, category: 'Porciones' },

    // Productos de bebidas
    { id: 10, name: 'Cerveza', price: 3.00, category: 'Bebidas' },
    { id: 11, name: 'Refresco', price: 1.50, category: 'Bebidas' },
    { id: 12, name: 'Agua', price: 1.00, category: 'Bebidas' },
    { id: 13, name: 'Jugo Natural', price: 2.50, category: 'Bebidas' },
    { id: 14, name: 'Té Helado', price: 2.00, category: 'Bebidas' },
  ];

  return (
    <div className="App">
      <h1>Asadero</h1>
      <ProductList products={products} />
    </div>
  );
};

export default App;
