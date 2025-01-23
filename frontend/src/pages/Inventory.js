import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/NavBar';
import AdminSideMenu from '../components/SideMenuAdmin';
import '../styles/Inventory.css';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";
import axios from 'axios';

const Inventory = () => {
    const [section, setSection] = useState('productos');
    const [products, setProducts] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostSoldProduct, setMostSoldProduct] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        description: '',
    });
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [itemsPerPage] = useState(10); // Elementos por página

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/producto');
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            if (error.response) {
                setError(`Error ${error.response.status}: ${error.response.data.message || 'Error al obtener los datos'}`);
            } else if (error.request) {
                setError('No se pudo conectar con el servidor');
            } else {
                setError(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchProductoTop = async () => {
        try {
            const response = await axios.get('/api/pedido/top/pedidos');
            setPedidos(response.data);
        } catch (error) {
            if (error.response) {
                setError(`Error ${error.response.status}: ${error.response.data.message || 'Error al obtener los datos'}`);
            } else if (error.request) {
                setError('No se pudo conectar con el servidor');
            } else {
                setError(`Error: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchProductoTop();
    }, []);

    const applyFilters = useCallback(() => {
        let filtered = products;

        if (filters.search) {
            filtered = filtered.filter(product =>
                product.nombre.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        if (filters.category) {
            filtered = filtered.filter(product => product.categoria_id === parseInt(filters.category));
        }

        if (filters.description) {
            filtered = filtered.filter(product => product.descripcion === filters.description);
        }

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reiniciar a la primera página al aplicar filtros
    }, [products, filters]);

    useEffect(() => {
        applyFilters();
    }, [filters, applyFilters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const categoryMap = {
        1: "Menú",
        2: "Bebidas",
        // Agrega más categorías si es necesario
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // Usar formato de 24 horas
        });
    };

    useEffect(() => {
        if (pedidos.length > 0) {
            const topProduct = pedidos.reduce((prev, current) =>
                (prev.cantidad_vendida > current.cantidad_vendida) ? prev : current
            );
            setMostSoldProduct(topProduct.producto_nombre);
        }
    }, [pedidos]);

    // Calcular los productos para la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Componente de paginación
    const Pagination = () => {
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
        <div className="inventory-layout">
            {/* Contenedor principal */}
            <div className="inventory-sidebar">
                <AdminSideMenu />
            </div>
            <div className="inventory-main">
                <Navbar onSelect={setSection} />
                <div className="inventory-content">
                    {section === 'productos' && (
                        <div className="header-inventory">
                            <Card className="mb-4">
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col>
                                            <h1 className="staff-title text-center my-4 text-primary fs-2 fw-bold">Productos Pollos A La Brasa Del Valle</h1>
                                        </Col>
                                        <Col className="text-end">
                                            <Button variant="primary">
                                                Crear Producto
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Row className="mb-4">
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title className="text-secondary">Productos Creados</Card.Title>
                                            <Card.Text className="text-primary fs-4 fw-bold">{products.length}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title className="text-secondary">Producto Mas Vendido</Card.Title>
                                            <Card.Text className="text-primary fs-4 fw-bold">{mostSoldProduct}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Card className="mb-4">
                                <Card.Body>
                                    <Row>
                                        <Col style={{ position: "relative" }}>
                                            <Form.Control
                                                type="text"
                                                name="search"
                                                placeholder="Buscar Producto..."
                                                style={{ paddingLeft: "2.5rem" }}
                                                value={filters.search}
                                                onChange={handleFilterChange}
                                            />
                                            <FaSearch
                                                style={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "20px",
                                                    transform: "translateY(-50%)",
                                                    fontSize: "18px",
                                                    color: "#6c757d",
                                                }}
                                            />
                                        </Col>

                                        <Col>
                                            <Form.Select
                                                name="category"
                                                value={filters.category}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">Categorias</option>
                                                <option value="1">Menú</option>
                                                <option value="2">Bebidas</option>
                                            </Form.Select>
                                        </Col>
                                        <Col>
                                            <Form.Select
                                                name="description"
                                                value={filters.description}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">Descripción</option>
                                                <option value="Agua">Agua</option>
                                                <option value="Gaseosa">Gaseosa</option>
                                                <option value="Tea">Tea</option>
                                                <option value="Jugo">Jugo</option>
                                                <option value="Combos personales">Combos Personales</option>
                                                <option value="Promoción">Promoción</option>
                                                <option value="Porciones">Porciones</option>
                                            </Form.Select>
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
                                                    <th>Producto</th>
                                                    <th>Descripción</th>
                                                    <th>Precio</th>
                                                    <th>Cantidad Disponible</th>
                                                    <th>Categoria</th>
                                                    <th>Fecha de Creacion</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentProducts.map(product => (
                                                    <tr key={product.id}>
                                                        <td>{product.nombre}</td>
                                                        <td>{product.descripcion}</td>
                                                        <td>{product.precio}</td>
                                                        <td>{product.cantidad_disponible}</td>
                                                        <td>{categoryMap[product.categoria_id] || "Categoría no definida"}</td>
                                                        <td>{formatDate(product.fecha_creacion)}</td>
                                                        <td>
                                                            <Button variant="warning" size="sm">Editar</Button>{' '}
                                                            <Button variant="danger" size="sm">Eliminar</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Controles de paginación */}
                                    <Pagination />
                                </Card.Body>
                            </Card>
                        </div>
                    )}

                    {section === 'inventarios' && <h1>Inventario</h1>}
                </div>
            </div>
        </div>
    );
};

export default Inventory;