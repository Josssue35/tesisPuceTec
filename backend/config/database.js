const { Pool } = require('pg');

const pool = new Pool({
  host: 'pollosvalledesa.c7cygcumg6c7.us-east-1.rds.amazonaws.com', // Cambia esto por el endpoint de RDS
  user: 'userdesa',
  password: 'Jbeat2121!',
  database: 'baseDesarrollo',  // Nombre correcto de la base de datos
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  }
});

module.exports = pool;