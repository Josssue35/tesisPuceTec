const express = require('express');
const router = express.Router();
const { createUser, findUser, getAllUsers, deleteUser, createUserAdmin, updateUser } = require('../models/userModel');


router.post('/register', async (req, res) => {
    const { cedula, password, full_name, } = req.body;
    try {
        if (!cedula || !password || !full_name) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        const user = await createUser(cedula, password, full_name);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error en el registro del usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


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
                active: user.active
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: 'Error en el inicio de sesión' });
    }
});

router.get('/personal', async (req, res) => {
    try {
        const users = await getAllUsers();
        console.log('Users sent in response:', users);
        res.json(users);
    } catch (error) {
        console.error('Error in /api/usuarios route:', error);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/personal/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteUser(id);
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.post('/personal/registerAdmin', async (req, res) => {
    const { cedula, password, full_name, role } = req.body;
    try {
        if (!cedula || !password || !full_name || !role) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        const user = await createUserAdmin(cedula, password, full_name, role);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error en el registro del usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.put('/personal/:id', async (req, res) => {
    const { id } = req.params;
    const { cedula, password, fullname, role, active } = req.body;

    try {
        // Validar campos obligatorios
        if (!id || !cedula || !fullname || !role || active === undefined) {
            return res.status(400).json({ message: 'ID, cedula, fullname, role y active son requeridos' });
        }

        // Actualizar el usuario
        const updatedUser = await updateUser(id, cedula, password, fullname, role, active);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: error.message || 'Error en el servidor' });
    }
});
module.exports = router;
