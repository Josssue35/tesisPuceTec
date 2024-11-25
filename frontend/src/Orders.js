import React from "react";

const Orders = ({ orders }) => {
    // Verifica que orders sea un array válido y tenga elementos
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
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Fecha del Pedido</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order, index) => (
                    <tr key={index}>
                        <td>{order.pedido_id ?? "N/A"}</td>
                        <td>{order.producto_nombre ?? "Sin Nombre"}</td>
                        <td>{order.cantidad ?? 0}</td>
                        <td>${order.precio?.toFixed(2) ?? "0.00"}</td>
                        <td>{order.producto_descripcion ?? "Sin Descripción"}</td>
                        <td>{order.categoria_nombre ?? "Sin Categoría"}</td>
                        <td>
                            {order.fecha_pedido
                                ? new Date(order.fecha_pedido).toLocaleDateString()
                                : "Sin Fecha"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Orders;
