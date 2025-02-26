import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Modal, Table, Card } from "react-bootstrap";
import AdminSideMenu from "../components/SideMenuAdmin";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import * as XLSX from "xlsx";
import { format } from 'date-fns';
import "../styles/Report.css";
import axios from 'axios';
import Chart from "react-apexcharts";


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
        axios.get("/api/pedido/pedido-total")
            .then((response) => {
                setData(response.data);
                setFilteredData(response.data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const fetchOrderDetails = (id) => {
        axios.get(`/api/pedido/${id}`)
            .then((response) => {
                setOrderDetails(response.data);
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


    const donutSeries = Object.values(salesBySeller).map(Number);

    const donutOptions = {
        chart: {
            type: 'donut',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                },
            },
        },

        labels: Object.keys(salesBySeller), // Nombres de los vendedores
        colors: ['#36A2EB', '#FF6384', '#4BC0C0', '#FF9F40', '#9966FF'], // Colores personalizados
        tooltip: {
            y: {
                formatter: (value) => value.toFixed(2),
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Ventas',
                            formatter: (w) => {
                                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                return total.toFixed(2);
                            },
                        },
                    },
                },
            },
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
        },
    };

    const lineOptions = {
        chart: {
            type: 'line',
        },
        xaxis: {
            categories: Object.keys(salesByDate),
        },
        yaxis: {
            labels: {
                formatter: (value) => Number(value).toFixed(2),
            },
        },
        colors: ['#FF6384'],
    };


    const lineSeries = [
        {
            name: 'Ventas',
            data: Object.values(salesByDate),
        },
    ];
    // Obtener datos para la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);



    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const Pagination = () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);

        return (
            <nav>
                <ul className="pagination justify-content-center">
                    {/* Botón Atrás */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            className="page-link"
                            disabled={currentPage === 1}
                        >
                            Atrás
                        </button>
                    </li>

                    {/* Página Actual */}
                    <li className="page-item active">
                        <span className="page-link">
                            Página {currentPage} de {totalPages}
                        </span>
                    </li>

                    {/* Botón Siguiente */}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            className="page-link"
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };
    return (
        <div className="report-layout">
            <div className="report-sidebar">
                <AdminSideMenu />
            </div>

            <div className="report-main">
                <div className="report-content">
                    <div className="left-report">
                        <Card className="mb-4">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col>
                                        <h1 className="staff-title text-center my-4 text-primary fs-2 fw-bold">Reporteria</h1>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Body>
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
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Body>
                                <div className="table-responsive">
                                    <table className="table table-bordered">

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
                            </Card.Body>
                            <Pagination />
                        </Card>



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
                    <div className="grafics-content">
                        <Card>
                            <Card.Body>

                                <div className="mb-4">
                                    <h3 className="text-center">Ventas Totales: <span className="value">${totalSales.toFixed(2)}</span></h3>
                                    <Chart
                                        options={lineOptions}
                                        series={lineSeries}
                                        type="line"
                                        height={300}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-center">Mayor Vendedor: <span className="value">{topSeller}</span></h3>
                                    <Chart
                                        options={donutOptions}
                                        series={donutSeries}
                                        type="donut"
                                        height={350}
                                    />
                                </div>
                                <div className="best-month-section text-center p-4 bg-light rounded">
                                    <h3 className="text-primary mb-3">
                                        <i className="bi bi-calendar-check me-2"></i> {/* Ícono de calendario */}
                                        Mes más vendido: <strong>{topMonth}</strong>
                                    </h3>
                                    <h2 className="text-success display-6">
                                        Total: <strong>${salesByMonth[topMonth] ? salesByMonth[topMonth].toFixed(2) : "0.00"}</strong>
                                    </h2>
                                </div>
                            </Card.Body>

                        </Card>

                    </div>
                </div>
            </div>
        </div >
    );
};

export default Reports;