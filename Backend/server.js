const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Base de datos
const db = require('./src/database/db');
db();

const app = express();

// Middleware
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000',
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true,
}));

// Rutas
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/album', require('./src/routes/albumRoutes'));

// Manejo de errores
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: 'Error en el servidor', error: err.messaje });
});

const PORT = process.env.PORT || 5003

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}` ))
