import React, { useState } from 'react';
import SelectedProducts from './components/SelectedProducts';
import './styles.css';

const BeverageList = ({ beverages }) => {
    const [selectedBeverages, setSelectedBeverages] = useState([]);

    const handleAddBeverage = (beverage) => {
        const existingBeverage = selectedBeverages.find(b => b.beverage.id === beverage.id);
        if (existingBeverage) {
            setSelectedBeverages(
                selectedBeverages.map(b =>
                    b.beverage.id === beverage.id ? { ...b, quantity: b.quantity + 1 } : b
                )
            );
        } else {
            setSelectedBeverages([...selectedBeverages, { beverage, quantity: 1 }]);
        }
    };

    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveBeverage(id);
        } else {
            setSelectedBeverages(
                selectedBeverages.map(b =>
                    b.beverage.id === id ? { ...b, quantity: newQuantity } : b
                )
            );
        }
    };

    const handleRemoveBeverage = (id) => {
        setSelectedBeverages(selectedBeverages.filter(b => b.beverage.id !== id));
    };

    return (
        <div className="beverage-container">
            <h2>Bebidas</h2>
            <div className="product-list">
                {beverages.map(beverage => (
                    <div
                        key={beverage.id}
                        className="product-button"
                    >
                        <button
                            onClick={() => handleAddBeverage(beverage)}
                            className="product-btn"
                        >
                            {beverage.name}
                        </button>
                        <div className="price-tooltip">${beverage.price}</div>
                    </div>
                ))}
            </div>
            <div style={{ flex: 1, marginLeft: '20px' }}>
                <SelectedProducts
                    selectedProducts={selectedBeverages}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveBeverage}
                />
            </div>
        </div>
    );
};

export default BeverageList;
