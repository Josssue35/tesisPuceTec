const pool = require('../config/database.js');

const fechaEcuador = new Date();
fechaEcuador.setHours(fechaEcuador.getHours() - 5);




// Crear un nuevo pedido
async function createPedido(userId, totalPrice, productos) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insertar el pedido en la tabla "pedidos", incluyendo el userId
        const pedidoResult = await client.query(
            `INSERT INTO pedidos (usuario, total_compra, fecha) 
            VALUES ($1, $2, $3) RETURNING id`,
            [userId, totalPrice, fechaEcuador]
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


async function obtenerPedidoPorId(id) {
    const client = await pool.connect();
    try {
        // Consulta para obtener el pedido y sus detalles relacionados filtrado por ID
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
                p.fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Guayaquil' AS fecha_pedido
            FROM pedidos p
            JOIN detalle_pedido dp ON p.id = dp.pedido_id
            JOIN productos pr ON dp.producto_id = pr.id
            JOIN categorias c ON pr.categoria_id = c.id
            WHERE p.id = $1
            ORDER BY p.id DESC
        `, [id]); // Parámetro para la consulta SQL

        if (result.rows.length === 0) {
            throw new Error(`No se encontró ningún pedido con el ID ${id}`);
        }

        return result.rows; // Devuelve el resultado del pedido encontrado
    } catch (error) {
        console.error('Error al obtener el pedido por ID:', error);
        throw new Error('Error al obtener el pedido por ID');
    } finally {
        client.release();
    }
}

async function obtenerPedidosTotal() {
    const client = await pool.connect();
    try {

        const result = await client.query(`
            SELECT 
                p.id ,p.fecha, p.usuario, p.total_compra
            FROM pedidos p
            ORDER BY p.fecha DESC
        `);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        throw new Error('Error al obtener los pedidos');
    } finally {
        client.release();
    }
}

async function pedidosTotal() {
    const client = await pool.connect();
    try {
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
                p.fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Guayaquil' AS fecha_pedido
            FROM pedidos p
            JOIN detalle_pedido dp ON p.id = dp.pedido_id
            JOIN productos pr ON dp.producto_id = pr.id
            JOIN categorias c ON pr.categoria_id = c.id
            ORDER BY p.fecha DESC
        `);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        throw new Error('Error al obtener los pedidos');
    } finally {
        client.release();
    }

}



module.exports = { createPedido, obtenerPedidoPorId, obtenerPedidosTotal, pedidosTotal };
