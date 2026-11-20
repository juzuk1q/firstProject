const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let users = [
  { id: 1, name: 'Иван Иванов', email: 'ivan@example.com' },
  { id: 2, name: 'Петр Петров', email: 'petr@example.com' },
  { id: 3, name: 'Мария Сидорова', email: 'maria@example.com' }
];

// Логирование входящих HTTP-запросов
function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.socket.remoteAddress}`);
  next();
}

// Потоковое чтение и парсинг JSON тела запроса
function parseJsonBody(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        if (body) {
          req.body = JSON.parse(body);
        }
        next();
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Неверный формат JSON' }));
      }
    });
  } else {
    next();
  }
}

// Отдача статических файлов клиенту
function staticFiles(req, res, next) {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname.startsWith('/api/')) {
    next();
    return;
  }

  let filePath = parsedUrl.pathname === '/' ? '/client.html' : parsedUrl.pathname;
  filePath = path.join(__dirname, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      next();
      return;
    }

    const extname = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg'
    };

    const contentType = contentTypes[extname] || 'text/plain; charset=utf-8';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Последовательный запуск цепочки middleware
function applyMiddleware(req, res, middlewares, index = 0) {
  if (index < middlewares.length) {
    middlewares[index](req, res, () => {
      applyMiddleware(req, res, middlewares, index + 1);
    });
  }
}

// Получение списка всех пользователей
function handleGetUsers(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(users));
}

// Получение пользователя по ID
function handleGetUser(req, res, pathname) {
  const userId = parseInt(pathname.split('/')[3], 10);
  const user = users.find(u => u.id === userId);

  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Пользователь не найден' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(user));
}

// Создание пользователя на основе распарсенного req.body
function handleCreateUser(req, res) {
  if (!req.body || !req.body.name || !req.body.email) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Имя и email обязательны' }));
    return;
  }

  const user = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: req.body.name,
    email: req.body.email
  };

  users.push(user);
  res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(user));
}

// Обновление пользователя по ID
function handleUpdateUser(req, res, pathname) {
  const userId = parseInt(pathname.split('/')[3], 10);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Пользователь не найден' }));
    return;
  }

  users[userIndex] = { ...users[userIndex], ...req.body };
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(users[userIndex]));
}

// Удаление пользователя по ID
function handleDeleteUser(req, res, pathname) {
  const userId = parseInt(pathname.split('/')[3], 10);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Пользователь не найден' }));
    return;
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ message: 'Пользователь удален', user: deletedUser }));
}

// Возврат статуса сервера и системных метрик
function handleStatus(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    usersCount: users.length,
    memoryUsage: process.memoryUsage()
  }));
}

// Обработка несуществующего пути
function handleNotFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'Маршрут не найден' }));
}

// Маршрутизация входящих запросов
function handleRoutes(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (pathname === '/api/users' && method === 'GET') {
    handleGetUsers(req, res);
  } else if (pathname === '/api/users' && method === 'POST') {
    handleCreateUser(req, res);
  } else if (pathname.startsWith('/api/users/') && method === 'GET') {
    handleGetUser(req, res, pathname);
  } else if (pathname.startsWith('/api/users/') && method === 'PUT') {
    handleUpdateUser(req, res, pathname);
  } else if (pathname.startsWith('/api/users/') && method === 'DELETE') {
    handleDeleteUser(req, res, pathname);
  } else if (pathname === '/api/status' && method === 'GET') {
    handleStatus(req, res);
  } else {
    handleNotFound(req, res);
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  applyMiddleware(req, res, [
    logger,
    parseJsonBody,
    staticFiles,
    handleRoutes
  ]);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Продвинутый сервер запущен на порту ${PORT}`);
});

module.exports = server;
