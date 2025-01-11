const pool = require('../config/database.js')
const bcrypt = require('bcryptjs');

// Crear un nuevo usuario
async function createUser(cedula, password, fullname, role = 'user') {
    if (!cedula || !password || !fullname) {
        throw new Error('Todos los campos (Cedula, Password, Nombre Completo) son requeridos');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await pool.query(
            'INSERT INTO usuarios (cedula,  password, full_name, role) VALUES ($1, $2, $3, $4 ) RETURNING id, cedula, full_name, role',
            [cedula, hashedPassword, fullname, role]
        );
        return newUser.rows[0];
    } catch (error) {
        console.error('Error creando el usuario:', error);
        throw new Error('Error en la base de datos durante la creación del usuario');
    }
}

// Encontrar un usuario por nombre de usuario y contraseña
async function findUser(cedula, password) {
    if (!cedula || !password) {
        throw new Error('Both cedula and password are required');
    }

    try {
        const result = await pool.query(
            'SELECT id, cedula, password, role, full_name FROM usuarios WHERE cedula = $1',
            [cedula]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
                return {
                    id: user.id,
                    cedula: user.cedula,
                    role: user.role,
                    fullname: user.full_name
                };
            }
        }
        return null;
    } catch (error) {
        console.error('Error finding user:', error);
        throw new Error('Database error during user search');
    }
}

// Obtener todos los usuarios
async function getAllUsers() {
    try {
        const result = await pool.query('SELECT id, cedula, full_name, role, active FROM usuarios');
        console.log('Users retrieved from database:', result.rows); // Depuración
        return result.rows;
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw new Error('Database error during users retrieval');
    }
}

// Actualizar un usuario
async function updateUser(id, cedula, password, fullname, role, active) {
    // Validar campos obligatorios
    if (!id || !cedula || !fullname || !role || active === undefined) {
        throw new Error('ID, cedula, fullname, role y active son requeridos');
    }

    let queryParams = [cedula, fullname, role, active, id];
    let updateQuery = `
        UPDATE usuarios
        SET cedula = $1, full_name = $2, role = $3, active = $4`;

    // Si se proporciona una contraseña, incluirla en la consulta
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateQuery += `, password = $5`;
        queryParams = [cedula, fullname, role, active, hashedPassword, id];
    }

    // Finalizar la consulta
    updateQuery += ` WHERE id = $${queryParams.length} RETURNING id, cedula, full_name, role, active`;

    try {
        const result = await pool.query(updateQuery, queryParams);
        if (result.rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error actualizando el usuario:', error);
        throw new Error('Error en la base de datos durante la actualización del usuario');
    }
}
// Borrar un usuario
async function deleteUser(id) {
    try {
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        return { message: 'User deleted successfully' };
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Database error during user deletion');
    }
}

async function createUserAdmin(cedula, password, fullname, role) {
    if (!cedula || !password || !fullname || !role) {
        throw new Error('Todos los campos (Cedula, Password, Nombre Completo, Rol) son requeridos');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await pool.query(
            'INSERT INTO usuarios (cedula,  password, full_name, role) VALUES ($1, $2, $3, $4 ) RETURNING id, cedula, full_name, role',
            [cedula, hashedPassword, fullname, role]
        );
        return newUser.rows[0];
    } catch (error) {
        console.error('Error creando el usuario:', error);
        throw new Error('Error en la base de datos durante la creación del usuario');
    }
}


module.exports = {
    createUser,
    findUser,
    getAllUsers,
    updateUser,
    deleteUser,
    createUserAdmin
};
