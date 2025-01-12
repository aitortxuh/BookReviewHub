const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mysql = require('mysql2/promise');

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Registrar usuario
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();

 
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      connection.release();
      return res.status(400).send('El usuario ya existe');
    }

 
    await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    connection.release();

    res.status(201).send('Usuario registrado exitosamente');
  } catch (error) {
    console.error('Error en /register:', error.message, error.stack);
    res.status(500).send('Error interno del servidor');
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
    connection.release();

    if (rows.length === 0) {
      return res.status(401).send('Credenciales inválidas');
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send('Credenciales inválidas');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error en /login:', error.message, error.stack);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
