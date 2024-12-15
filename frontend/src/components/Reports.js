import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import SideMenu from "./SideMenu"; // Menú lateral
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { format } from 'date-fns';
import "../styles/Report.css";

ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement,
    PointElement, LineElement
);


const Reports = () => {
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        minTotal: "",
        maxTotal: "",
        sellerName: "",
        orderId: "",
    });

    const [data, setData] = useState([]); // Datos obtenidos de la API
    const [filteredData, setFilteredData] = useState([]);

    // Cargar datos de la API al montar el componente
    useEffect(() => {
        fetch("http://localhost:3000/api/pedido/total")
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setFilteredData(data); // Inicialmente mostrar todos los datos
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };



    const applyFilters = () => {
        const { startDate, endDate, minTotal, maxTotal, sellerName, orderId } = filters;

        const filtered = data.filter((row) => {
            // Convertir las fechas de los filtros a objetos Date en UTC
            const startDateWithTime = startDate ? new Date(startDate + "T00:00:00Z") : null;
            const endDateWithTime = endDate ? new Date(endDate + "T23:59:59Z") : null;

            // Convertir la fecha de la fila a un objeto Date en UTC
            const rowDate = new Date(row.fecha);

            // Asegurarse de que las fechas de la fila estén dentro del rango de fechas seleccionado
            const matchesStartDate = startDateWithTime ? rowDate >= startDateWithTime : true;
            const matchesEndDate = endDateWithTime ? rowDate <= endDateWithTime : true;

            // Filtrado de totales
            const matchesMinTotal = minTotal ? parseFloat(row.total_compra) >= parseFloat(minTotal) : true;
            const matchesMaxTotal = maxTotal ? parseFloat(row.total_compra) <= parseFloat(maxTotal) : true;

            // Filtrado de vendedor
            const matchesSellerName = sellerName
                ? row.usuario.toLowerCase().includes(sellerName.toLowerCase())
                : true;

            // Filtrado por ID de orden
            const matchesOrderId = orderId ? row.id.toString() === orderId.toString() : true;

            // Retornar verdadero solo si todas las condiciones se cumplen
            return matchesStartDate && matchesEndDate && matchesMinTotal && matchesMaxTotal && matchesSellerName && matchesOrderId;
        });

        setFilteredData(filtered);
    };




    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, "Report.xlsx");
    };

    // Generar estadísticas
    const totalSales = filteredData.reduce((acc, curr) => acc + parseFloat(curr.total_compra), 0);

    const salesBySeller = filteredData.reduce((acc, curr) => {
        acc[curr.usuario] = (acc[curr.usuario] || 0) + parseFloat(curr.total_compra);
        return acc;
    }, {});

    const salesByDate = filteredData.reduce((acc, curr) => {
        const date = format(new Date(curr.fecha), 'dd/MM/yyyy');
        acc[date] = (acc[date] || 0) + parseFloat(curr.total_compra);
        return acc;
    }, {});

    const topSeller = Object.keys(salesBySeller).reduce((a, b) =>
        salesBySeller[a] > salesBySeller[b] ? a : b, "");

    const pieData = {
        labels: Object.keys(salesBySeller),
        datasets: [
            {
                data: Object.values(salesBySeller),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
                hoverOffset: 10,
            },
        ],
    };

    const barData = {
        labels: Object.keys(salesBySeller),
        datasets: [
            {
                label: 'Ventas por Vendedor',
                data: Object.values(salesBySeller),
                backgroundColor: "#36A2EB",
                borderColor: "#36A2EB",
                borderWidth: 1,
            },
        ],
    };

    const lineData = {
        labels: Object.keys(salesByDate),
        datasets: [
            {
                label: 'Progreso de Ventas Totales',
                data: Object.values(salesByDate),
                fill: false,
                borderColor: "#FF6384",
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div>
                    <SideMenu />
                </div>

                <div className="col-md-9">
                    <h1 className="text-center my-4">Reportería</h1>

                    {/* Filtros */}
                    <div className="filters mb-4">
                        <Row>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Fecha Inicio</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Fecha Fin</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Mínimo Total</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="minTotal"
                                        value={filters.minTotal}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Máximo Total</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="maxTotal"
                                        value={filters.maxTotal}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Vendedor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sellerName"
                                        value={filters.sellerName}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>ID Orden</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="orderId"
                                        value={filters.orderId}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="text-center mt-3">
                            <Button variant="primary" onClick={applyFilters}>
                                Aplicar Filtros
                            </Button>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th>Número de Orden</th>
                                    <th>Vendedor</th>
                                    <th>Total Compra</th>
                                    <th>Fecha Compra</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td>{row.usuario}</td>
                                        <td>{row.total_compra}</td>
                                        <td>{format(new Date(row.fecha), 'dd/MM/yyyy HH:mm:ss')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Estadísticas */}
                    <div className="row mt-4">
                        <div className="col-md-6">
                            <h3 className="text-center">Ventas Totales: ${totalSales.toFixed(2)}</h3>
                            <Line data={lineData} />
                        </div>
                        <div className="col-md-6">
                            <h3 className="text-center">Mayor Vendedor: {topSeller}</h3>
                            <Bar data={barData} />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-12">
                            <h4 className="text-center">Ventas por Vendedor</h4>
                            <Pie data={pieData} />
                        </div>
                    </div>

                    {/* Botón de exportación */}
                    <div className="text-center mt-3">
                        <Button variant="success" onClick={handleExportExcel}>
                            Exportar a Excel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
