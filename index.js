const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// Cors
app.use(cors());

// Directorio publico
app.use(express.static('public'));

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

// Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor funcionando en puerto ${ process.env.PORT }`)
})