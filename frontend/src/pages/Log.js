import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import AdminSideMenu from '../components/SideMenuAdmin';
import '../styles/Log.css';
import axios from 'axios';
import Swal from 'sweetalert2';

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

    // Aplicar filtros
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

    // Calcular los datos paginados
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Componente de paginación
    const Pagination = () => {
        const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

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
        <div className="log-layout">
            <div className="log-sidebar">
                <AdminSideMenu />
            </div>

            <div className="log-main">
                <div className="log-content">
                    <div className="log-header">
                        <Card className="mb-4">
                            <Card.Body>
                                <h1 className="staff-title text-center my-4 text-primary fs-2 fw-bold">Bitácora</h1>
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

                                    {/* Botón para limpiar filtros */}
                                    <Col className="d-flex align-items-end">
                                        <Button
                                            variant="secondary"
                                            onClick={clearFilters}
                                        >
                                            Limpiar Filtros
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
                                                <th>Módulo</th>
                                                <th>Acción</th>
                                                <th>Detalle</th>
                                                <th>Usuario</th>
                                                <th>Fecha</th>
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
                                                        <td>{users[log.usuario_id] || 'Usuario no encontrado'}</td>
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