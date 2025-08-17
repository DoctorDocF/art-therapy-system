require('dotenv').config({ path: './server/.env' });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Добавляем PostgreSQL клиент

const authRoutes = require('./server/routes/auth.routes');
const apiRoutes = require('./server/routes/api.routes');

const app = express();

// Настройка подключения к БД
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Обязательно для Render PostgreSQL
  }
});

// Проверка подключения к БД при старте
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('DB connection error', err));

app.use(cors());
app.use(express.json());

// Добавляем pool в запросы
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Роуты
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// После подключения роутов, но до app.listen()
app.get('/', (req, res) => {
  res.json({
    status: 'API is working',
    message: 'Welcome to ARVT Therapy System',
    endpoints: {
      auth: '/auth',
      api: '/api'
    }
  });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  Server running on port ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  Database: ${process.env.DB_HOST}
  `);
});

// Экспорт для тестов
module.exports = app;