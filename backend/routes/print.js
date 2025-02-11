const express = require("express");
const router = express.Router();
const fs = require("fs");
const { exec } = require("child_process");

router.post("/imprimir-pedido", async (req, res) => {
    const { pedidoId, productos, totalPrice } = req.body;
    console.log("Generando ticket para impresión...");

    // Ruta del archivo temporal
    const filePath = `C:\\Users\\Jossue\\Documents\\GitHub\\tesisPuceTec\\backend\\ticket.txt`;

    // Crear el contenido del ticket alineado a la izquierda
    let contenido = `PEDIDO A COCINA\n`;
    contenido += `============================\n`;
    contenido += `NÚMERO DE ORDEN: ${pedidoId}\n`;
    contenido += `============================\n\n`;

    contenido += `PRODUCTO  CANTIDAD\n`;
    contenido += `----------------------------\n`;

    productos.forEach(({ nombre, cantidad }) => {
        // Asegurar que el nombre del producto se ajuste sin desplazarse
        let nombreFormateado = nombre.padEnd(20, " ").substring(0, 20);
        let cantidadFormateada = String(cantidad).padStart(1, " "); // Asegurar que la cantidad esté alineada
        contenido += `${nombreFormateado}-----${cantidadFormateada}\n`;
    });

    contenido += `\n============================\n`;
    contenido += `TOTAL: $${totalPrice.toFixed(2)}\n`;
    contenido += `============================\n\n`;
    contenido += `PREPARAR LO ANTES POSIBLE\n\n`;
    contenido += `\n\n\n`; // Espacios extra para corte de papel

    // Escribir en el archivo
    fs.writeFileSync(filePath, contenido, "utf-8");

    // Comando para imprimir con Notepad
    const printCommand = `notepad /p "${filePath}"`;

    // Ejecutar el comando de impresión
    exec(printCommand, (error, stdout, stderr) => {
        if (error) {
            console.error("Error al imprimir:", error);
            return res.status(500).send("Error al imprimir el ticket.");
        }
        console.log("Ticket impreso correctamente:", stdout);
        res.status(200).send("Ticket impreso correctamente.");
    });
});

module.exports = router;
