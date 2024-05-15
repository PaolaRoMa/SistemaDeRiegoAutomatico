const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de manejo para la ruta raíz "/"
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath);
});

let lastHumidity = null;

app.post('/humidity', (req, res) => {
    const humedad = req.body.humidity;
    if (humedad !== null && !isNaN(parseFloat(humedad))) {
        lastHumidity = humedad; // Almacenar la última humedad recibida
        console.log('Humedad recibida:', humedad);
        // Aquí puedes realizar las acciones necesarias con los datos de humedad, como almacenarlos en una base de datos
        res.send('Datos de humedad recibidos correctamente');
    } else {
        console.log('Datos de humedad recibidos incorrectos:', humedad);
        res.status(400).send('Datos de humedad recibidos incorrectos');
    }
});


// Ruta para obtener los últimos datos de humedad
app.get('/lastHumidity', (req, res) => {
    res.json({ humidity: lastHumidity }); // Enviar los últimos datos de humedad al cliente
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
