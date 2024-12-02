// src/server.js
const express = require('express');
const cors = require('cors');
const productRouter = require('./routes/producto');
const pedidoRoutes = require('./routes/order');
const usersRoutes = require('./routes/usuarios')
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/producto', productRouter);
app.use('/api/pedido', pedidoRoutes);
app.use('/api/usuarios', usersRoutes)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

