const express = require('express');
const router = express.Router();

let users = [
  { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', role: 'user' },
  { id: 2, name: 'Петр Петров', email: 'petr@example.com', role: 'admin' },
  { id: 3, name: 'Мария Сидорова', email: 'maria@example.com', role: 'user' }
];

// Проверка корректности формата числового ID
router.param('id', (req, res, next, id) => {
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Неверный формат ID' });
  }
  req.userId = userId;
  next();
});

// Получение списка пользователей с фильтрацией и поиском
router.get('/', (req, res) => {
  const { role, search } = req.query;
  let filteredUsers = users;

  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }

  if (search) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({
    data: filteredUsers,
    total: filteredUsers.length
  });
});

// Получение одного пользователя по ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.userId);

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  res.json({ data: user });
});

// Создание нового пользователя с валидацией и проверкой уникальности email
router.post('/', (req, res) => {
  const { name, email, role = 'user' } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Поля name и email обязательны' });
  }

  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
  }

  const newUser = {
    id: Math.max(...users.map(u => u.id), 0) + 1,
    name,
    email,
    role,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  res.status(201).json({
    message: 'Пользователь создан',
    data: newUser
  });
});

// Обновление пользователя по ID
router.put('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const { name, email, role } = req.body;

  if (email && users.some(u => u.email === email && u.id !== req.userId)) {
    return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
  }

  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (role) users[userIndex].role = role;
  users[userIndex].updatedAt = new Date().toISOString();

  res.json({
    message: 'Пользователь обновлен',
    data: users[userIndex]
  });
});

// Удаление пользователя по ID
router.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  res.json({
    message: 'Пользователь удален',
    data: deletedUser
  });
});

module.exports = router;
