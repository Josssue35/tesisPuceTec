const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    createProducto, updateProducto, deleteProducto
} = require('../models/productoModel');

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await getAllProducts();
        console.log('Productos respuesta:', products);
        res.json(products); // Enviar la lista de productos como respuesta
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
});

router.post('/crear-producto', async (req, res) => {
    const { nombre, descripcion, precio, cantidad_disponible, categoria_id } = req.body;

    try {
        const newProduct = await createProducto(nombre, descripcion, precio, cantidad_disponible, categoria_id);
        res.status(201).json(newProduct);
    } catch (error) {
        console.log('Error al crear el producto:', error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/actualizar-producto/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad_disponible, categoria_id } = req.body;

    try {

        const productoActualizado = await updateProducto(id, nombre, descripcion, precio, cantidad_disponible, categoria_id);

        res.status(200).json({
            success: true,
            message: 'Producto actualizado correctamente',
            data: productoActualizado,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

router.delete('/eliminar-producto/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const productoEliminado = await deleteProducto(id);

        res.status(200).json({
            success: true,
            message: 'Producto eliminado correctamente',
            data: productoEliminado,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router; 
