import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Pagination, Modal, Table } from "react-bootstrap";
import AdminSideMenu from "../components/SideMenuAdmin";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Bar, Line } from "react-chartjs-2";
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

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const itemsPerPage = 10; // Número de registros por página

    // Estado para el Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/pedido/pedido-total")
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setFilteredData(data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const fetchOrderDetails = (id) => {
        fetch(`http://localhost:3000/api/pedido/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setOrderDetails(data);
                setShowModal(true);
            })
            .catch((error) => console.error("Error fetching order details:", error));
    };

    const handleOpenModal = (id) => {
        setSelectedOrderId(id);
        fetchOrderDetails(id);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        const { startDate, endDate, minTotal, maxTotal, sellerName, orderId } = filters;

        const filtered = data.filter((row) => {
            const startDateWithTime = startDate ? new Date(startDate + "T00:00:00Z") : null;
            const endDateWithTime = endDate ? new Date(endDate + "T23:59:59Z") : null;
            const rowDate = new Date(row.fecha);

            const matchesStartDate = startDateWithTime ? rowDate >= startDateWithTime : true;
            const matchesEndDate = endDateWithTime ? rowDate <= endDateWithTime : true;
            const matchesMinTotal = minTotal ? parseFloat(row.total_compra) >= parseFloat(minTotal) : true;
            const matchesMaxTotal = maxTotal ? parseFloat(row.total_compra) <= parseFloat(maxTotal) : true;
            const matchesSellerName = sellerName
                ? row.usuario.toLowerCase().includes(sellerName.toLowerCase())
                : true;
            const matchesOrderId = orderId ? row.id.toString() === orderId.toString() : true;

            return matchesStartDate && matchesEndDate && matchesMinTotal && matchesMaxTotal && matchesSellerName && matchesOrderId;
        });

        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handleExportExcel = () => {
        console.log("Datos filtrados:", filteredData);

        const excelData = filteredData.map((row) => ({
            "Número de Orden": row.id,
            "Vendedor": row.usuario,
            "Total Compra ($)": parseFloat(row.total_compra).toFixed(2),
            "Fecha Compra": format(new Date(row.fecha), "dd/MM/yyyy HH:mm:ss"),
        }));

        console.log("Datos para Excel:", excelData);

        // Crear la hoja de cálculo sin encabezados personalizados
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Agregar encabezados personalizados manualmente
        const headers = ["Número de Orden", "Vendedor", "Total Compra ($)", "Fecha Compra"];
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

        // Aplicar estilos a los encabezados
        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4F81BD" } }, // Azul
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };

        // Aplicar estilos a los encabezados
        for (let col = 0; col < headers.length; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // Primera fila (encabezados)
            if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
            worksheet[cellAddress].s = headerStyle;
        }

        // Aplicar estilos a los datos
        const dataStyle = {
            font: { color: { rgb: "000000" } },
            alignment: { horizontal: "left", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
        };

        const rowCount = filteredData.length;
        for (let row = 1; row <= rowCount; row++) {
            for (let col = 0; col < headers.length; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
                worksheet[cellAddress].s = dataStyle;
            }
        }


        worksheet['!cols'] = [
            { wch: 15 }, // Número de Orden
            { wch: 30 }, // Vendedor
            { wch: 15 }, // Total Compra ($)
            { wch: 30 }, // Fecha Compra
        ];

        // Crear el libro y exportarlo
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

        XLSX.writeFile(workbook, "Reporte_Ventas.xlsx");
    };


    const sortedData = filteredData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const totalSales = sortedData.reduce((acc, curr) => acc + parseFloat(curr.total_compra), 0);

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

    const salesByMonth = data.reduce((acc, curr) => {
        const date = format(new Date(curr.fecha), 'MM/yyyy');  // Extrae solo mes y año
        acc[date] = (acc[date] || 0) + parseFloat(curr.total_compra);
        return acc;
    }, {});

    const topMonth = Object.keys(salesByMonth).reduce((a, b) =>
        salesByMonth[a] > salesByMonth[b] ? a : b, "");

    const sales = {
        labels: [topMonth],
        datasets: [
            {
                label: 'Ventas en el mes',
                data: [salesByMonth[topMonth]],
                backgroundColor: "#41cb30",
                borderColor: "#388E3C",
                borderWidth: 1,
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

    // Obtener datos para la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Calcular total de páginas
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div className="col-lg-2 col-md-3">
                    <AdminSideMenu />
                </div>

                {/* Contenido principal y gráficas */}
                <div className="col-lg-10 col-md-9" style={{ marginLeft: "250px" }}>
                    <div className="row">
                        {/* Contenido principal (tabla y filtros) */}
                        <div className="col-lg-9 col-md-8 report-container">
                            <h1 className="text-center my-4">Reportería</h1>

                            {/* Filters Section */}
                            <div className="filters mb-4">
                                <Row>
                                    {[
                                        { label: 'Fecha Inicio', name: 'startDate', type: 'date', value: filters.startDate },
                                        { label: 'Fecha Fin', name: 'endDate', type: 'date', value: filters.endDate },
                                        { label: 'Mínimo Total', name: 'minTotal', type: 'number', value: filters.minTotal },
                                        { label: 'Máximo Total', name: 'maxTotal', type: 'number', value: filters.maxTotal },
                                        { label: 'Vendedor', name: 'sellerName', type: 'text', value: filters.sellerName },
                                        { label: 'ID Orden', name: 'orderId', type: 'text', value: filters.orderId },
                                    ].map((filter, index) => (
                                        <Col key={index} md={2}>
                                            <Form.Group>
                                                <Form.Label>{filter.label}</Form.Label>
                                                <Form.Control
                                                    type={filter.type}
                                                    name={filter.name}
                                                    value={filter.value}
                                                    onChange={handleFilterChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    ))}
                                </Row>
                                <div className="text-center mt-3">
                                    <Button variant="primary" onClick={applyFilters} className="mx-2">
                                        Aplicar Filtros
                                    </Button>
                                    <Button variant="success" onClick={handleExportExcel} className="mx-2">
                                        Exportar a Excel
                                    </Button>
                                </div>
                            </div>

                            {/* Data Table */}
                            <div className="table-responsive">
                                <table className="table table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th>Número de Orden</th>
                                            <th>Vendedor</th>
                                            <th>Total Compra</th>
                                            <th>Fecha Compra</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((row) => (
                                            <tr key={row.id}>
                                                <td>{row.id}</td>
                                                <td>{row.usuario}</td>
                                                <td>{row.total_compra}</td>
                                                <td>{format(new Date(row.fecha), "dd/MM/yyyy HH:mm:ss")}</td>
                                                <td>
                                                    <Button
                                                        className="btn btn-custom-info"
                                                        onClick={() => handleOpenModal(row.id)}
                                                    >
                                                        Ver Detalles
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <Pagination className="justify-content-center">
                                {[...Array(totalPages).keys()].map((page) => (
                                    <Pagination.Item
                                        key={page}
                                        active={page + 1 === currentPage}
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        {page + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>

                            {/* Modal */}
                            <Modal show={showModal} onHide={handleCloseModal} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Detalles del Pedido #{selectedOrderId}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {orderDetails.length > 0 ? (
                                        <Table striped bordered>
                                            <thead>
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Cantidad</th>
                                                    <th>Precio</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderDetails.map((detail) => (
                                                    <tr key={detail.detalle_id}>
                                                        <td>{detail.producto_nombre}</td>
                                                        <td>{detail.cantidad}</td>
                                                        <td>${detail.precio}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p>No se encontraron detalles para este pedido.</p>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Cerrar
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>

                        {/* Gráficas */}
                        <div className="col-lg-3 col-md-4 chart-container" style={{ borderLeft: "2px solid #f9f9f9" }}>
                            <div className="mb-4">
                                <h3 className="text-center">Ventas Totales: ${totalSales.toFixed(2)}</h3>
                                <Line data={lineData} />
                            </div>
                            <div>
                                <h3 className="text-center">Mayor Vendedor: {topSeller}</h3>
                                <Bar data={barData} />
                            </div>
                            <div>
                                <h3 className="text-center">Mes más vendido: {topMonth}</h3>
                                <h3 className="text-center">${salesByMonth[topMonth]}</h3>
                                <Bar data={sales} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;