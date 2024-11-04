import express from 'express';
import cors from 'cors';
import productRoutes from './routes/producto.js'; // Ajusta la ruta según tu estructura de carpetas

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Usar las rutas de productos
app.use('/products', productRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
