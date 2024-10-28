const express = require('express');
const cors = require('cors');// Asegúrate de que la ruta sea correcta
const productRouter = require('./routes/producto')


const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(cors())
app.use(express.json())

app.use('/api/producto', productRouter)

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

