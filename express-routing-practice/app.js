const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Импорт модульных роутеров
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

// Middleware для парсинга входящего JSON
app.use(express.json());

// Middleware логирования запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Middleware для добавления базовых заголовков безопасности
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Middleware для ограничения частоты запросов (rate limiting)
const requestCounts = {};
app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 100;

  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, startTime: now };
  } else {
    if (now - requestCounts[ip].startTime > windowMs) {
      requestCounts[ip] = { count: 1, startTime: now };
    } else {
      requestCounts[ip].count++;
    }
  }

  if (requestCounts[ip].count > maxRequests) {
    return res.status(429).json({
      error: 'Слишком много запросов',
      message: 'Пожалуйста, попробуйте позже'
    });
  }

  next();
});

// Подключение роутеров
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

// Базовый маршрут с информацией о приложении
app.get('/', (req, res) => {
  res.json({
    message: 'Добро пожаловать в Express.js приложение!',
    endpoints: {
      '/api/users': 'Работа с пользователями',
      '/api/products': 'Работа с товарами',
      '/health': 'Проверка работоспособности сервиса',
      '/api/status': 'Статус сервера'
    }
  });
});

// Маршрут для проверки состояния и метрик приложения
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Маршрут статуса сервера
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Обработка несуществующих маршрутов (404)
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/status',
      'GET /api/users',
      'GET /api/users/:id',
      'POST /api/users',
      'PUT /api/users/:id',
      'DELETE /api/users/:id',
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/products'
    ]
  });
});

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Ошибка валидации',
      details: err.errors
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Конфликт данных',
      message: 'Запись с такими данными уже существует'
    });
  }

  res.status(500).json({
    error: 'Внутренняя ошибка сервера',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Что-то пошло не так'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Express сервер запущен на порту ${PORT}`);
  console.log(`Доступен по адресу: http://localhost:${PORT}`);
});

module.exports = app;
