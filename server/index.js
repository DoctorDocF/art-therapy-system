require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(cors({
  origin: 'https://artsystem.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Генерация JWT токена
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Аутентификация
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT * FROM doctors WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const token = generateToken(result.rows[0].id);
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Неверные данные' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Сохранение действий
app.post('/actions', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) return res.sendStatus(403);
      
      const { action } = req.body;
      await pool.query(
        'INSERT INTO actions (doctor_id, action) VALUES ($1, $2)',
        [user.id, action]
      );
      
      res.json({ success: true });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));