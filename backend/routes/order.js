// routes/order.js
const express = require('express');
const router = express.Router();
const { createPedido, obtenerPedidos, obtenerPedidosTotal } = require('../models/pedidoModel');

// Ruta para crear un nuevo pedido
router.post('/', async (req, res) => {
    const { userId, totalPrice, productos } = req.body;


    if (!userId || !totalPrice || !productos || productos.length === 0) {
        return res.status(400).json({ message: 'Datos incompletos: userId y productos son requeridos.' });
    }

    try {
        // Llama a tu función para guardar el pedido en la base de datos
        const result = await createPedido(userId, totalPrice, productos);
        res.status(201).json({ message: 'Pedido creado con éxito', pedidoId: result.pedidoId });
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        res.status(500).json({ message: 'Error interno al procesar el pedido.' });
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


router.get('/total', async (req, res) => {
    try {
        const pedidosTotal = await obtenerPedidosTotal();
        res.status(200).json(pedidosTotal)
    }
    catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos.' });
    }
})
module.exports = router;
