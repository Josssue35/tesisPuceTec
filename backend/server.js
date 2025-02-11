const express = require('express');
const cors = require('cors');
const productRouter = require('./routes/producto');
const pedidoRoutes = require('./routes/order');
const usersRoutes = require('./routes/usuarios');
const bitacoraRouter = require('./routes/bitacora');
const print = require('./routes/print');
const path = require('path');

const app = express();
const port = 3002

// Middleware
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/producto', productRouter);
app.use('/api/pedido', pedidoRoutes);
app.use('/api/usuarios', usersRoutes);
app.use('/api/bitacora', bitacoraRouter);
app.use('/api/print', print);

// Iniciar el servidor
app.listen(port, async () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

