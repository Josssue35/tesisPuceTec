import React from "react";

const Orders = ({ orders }) => {
    // Verifica que orders sea un array y tenga elementos
    if (!Array.isArray(orders) || orders.length === 0) {
        return <p>No hay pedidos realizados.</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>ID Pedido</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order.detalle_id}>
                        <td>{order.pedido_id}</td>
                        <td>{order.producto_nombre}</td>
                        <td>{order.cantidad}</td>
                        <td>${order.precio.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Orders;
