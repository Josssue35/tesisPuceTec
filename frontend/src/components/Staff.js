import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AdminSideMenu from '../components/SideMenuAdmin';
import { Modal, Button, Form } from 'react-bootstrap';
import '../styles/Staff.css';

const Staff = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({
        cedula: '',
        password: '',
        full_name: '',
        role: 'user',
    });

    // Función para obtener los datos de la API
    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/usuarios/personal');
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

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
            const response = await fetch(`http://localhost:3000/api/usuarios/personal/${selectedEmployee.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cedula: selectedEmployee.cedula,
                    fullname: selectedEmployee.full_name,
                    role: selectedEmployee.role,
                    active: selectedEmployee.active,
                    // password: selectedEmployee.password,
                }),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }
            Swal.fire('¡Actualizado!', 'El usuario ha sido actualizado exitosamente.', 'success');
            fetchEmployees();
            handleCloseModal();

        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
        }
    };

    // Función para manejar la eliminación de un usuario
    const handleDelete = (userId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(userId);
            }
        });
    };

    // Función para eliminar un usuario
    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/personal/${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }
            Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
            fetchEmployees(); // Actualizar la lista de empleados
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
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

    // Función para manejar el envío del formulario de creación
    const handleCreateEmployee = async (e) => {
        e.preventDefault();
        const { cedula, password, full_name, role } = newEmployee;

        // Validar campos obligatorios
        if (!cedula || !password || !full_name || !role) {
            Swal.fire('Error', 'Todos los campos son requeridos.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/usuarios/personal/registerAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cedula, password, full_name, role }),
            });
            if (!response.ok) {
                throw new Error('Error al crear el usuario');
            }
            Swal.fire('¡Creado!', 'El usuario ha sido creado exitosamente.', 'success');
            fetchEmployees(); // Actualizar la lista de empleados
            setNewEmployee({ cedula: '', password: '', full_name: '', role: 'user' }); // Limpiar el formulario
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear el usuario.', 'error');
        }
    };

    // Obtener los datos al cargar el componente
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Mostrar un mensaje de carga
    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    // Mostrar un mensaje de error
    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="staff-page">
            {/* Sidebar */}
            <AdminSideMenu />

            {/* Contenido principal */}
            <div className="staff-container">
                <h1 className="staff-title">Personal</h1>
                <div className="staff-content">
                    {/* Columna izquierda: Tabla de empleados */}
                    <div className="staff-table-container">
                        <div className="table-responsive">
                            <table className="staff-table">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Cédula</th>
                                        <th>Nombre Completo</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee) => (
                                        <tr key={employee.id}>
                                            <td>{employee.cedula}</td>
                                            <td>{employee.full_name}</td>
                                            <td>
                                                <span className={`role-badge ${employee.role}`}>
                                                    {employee.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${employee.active ? 'active' : 'inactive'}`}>
                                                    {employee.active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="actions">
                                                <button className="edit-button" onClick={() => handleEdit(employee)}>
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="delete-button" onClick={() => handleDelete(employee.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Columna derecha: Formulario de creación */}
                    <div className="staff-form-container">
                        <h2>Crear Nuevo Empleado</h2>
                        <Form onSubmit={handleCreateEmployee}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cédula</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cedula"
                                    value={newEmployee.cedula}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={newEmployee.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre Completo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="full_name"
                                    value={newEmployee.full_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select
                                    name="role"
                                    value={newEmployee.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </Form.Select>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Crear Empleado
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Empleado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEmployee && (
                        <Form onSubmit={handleSaveChanges}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cédula</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedEmployee.cedula}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, cedula: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre Completo</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedEmployee.full_name}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, full_name: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select
                                    value={selectedEmployee.role}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, role: e.target.value })
                                    }
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </Form.Select>
                            </Form.Group>
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
                            <Button variant="primary" type="submit">
                                Guardar Cambios
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Staff;