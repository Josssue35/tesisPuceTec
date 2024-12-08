const express = require('express');
const router = express.Router();
const { createUser, findUser } = require('../models/userModel'); // Importar correctamente

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { cedula, password, full_name, } = req.body;
    try {
        if (!cedula || !password || !full_name) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        const user = await createUser(cedula, password, full_name); // Usar createUser directamente
        res.status(201).json(user);
    } catch (error) {
        console.error('Error en el registro del usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { cedula, password } = req.body;
    try {
        if (!cedula || !password) {
            return res.status(400).json({ message: 'Se requieren usuario y contraseña' });
        }

        const user = await findUser(cedula, password);
        if (user) {
            res.json({
                id: user.id,
                cedula: user.cedula,
                role: user.role,
                fullname: user.fullname,
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: 'Error en el inicio de sesión' });
    }
});

module.exports = router;
