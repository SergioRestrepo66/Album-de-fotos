const nongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const conectarDB = async () => {
    try {
        await nongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log('Conexion a MongoDB exitosa');
    } catch (error) {
        console.error('Error al concectar con MongoDB:', error);
        process.exit(1); 
    }
}

module.exports = conectarDB;