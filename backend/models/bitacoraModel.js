const pool = require('../config/database.js');
const fechaEcuador = new Date();
console.log('Fecha de Ecuador:', fechaEcuador);
async function getAllBitacora() {
    try {
        const result = await pool.query('SELECT * FROM bitacora')
        console.log('Bitacora de la base:', result.rows)
        return result.rows
    }
    catch (error) {
        console.error('Error al recuperar los productos:', error)
        throw new Error('Error de base de datos durante la recuperación de productos')
    }
}

async function createBitacora(modulo, accion, detalle, usuario_id) {
    if (!modulo || !accion || !detalle || !usuario_id) {
        throw new Error('Todos los campos (modulo, accion, detalle, usuario_id, fecha) son requeridos');
    }
    try {
        const newBitacora = await pool.query(
            'INSERT INTO bitacora (modulo, accion, detalle, usuario_id, fecha) VALUES ($1, $2, $3, $4, $5) RETURNING id, modulo, accion, detalle, usuario_id, fecha',
            [modulo, accion, detalle, usuario_id, fechaEcuador]
        );
        return newBitacora.rows[0];
    } catch (error) {
        console.error('Error creando el producto:', error);
        throw new Error('Error en la base de datos durante la creación de la bitacora');
    }
}

module.exports = {
    getAllBitacora,
    createBitacora
}  