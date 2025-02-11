// routes/order.js
const express = require('express');
const router = express.Router();
const { createPedido, obtenerPedidoPorId, obtenerPedidosTotal, pedidosTotal } = require('../models/pedidoModel');

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

// Obtener todos los pedidos (ruta específica)
router.get('/pedido-total', async (req, res) => {
    try {
        const pedidosTotal = await obtenerPedidosTotal();
        res.status(200).json(pedidosTotal);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos.' });
    }
});

// Obtener un pedido por ID (ruta dinámica)
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID debe ser un número válido.' });
        }

        const pedido = await obtenerPedidoPorId(id);
        if (!pedido || pedido.length === 0) {
            return res.status(404).json({ message: `No se encontró ningún pedido con el ID ${id}` });
        }

        res.status(200).json(pedido);
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


router.get('/top/pedidos', async (req, res) => {
    try {
        const pedidos = await pedidosTotal();
        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos.' });
    }
});

module.exports = router;
