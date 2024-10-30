import pkg from 'pg'; // Importa el paquete 'pg' completo
const { Pool } = pkg; // Extrae 'Pool' del paquete importado
require('dotenv').config();

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'pbrasamayte',
  password: '123',
  port: 5432,
});

module.exports = pool;
