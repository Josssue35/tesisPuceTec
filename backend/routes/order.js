// routes/order.js
const express = require('express');
const router = express.Router();
const { createPedido, obtenerPedidos } = require('../models/pedidoModel');

// Ruta para crear un nuevo pedido
router.post('/', async (req, res) => {
    const { productos } = req.body;
    try {
        const result = await createPedido(productos);
        res.status(201).json({ message: 'Pedido creado con éxito', pedidoId: result.pedidoId });
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        res.status(500).json({ message: error.message });
    }
});

// Ruta para obtener todos los pedidos
router.get('/', async (req, res) => {
    try {
        const pedidos = await obtenerPedidos();  // Obtén los pedidos de la base de datos
        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos.' });
    }
});

module.exports = router;
