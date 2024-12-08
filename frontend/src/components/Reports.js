import React, { useState } from "react";
import { Button, Form, Row, Col, Table } from "react-bootstrap";
import SideMenu from "./SideMenu"; // Importar el menú lateral
import * as XLSX from "xlsx";
import "../styles/Report.css";

const Reports = () => {
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        clientName: "",
        documentType: "",
    });

    const [data, setData] = useState([
        { id: 1, name: "Josue Garcia", total: "25,50", date: "2024-11-01" },
        { id: 2, name: "Milene Robalino", total: "50,00", date: "2024-11-05" },
    ]);

    const [filteredData, setFilteredData] = useState(data);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        const { startDate, endDate, clientName, documentType } = filters;

        const filtered = data.filter((row) => {
            const matchesStartDate = startDate ? new Date(row.date) >= new Date(startDate) : true;
            const matchesEndDate = endDate ? new Date(row.date) <= new Date(endDate) : true;
            const matchesClientName = clientName
                ? row.name.toLowerCase().includes(clientName.toLowerCase())
                : true;
            const matchesDocumentType = documentType ? row.type === documentType : true;

            return matchesStartDate && matchesEndDate && matchesClientName && matchesDocumentType;
        });

        setFilteredData(filtered);
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, "Report.xlsx");
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Menú lateral */}
                <div>
                    <SideMenu />
                </div>

                {/* Contenido principal */}
                <div className="col-md-9">
                    <h1 className="text-center my-4">Reportería</h1>

                    {/* Filtros */}
                    <div className="filters mb-4">
                        <Row>
                            <Col md={3}>
                                <Form.Group controlId="startDate">
                                    <Form.Label>Fecha Inicio</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="endDate">
                                    <Form.Label>Fecha Fin</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="clientName">
                                    <Form.Label>Nombre Cliente</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="clientName"
                                        placeholder="Enter name"
                                        value={filters.clientName}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="documentType">
                                    <Form.Label>Tipo de Documento</Form.Label>
                                    <Form.Select
                                        name="documentType"
                                        value={filters.documentType}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="Invoice">Invoice</option>
                                        <option value="Receipt">Receipt</option>
                                    </Form.Select>
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
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Total Compra</th>
                                <th>Fecha Compra</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.name}</td>
                                    <td>{row.total}</td>
                                    <td>{row.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

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