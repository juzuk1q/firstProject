const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Логирование входящих запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Начальная база данных книг
let books = [
  {
    id: 1,
    title: 'JavaScript для начинающих',
    author: 'Иван Иванов',
    year: 2023,
    isbn: '123-456-789',
    genre: 'Программирование',
    available: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    title: 'Чистый код',
    author: 'Роберт Мартин',
    year: 2019,
    isbn: '978-5-4461-0960-9',
    genre: 'Программирование',
    available: true,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    year: 1967,
    isbn: '978-5-17-090334-9',
    genre: 'Классика',
    available: false,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  }
];

// Получение списка книг с фильтрацией и постраничной пагинацией
app.get('/api/books', (req, res) => {
  const { author, genre, year, available, page = 1, limit = 10 } = req.query;
  let filtered = [...books];

  if (author) {
    filtered = filtered.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
  }

  if (genre) {
    filtered = filtered.filter(b => b.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if (year) {
    filtered = filtered.filter(b => b.year === parseInt(year, 10));
  }

  if (available !== undefined) {
    filtered = filtered.filter(b => b.available === (available === 'true'));
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedData = filtered.slice(startIndex, startIndex + limitNum);

  res.json({
    data: paginatedData,
    pagination: {
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filtered.length / limitNum) || 1
    }
  });
});

// Получение одной книги по ID
app.get('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Книга не найдена' });
  }

  res.json({ data: book });
});

// Создание новой книги с валидацией полей и уникальности ISBN
app.post('/api/books', (req, res) => {
  const { title, author, year, isbn, genre } = req.body;

  if (!title || !author || !year || !isbn || !genre) {
    return res.status(400).json({
      error: 'Поля title, author, year, isbn и genre обязательны'
    });
  }

  if (books.some(b => b.isbn === isbn)) {
    return res.status(409).json({
      error: 'Книга с таким ISBN уже существует'
    });
  }

  const now = new Date().toISOString();
  const newBook = {
    id: Math.max(...books.map(b => b.id), 0) + 1,
    title,
    author,
    year: parseInt(year, 10),
    isbn,
    genre,
    available: true,
    createdAt: now,
    updatedAt: now
  };

  books.push(newBook);
  res.status(201).json({
    message: 'Книга успешно создана',
    data: newBook
  });
});

// Полное обновление данных книги по ID (PUT)
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const index = books.findIndex(b => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({ error: 'Книга не найдена' });
  }

  const { title, author, year, isbn, genre, available } = req.body;

  if (!title || !author || !year || !isbn || !genre) {
    return res.status(400).json({
      error: 'При полном обновлении (PUT) все ключевые поля обязательны'
    });
  }

  if (books.some(b => b.isbn === isbn && b.id !== bookId)) {
    return res.status(409).json({
      error: 'Книга с таким ISBN уже существует'
    });
  }

  books[index] = {
    ...books[index],
    title,
    author,
    year: parseInt(year, 10),
    isbn,
    genre,
    available: available !== undefined ? Boolean(available) : books[index].available,
    updatedAt: new Date().toISOString()
  };

  res.json({
    message: 'Книга полностью обновлена',
    data: books[index]
  });
});

// Частичное обновление полей книги по ID (PATCH)
app.patch('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const index = books.findIndex(b => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({ error: 'Книга не найдена' });
  }

  const { title, author, year, isbn, genre, available } = req.body;

  if (isbn && books.some(b => b.isbn === isbn && b.id !== bookId)) {
    return res.status(409).json({
      error: 'Книга с таким ISBN уже существует'
    });
  }

  if (title !== undefined) books[index].title = title;
  if (author !== undefined) books[index].author = author;
  if (year !== undefined) books[index].year = parseInt(year, 10);
  if (isbn !== undefined) books[index].isbn = isbn;
  if (genre !== undefined) books[index].genre = genre;
  if (available !== undefined) books[index].available = Boolean(available);
  books[index].updatedAt = new Date().toISOString();

  res.json({
    message: 'Книга частично обновлена',
    data: books[index]
  });
});

// Удаление книги по ID
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const index = books.findIndex(b => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({ error: 'Книга не найдена' });
  }

  const deletedBook = books.splice(index, 1)[0];
  res.json({
    message: 'Книга успешно удалена',
    data: deletedBook
  });
});

// Обработка несуществующих маршрутов (404)
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    path: req.originalUrl
  });
});

// Централизованная обработка непредвиденных ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.stack);
  res.status(500).json({
    error: 'Внутренняя ошибка сервера',
    message: err.message
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API доступно по адресу: http://localhost:${PORT}/api/books`);
});

module.exports = app;
