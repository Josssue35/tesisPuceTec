import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import AdminSideMenu from '../components/SideMenuAdmin';
import '../styles/Log.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Log = () => {
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState({});
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        modulo: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Estados para el ordenamiento
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    // Obtener los datos de la bitácora
    const fetchLog = async () => {
        try {
            const response = await axios.get('/api/bitacora');
            setLogs(response.data);
            setFilteredLogs(response.data);
        } catch (error) {
            console.error('Error al obtener los registros de bitácora:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los registros. Inténtalo de nuevo más tarde.',
            });
        }
    };

    // Obtener los usuarios
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/usuarios/personal');
            const usersMap = response.data.reduce((map, user) => {
                map[user.id] = user.full_name;
                return map;
            }, {});
            setUsers(usersMap);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los usuarios. Inténtalo de nuevo más tarde.',
            });
        }
    };

    // Formatear la fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    };

    // Manejar cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
        setCurrentPage(1);
    };

    // Limpiar filtros
    const clearFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            modulo: '',
        });
        setFilteredLogs(logs);
        setCurrentPage(1);
    };

    // Función para manejar sort al hacer click en el encabezado de columna
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    // Filtrar logs al cambiar la data o los filtros
    useEffect(() => {
        const filteredData = logs.filter((log) => {
            const logDate = new Date(log.fecha);

            const startDate = filters.startDate
                ? new Date(filters.startDate + 'T00:00:00')
                : null;

            const endDate = filters.endDate
                ? new Date(filters.endDate + 'T23:59:59')
                : null;

            // Filtrar por fecha
            const isDateInRange =
                (!startDate || logDate >= startDate) &&
                (!endDate || logDate <= endDate);

            // Filtrar por módulo
            const isModuleMatch =
                !filters.modulo || log.modulo === filters.modulo;

            return isDateInRange && isModuleMatch;
        });

        setFilteredLogs(filteredData);
    }, [logs, filters]);

    // Cargar los datos al montar el componente
    useEffect(() => {
        const loadData = async () => {
            await fetchUsers();
            await fetchLog();
            setLoading(false);
        };
        loadData();
    }, []);

    // Ordenar logs
    const getSortedLogs = () => {
        const sorted = [...filteredLogs];
        if (sortColumn !== null) {
            sorted.sort((a, b) => {
                if (sortColumn === 'fecha') {
                    const dateA = new Date(a.fecha);
                    const dateB = new Date(b.fecha);
                    if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1;
                    if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                } else {
                    const valueA = a[sortColumn]?.toString().toLowerCase() || '';
                    const valueB = b[sortColumn]?.toString().toLowerCase() || '';
                    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
                    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                }
            });
        }
        return sorted;
    };
    const now = new Date();
    const formattedDate = now.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).replace(',', '');

    const safeFileName = formattedDate.replace(/\//g, '-').replace(/:/g, '-');

    // Logs ordenados
    const sortedLogs = getSortedLogs();

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedLogs.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const Pagination = () => {
        const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
        return (
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            className="page-link"
                            disabled={currentPage === 1}
                        >
                            Atrás
                        </button>
                    </li>
                    <li className="page-item active">
                        <span className="page-link">
                            Página {currentPage} de {totalPages}
                        </span>
                    </li>
                    <li
                        className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                    >
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

    // Renderizado de íconos de orden en el header
    const renderSortIcon = (column) => {
        if (column !== sortColumn) {
            return (
                <span className="ms-2">
                    <i className="bi bi-caret-up text-muted" />
                    <i className="bi bi-caret-down text-muted" />
                </span>
            );
        }

        if (sortDirection === 'asc') {
            return (
                <span className="ms-2">
                    <i className="bi bi-caret-up text-primary" />
                    <i className="bi bi-caret-down text-muted" />
                </span>
            );
        }
        return (
            <span className="ms-2">
                <i className="bi bi-caret-up text-muted" />
                <i className="bi bi-caret-down text-primary" />
            </span>
        );
    };

    // 4. Función para exportar a Excel usando xlsx y file-saver
    const handleExportExcel = () => {
        const dataToExport = getSortedLogs();

        // Construimos las filas con las columnas que queremos
        const exportData = dataToExport.map((log) => ({
            'Módulo': log.modulo,
            'Acción': log.accion,
            'Detalle': log.detalle,
            'Usuario': users[log.usuario_id] || 'Usuario no encontrado',
            'Fecha': formatDate(log.fecha),
        }));

        // Creamos la hoja de cálculo (worksheet) a partir de los datos
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Creamos el libro (workbook) y añadimos la hoja
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Bitácora');

        // Generamos el archivo Excel en binario
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        // Lo convertimos a Blob para poder descargarlo
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        // Guardamos el archivo con FileSaver
        saveAs(data, `Bitácora${safeFileName}.xlsx`);

    };

    return (
        <div className="log-layout">
            <div className="log-sidebar">
                <AdminSideMenu />
            </div>

            <div className="log-main">
                <div className="log-content">
                    <div className="log-header">
                        <Card className="mb-4">
                            <Card.Body>
                                <h1 className="staff-title text-center my-4 text-primary fs-2 fw-bold">
                                    Bitácora
                                </h1>
                            </Card.Body>
                        </Card>

                        <Card className="mb-4">
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="startDate">
                                            <Form.Label>Desde</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="startDate"
                                                value={filters.startDate}
                                                onChange={handleFilterChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="endDate">
                                            <Form.Label>Hasta</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="endDate"
                                                value={filters.endDate}
                                                onChange={handleFilterChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group controlId="modulo">
                                            <Form.Label>Módulo</Form.Label>
                                            <Form.Select
                                                name="modulo"
                                                value={filters.modulo}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">Todos</option>
                                                <option value="Inventario">Inventario</option>
                                                <option value="Personal">Personal</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    {/* Botones: Limpiar Filtros y Exportar Excel */}
                                    <Col className="d-flex align-items-end">
                                        <Button
                                            className=""
                                            variant="secondary"
                                            onClick={clearFilters}
                                        >
                                            Limpiar Filtros
                                        </Button>
                                        <Button
                                            variant="success"
                                            onClick={handleExportExcel}
                                        >
                                            Exportar Excel
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Body>
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleSort('modulo')}
                                                >
                                                    Módulo
                                                    {renderSortIcon('modulo')}
                                                </th>
                                                <th
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleSort('accion')}
                                                >
                                                    Acción
                                                    {renderSortIcon('accion')}
                                                </th>
                                                <th
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleSort('detalle')}
                                                >
                                                    Detalle
                                                    {renderSortIcon('detalle')}
                                                </th>
                                                <th>Usuario</th>
                                                <th
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleSort('fecha')}
                                                >
                                                    Fecha
                                                    {renderSortIcon('fecha')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        Cargando...
                                                    </td>
                                                </tr>
                                            ) : currentItems.length > 0 ? (
                                                currentItems.map((log) => (
                                                    <tr key={log.id}>
                                                        <td>{log.modulo}</td>
                                                        <td>{log.accion}</td>
                                                        <td>{log.detalle}</td>
                                                        <td>
                                                            {users[log.usuario_id] ||
                                                                'Usuario no encontrado'}
                                                        </td>
                                                        <td>{formatDate(log.fecha)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        No hay registros para mostrar.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Mostrar la paginación */}
                                <Pagination />
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Log;
