const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Проверка подключения к БД
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Аутентификация врача
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM doctors WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Неверные данные' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));