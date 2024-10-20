import pkg from 'pg'; // Importa el paquete 'pg' completo
const { Pool } = pkg; // Extrae 'Pool' del paquete importado

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'pbrasamayte',
  password: '123',
  port: 5432,
});

export default pool;