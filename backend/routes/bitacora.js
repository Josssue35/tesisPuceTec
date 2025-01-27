const express = require('express');
const router = express.Router();
const {
    getAllBitacora,
    createBitacora
} = require('../models/bitacoraModel');

router.get('/', async (req, res) => {
    try {
        const bitacora = await getAllBitacora();
        console.log('Bitacora respuesta:', bitacora);
        res.json(bitacora);
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/crear-bitacora', async (req, res) => {
    const { modulo, accion, detalle, usuario_id } = req.body;

    try {
        const newBitacora = await createBitacora(modulo, accion, detalle, usuario_id);
        res.status(201).json(newBitacora);
    } catch (error) {
        console.log('Error al crear la bitacora:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
