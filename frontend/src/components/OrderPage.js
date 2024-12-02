import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]); // Estado para los pedidos
    const [error, setError] = useState(""); // Estado para manejar errores

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/pedido");
                setOrders(response.data); // Actualiza el estado con los datos obtenidos
            } catch (err) {
                console.error("Error al obtener los pedidos:", err);
                setError("No se pudieron cargar los pedidos. Inténtalo más tarde.");
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h1>Lista de Pedidos</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <OrdersTable orders={orders} />
        </div>
    );
};

const OrdersTable = ({ orders }) => {
    if (!orders || orders.length === 0) {
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
                {orders.map((order) => (
                    <tr key={order.detalle_id}>
                        <td>{order.pedido_id}</td>
                        <td>{order.producto_nombre}</td>
                        <td>{order.cantidad}</td>
                        <td>${order.precio.toFixed(2)}</td>
                        <td>{order.producto_descripcion}</td>
                        <td>{order.categoria_nombre}</td>
                        <td>{new Date(order.fecha_pedido).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default OrdersPage;
