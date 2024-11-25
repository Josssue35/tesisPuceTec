import React, { useEffect, useState } from "react";
import Orders from "./components/Orders"; // Importa el componente Orders desde la carpeta Components
import axios from "axios";

const OrderPage = () => {
    const [orders, setOrders] = useState([]); // Estado inicial como un array vacío

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/api/pedido");
                setOrders(response.data); // Supone que la respuesta es un array
            } catch (error) {
                console.error("Error al obtener los pedidos:", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h1>Lista de Pedidos</h1>
            <Orders orders={orders} /> {/* Pasa orders como prop al componente */}
        </div>
    );
};

export default OrderPage;
