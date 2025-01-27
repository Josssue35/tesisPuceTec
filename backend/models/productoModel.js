const pool = require('../config/database.js')

const fechaEcuador = new Date();
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

async function updateProducto(id, nombre, descripcion, precio, cantidad_disponible, categoria_id) {
    if (!id || !nombre || !descripcion || !precio || !cantidad_disponible || !categoria_id) {
        throw new Error("Todos los campos son requeridos");
    }

    try {
        const updateProducto = await pool.query(
            'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, cantidad_disponible = $4, categoria_id = $5 WHERE id = $6 RETURNING *',
            [nombre, descripcion, precio, cantidad_disponible, categoria_id, id]
        );

        if (updateProducto.rows.length === 0) {
            throw new Error("Producto no encontrado");
        }

        return updateProducto.rows[0];
    } catch (error) {
        throw new Error("Error al actualizar el producto: " + error.message);
    }
}


async function deleteProducto(id) {
    if (!id) {
        throw new Error("El ID del producto es requerido");
    }

    try {
        const result = await pool.query(
            'DELETE FROM productos WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            throw new Error("Producto no encontrado");
        }
        return result.rows[0];
    } catch (error) {
        throw new Error("Error al eliminar el producto: " + error.message);
    }
}

module.exports = {
    getAllProducts,
    createProducto,
    updateProducto,
    deleteProducto
};