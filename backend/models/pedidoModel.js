const pool = require('../config/database.js');

// Crear un nuevo pedido
async function createPedido(productos) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insertar el pedido en la tabla "pedidos"
        const pedidoResult = await client.query(
            `INSERT INTO pedidos (fecha) VALUES (NOW()) RETURNING id`
        );
        const pedidoId = pedidoResult.rows[0].id;

        // Insertar los detalles del pedido en "detalle_pedido"
        for (const producto of productos) {
            const { productId, quantity, price } = producto;
            await client.query(
                `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio)
                 VALUES ($1, $2, $3, $4)`,
                [pedidoId, productId, quantity, price]
            );

            // Reducir la cantidad disponible del producto
            await client.query(
                `UPDATE productos
                 SET cantidad_disponible = cantidad_disponible - $1
                 WHERE id = $2 AND cantidad_disponible >= $1`,
                [quantity, productId]
            );
        }

        await client.query('COMMIT');
        return { pedidoId };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear el pedido:', error);
        throw new Error('Error al crear el pedido');
    } finally {
        client.release();
    }
}

// Obtener todos los pedidos con sus detalles
async function obtenerPedidos() {
    const client = await pool.connect();
    try {
        // Consulta para obtener los pedidos y sus detalles relacionados
        const result = await client.query(`
            SELECT 
                p.id AS pedido_id,
                dp.id AS detalle_id,
                pr.nombre AS producto_nombre,
                dp.cantidad,
                dp.precio,
                pr.descripcion AS producto_descripcion,
                pr.categoria_id,
                c.nombre AS categoria_nombre,
                p.fecha AS fecha_pedido
            FROM pedidos p
            JOIN detalle_pedido dp ON p.id = dp.pedido_id
            JOIN productos pr ON dp.producto_id = pr.id
            JOIN categorias c ON pr.categoria_id = c.id
            ORDER BY p.id DESC
        `);
        return result.rows; // Devuelve los resultados de la consulta
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        throw new Error('Error al obtener los pedidos');
    } finally {
        client.release();
    }
}

module.exports = { createPedido, obtenerPedidos };
