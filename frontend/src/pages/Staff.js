import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import AdminSideMenu from '../components/SideMenuAdmin';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
import '../styles/Staff.css';
import axios from 'axios';
const Staff = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({
        cedula: '',
        password: '',
        full_name: '',
        role: 'user',
    });
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        role: '',
    });


    //Estados y constantes para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 10;


    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/api/usuarios/personal');
            setEmployees(response.data);
            setFilteredEmployees(response.data);
        } catch (error) {
            console.error('Error al obtener los empleados:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los empleados. Inténtalo de nuevo más tarde.',
            });
        }
    };
    const applyFilters = useCallback(() => {
        let filtered = employees;

        if (filters.search) {
            filtered = filtered.filter(emp =>
                emp.cedula.includes(filters.search) ||
                emp.full_name.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        if (filters.status) {
            filtered = filtered.filter(emp =>
                filters.status === 'active' ? emp.active : !emp.active
            );
        }

        if (filters.role) {
            filtered = filtered.filter(emp => emp.role === filters.role);
        }

        setFilteredEmployees(filtered);

        // Cada vez que filtramos, reseteamos la página actual a la 1
        setCurrentPage(1);
    }, [employees, filters]);

    // Aplicar filtros cuando cambien
    useEffect(() => {
        applyFilters();
    }, [applyFilters]);


    // Función para abrir el modal de edición
    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEmployee(null);
    };

    // Función para manejar el envío del formulario de edición
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`api/usuarios/personal/${selectedEmployee.id}`, {
                cedula: selectedEmployee.cedula,
                fullname: selectedEmployee.full_name,
                role: selectedEmployee.role,
                active: selectedEmployee.active,
                password: selectedEmployee.password,
            });

            // Mostrar mensaje de éxito
            Swal.fire('¡Actualizado!', 'El usuario ha sido actualizado exitosamente.', 'success');
            await logAction('Personal', 'Editar Usuario', `Se editó el usuario ${selectedEmployee.full_name}`, localStorage.getItem('userId'));
            // Actualizar la lista de empleados y cerrar el modal
            fetchEmployees();
            handleCloseModal();
        } catch (error) {
            // Manejar errores
            if (error.response) {
                Swal.fire('Error', `Error ${error.response.status}: ${error.response.data.message || 'No se pudo actualizar el usuario.'}`, 'error');
            } else if (error.request) {
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            } else {
                Swal.fire('Error', `Error: ${error.message}`, 'error');
            }
        }
    };

    // Función para manejar la eliminación de un usuario
    const handleDelete = (userId) => {
        const employee = employees.find(emp => emp.id === userId);

        if (!employee) {
            Swal.fire('Error', 'No se encontró el empleado.', 'error');
            return;
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: `¡No podrás revertir la eliminación de ${employee.full_name}!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(userId, employee.full_name);
            }
        });
    };

    const deleteUser = async (userId, fullName) => {
        try {
            await axios.delete(`api/usuarios/personal/${userId}`);

            Swal.fire('¡Eliminado!', `El usuario ${fullName} ha sido eliminado.`, 'success');

            await logAction('Personal', 'Eliminar Usuario', `Se eliminó el usuario ${fullName} (ID: ${userId})`, localStorage.getItem('userId'));

            fetchEmployees();
        } catch (error) {
            // Manejar errores
            if (error.response) {
                Swal.fire('Error', `Error ${error.response.status}: ${error.response.data.message || 'No se pudo eliminar el usuario.'}`, 'error');
            } else if (error.request) {
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            } else {
                Swal.fire('Error', `Error: ${error.message}`, 'error');
            }
        }
    };
    // Función para manejar el cambio en los campos del formulario de creación
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee({
            ...newEmployee,
            [name]: value,
        });
    };

    const handleCreateEmployee = async (e) => {
        e.preventDefault();
        const { cedula, password, full_name, role } = newEmployee;

        // Validar campos obligatorios
        if (!cedula || !password || !full_name || !role) {
            Swal.fire('Error', 'Todos los campos son requeridos.', 'error');
            return;
        }

        try {
            await axios.post('api/usuarios/personal/registerAdmin', {
                cedula,
                password,
                full_name,
                role,
            });

            // Mostrar mensaje de éxito
            Swal.fire('¡Creado!', 'El usuario ha sido creado exitosamente.', 'success');
            await logAction('Personal', 'Crear Usuario', `Se creó el usuario ${full_name}`, localStorage.getItem('userId'));
            // Actualizar la lista de empleados y limpiar el formulario
            fetchEmployees();
            setNewEmployee({ cedula: '', password: '', full_name: '', role: 'user' });
            setShowModal(false);
        } catch (error) {
            // Manejar errores
            if (error.response) {
                Swal.fire('Error', `Error ${error.response.status}: ${error.response.data.message || 'No se pudo crear el usuario.'}`, 'error');
            } else if (error.request) {
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            } else {
                Swal.fire('Error', `Error: ${error.message}`, 'error');
            }
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };
    // Obtener los datos al cargar el componente
    useEffect(() => {
        fetchEmployees();
    }, []);



    //  Cálculo de paginación
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);


    function limitCharacters(input, maxLength) {
        if (input.length > maxLength) {
            return input.slice(0, maxLength);
        }
        return input;
    }
    // Bitacora acciones personal
    const logAction = async (modulo, accion, detalle, usuario_id) => {
        try {
            await axios.post('/api/bitacora/crear-bitacora', {
                modulo,
                accion,
                detalle,
                usuario_id
            });
        } catch (error) {
            console.error('Error al enviar la bitácora:', error);
        }
    };
    return (
        <div className="staff-page">
            {/* Sidebar */}
            <div className="sidebar">
                <AdminSideMenu />
            </div>

            {/* Contenido principal */}
            <div className="staff-container header">
                <Card className="mb-4">
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col>
                                <h1 className="staff-title text-center my-4 text-primary fs-2 fw-bold">Administración Empleados</h1>
                            </Col>
                            <Col className="text-end">
                                <Button variant="primary" onClick={() => setShowModal(true)}>
                                    Crear Empleado
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Contenedor Mid con los contenedores de datos en fila */}
                <Row className="mb-4">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-secondary">Total Empleados</Card.Title>
                                <Card.Text className="text-primary fs-4 fw-bold">{employees.length}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-secondary">Empleados Activos</Card.Title>
                                <Card.Text className="text-primary fs-4 fw-bold">{employees.filter(emp => emp.active).length}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-secondary">Empleados Inactivos</Card.Title>
                                <Card.Text className="text-primary fs-4 fw-bold">{employees.filter(emp => !emp.active).length}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Sección de Filtros */}
                <Card className="mb-4">
                    <Card.Body>
                        <Row>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="search"
                                    placeholder="Buscar..."
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                />
                            </Col>
                            <Col>
                                <Form.Select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Estado</option>
                                    <option value="active">Activo</option>
                                    <option value="inactive">Inactivo</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <Form.Select
                                    name="role"
                                    value={filters.role}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Rol</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Tabla de empleados */}
                <Card>
                    <Card.Body>
                        <div className="table-responsive">
                            <table className="table table-bordered">

                                <thead>
                                    <tr>
                                        <th>Cédula</th>
                                        <th>Nombre Completo</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEmployees.map((employee) => (
                                        <tr key={employee.id}>
                                            <td>{employee.cedula}</td>
                                            <td>{employee.full_name}</td>
                                            <td>
                                                <span className={`badge fs-6 p-2 ${employee.role === 'admin'
                                                    ? 'bg-primary bg-opacity-10 text-primary border border-primary'
                                                    : 'bg-secondary bg-opacity-10 text-secondary border border-secondary'
                                                    }`}>
                                                    {employee.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge fs-6 p-2 ${employee.active
                                                    ? 'bg-success bg-opacity-10 text-success border border-success'
                                                    : 'bg-danger bg-opacity-10 text-danger border border-danger'
                                                    }`}>
                                                    {employee.active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => handleEdit(employee)}>
                                                    Editar
                                                </Button>{' '}
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(employee.id)}>
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>

                {/*Bloque de paginación */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center align-items-center mt-3">
                        {/* Botón Anterior */}
                        <Button
                            variant="outline-primary"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="me-2"
                        >
                            Anterior
                        </Button>

                        {/* Página Actual */}
                        <span className="fw-bold mx-3">
                            Página {currentPage} de {totalPages}
                        </span>

                        {/* Botón Siguiente */}
                        <Button
                            variant="outline-primary"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="ms-2"
                        >
                            Siguiente
                        </Button>
                    </div>
                )}

            </div>

            {/* Modal de creación/edición */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedEmployee ? 'Editar Empleado' : 'Crear Empleado'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={selectedEmployee ? handleSaveChanges : handleCreateEmployee}>
                        <Form.Group className="mb-3">
                            <Form.Label>Cédula</Form.Label>
                            <Form.Control
                                type="number"
                                name="cedula"
                                value={selectedEmployee ? selectedEmployee.cedula : newEmployee.cedula}
                                onChange={selectedEmployee
                                    ? (e) =>
                                        setSelectedEmployee({
                                            ...selectedEmployee,
                                            cedula: limitCharacters(e.target.value, 10), // Aplicar límite
                                        })
                                    : (e) =>
                                        setNewEmployee({
                                            ...newEmployee,
                                            cedula: limitCharacters(e.target.value, 10), // Aplicar límite
                                        })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={selectedEmployee ? selectedEmployee.password || '' : newEmployee.password}
                                onChange={selectedEmployee
                                    ? (e) => setSelectedEmployee({ ...selectedEmployee, password: e.target.value })
                                    : handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control
                                type="text"
                                name="full_name"
                                value={selectedEmployee ? selectedEmployee.full_name.toUpperCase() : newEmployee.full_name.toUpperCase()}
                                onChange={selectedEmployee ? (e) => setSelectedEmployee({ ...selectedEmployee, full_name: e.target.value }) : handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select
                                name="role"
                                value={selectedEmployee ? selectedEmployee.role : newEmployee.role}
                                onChange={selectedEmployee ? (e) => setSelectedEmployee({ ...selectedEmployee, role: e.target.value }) : handleInputChange}
                                required
                            >
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </Form.Select>
                        </Form.Group>
                        {selectedEmployee && (
                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    value={selectedEmployee.active ? 'active' : 'inactive'}
                                    onChange={(e) =>
                                        setSelectedEmployee({
                                            ...selectedEmployee,
                                            active: e.target.value === 'active',
                                        })
                                    }
                                >
                                    <option value="active">Activo</option>
                                    <option value="inactive">Inactivo</option>
                                </Form.Select>
                            </Form.Group>
                        )}
                        <Button variant="primary" type="submit">
                            {selectedEmployee ? 'Guardar Cambios' : 'Crear Empleado'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Staff;
