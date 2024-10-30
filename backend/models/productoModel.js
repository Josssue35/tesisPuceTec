const pool = require('../config/database.js')


async function getAllProducts() {
    try {
        const result = await pool.query('SELECT * FROM productos')
        console.log('Productos de la base:', result.rows)
        return result.rows
    }
    catch (error) {
        console.error('Error al recuperar los productos:', error)
        throw new Error('Error de base de datos durante la recuperación de usuarios')
    }
}

module.exports = {
    getAllProducts
}