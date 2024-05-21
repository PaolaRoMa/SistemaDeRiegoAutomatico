const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const morgan = require('morgan'); // Importa el middleware de registro morgan
const session = require('express-session');
const SerialPort = require('serialport').SerialPort;

// Configura el puerto serie para comunicarse con el Arduino
//const arduinoPort = new serialport('COM3', { baudRate: 9600 });


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));


// Middleware de registro morgan
app.use(morgan('dev')); // Registra las solicitudes HTTP en la consola

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MiriamJal01@', // Reemplaza 'tu_contraseña' con la contraseña de tu base de datos
    database: 'datos' // Reemplaza 'nombre_de_tu_base_de_datos' con el nombre de tu base de datos
});

app.use(session({
    secret: 'secreto', // Clave secreta para firmar la cookie de sesión
    resave: false,
    saveUninitialized: false
}));

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Ruta de manejo para la ruta raíz "/"
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath);
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Verificar si email y password están presentes y no son cadenas vacías
    if (!username || !email || !password) {
        console.error('Email o contraseña vacíos.');
        return res.status(400).send('Email y contraseña son obligatorios.');
    }

    const sql = 'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)';
    console.log('SQL:', sql); // Agregamos un registro para mostrar la consulta SQL
    console.log('Datos:', [username, email, password]); // Agregamos un registro para mostrar los datos a insertar

    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta de inserción:', err);
            return res.status(500).send('Error interno del servidor');
        }

        res.redirect('/login.html');
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Verificar las credenciales en la base de datos
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Si no se encuentra ningún usuario con las credenciales proporcionadas
        if (result.length === 0) {
            res.status(401).send('Credenciales incorrectas');
        } else {
            // Guardar el nombre de usuario en la sesión
            req.session.username = result[0].username; // Aquí asignamos el nombre de usuario a req.session.username

            // Enviar una respuesta JSON con el nombre de usuario y cualquier otra información necesaria
            res.status(200).json({ username: result[0].username });
        }
    });
});

// TODO LO DEL ARDUINO -->
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

console.log("Definiendo la ruta /regardesdejs");
// Maneja la ruta para encender el LED en la protoboard
app.get('/regardesdejs', (req, res) => {
    console.log("Recibida solicitud GET a la ruta /regardesdejs");

    // Envía el comando "REGAR" al Arduino a través del puerto serie
    arduinoPort.write('REGAR\n', (err) => {
        if (err) {
            console.error('Error al enviar el comando al Arduino:', err);
            res.status(500).send('Error al enviar el comando al Arduino');
        } else {
            console.log('Comando de riego enviado al Arduino.');
            res.send('Comando de riego enviado al Arduino.');
        }
    });
});


// TODO LO DEL ARDUINO <--
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
