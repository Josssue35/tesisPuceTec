const pool = require('../config/database.js')

const fechaEcuador = new Date();
fechaEcuador.setHours(fechaEcuador.getHours() - 5);
async function getAllProducts() {
    try {
        const result = await pool.query('SELECT * FROM productos')
        console.log('Productos de la base:', result.rows)
        return result.rows
    }
    catch (error) {
        console.error('Error al recuperar los productos:', error)
        throw new Error('Error de base de datos durante la recuperación de productos')
    }
}

async function reduceProductQuantity(productId, quantity) {
    try {
        const query = `
            UPDATE productos 
            SET cantidad_disponible = cantidad_disponible - $1 
            WHERE id = $2 AND cantidad_disponible >= $1
            RETURNING *;
        `;
        const values = [quantity, productId];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            throw new Error('No se pudo actualizar la cantidad. Verifica que la cantidad disponible sea suficiente.');
        }

        console.log('Producto actualizado:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al reducir la cantidad del producto:', error);
        throw new Error('Error de base de datos al reducir la cantidad del producto');
    }
}

async function createProducto(nombre, descripcion, precio, cantidad_disponible, categoria_id) {
    if (!nombre || !descripcion || !precio || !cantidad_disponible || !categoria_id) {
        throw new Error('Todos los campos (nombre, descripcion, precio, cantidad_disponible, categoria_id) son requeridos');
    }
    try {
        const newProducto = await pool.query(
            'INSERT INTO productos (nombre, descripcion, precio, cantidad_disponible, categoria_id, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nombre, descripcion, precio, cantidad_disponible, categoria_id, fecha_creacion',
            [nombre, descripcion, precio, cantidad_disponible, categoria_id, fechaEcuador]
        );
        return newProducto.rows[0];
    } catch (error) {
        console.error('Error creando el producto:', error);
        throw new Error('Error en la base de datos durante la creación del producto');
    }
}

module.exports = {
    getAllProducts,
    reduceProductQuantity,
    createProducto
};