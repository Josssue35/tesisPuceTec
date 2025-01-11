const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    reduceProductQuantity // Importa la función para reducir la cantidad
} = require('../models/productoModel'); // Asegúrate de que la ruta sea correcta

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await getAllProducts(); // Obtener todos los productos de la base de datos
        console.log('Productos respuesta:', products);
        res.json(products); // Enviar la lista de productos como respuesta
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
});

// Ruta para reducir la cantidad de un producto
router.post('/reduce-stock', async (req, res) => {
    const { productId, quantity } = req.body; // Extraer el ID del producto y la cantidad del cuerpo de la solicitud

    try {
        const updatedProduct = await reduceProductQuantity(productId, quantity); // Reducir la cantidad del producto
        res.status(200).json(updatedProduct); // Enviar el producto actualizado como respuesta
    } catch (error) {
        console.log('Error al reducir la cantidad:', error);
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
});

module.exports = router; // Exportar el router
