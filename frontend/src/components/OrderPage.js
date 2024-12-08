import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orderstyles.css"; // Importamos los estilos

const OrdersPage = () => {
    const [orders, setOrders] = useState([]); // Estado para los pedidos
    const [error, setError] = useState(""); // Estado para manejar errores
    const [loading, setLoading] = useState(true); // Estado para indicar carga

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/pedido");
                if (response.status === 200) {
                    setOrders(response.data); // Actualiza el estado con los datos obtenidos
                } else {
                    setError("Error al cargar los pedidos. Inténtalo más tarde.");
                }
            } catch (err) {
                console.error("Error al obtener los pedidos:", err);
                setError("No se pudieron cargar los pedidos. Inténtalo más tarde.");
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="orders-container">
            <h1 className="orders-title">Lista de Pedidos</h1>
            {loading && <p className="orders-loading">Cargando pedidos...</p>}
            {error && <p className="orders-error">{error}</p>}
            {!loading && !error && <OrdersTable orders={orders} />}
        </div>
    );
};

const OrdersTable = ({ orders }) => {
    if (!orders || orders.length === 0) {
        return <p className="orders-empty">No hay pedidos realizados.</p>;
    }

    return (
        <table className="orders-table">
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
                        <td>{order.producto_nombre || "N/A"}</td>
                        <td>{order.cantidad || 0}</td>
                        <td>${order.precio || 0}</td>
                        <td>{order.producto_descripcion || "N/A"}</td>
                        <td>{order.categoria_nombre || "N/A"}</td>
                        <td>
                            {order.fecha_pedido
                                ? new Date(order.fecha_pedido).toLocaleDateString()
                                : "N/A"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default OrdersPage;
