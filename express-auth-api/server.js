require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth');
app.use('/api/user', authRoutes);

const swaggerDocument = YAML.load('./api-doc.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log('Configuración de la base de datos:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});
console.log('JWT Secret:', process.env.JWT_SECRET);


const mysql = require('mysql2/promise');

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('Conexión exitosa a la base de datos');
        await connection.end();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
    }
})();
