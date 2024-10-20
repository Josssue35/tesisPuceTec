import express from 'express';
import pool from '../config/database.js'; // Asegúrate de que la ruta sea correcta

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

