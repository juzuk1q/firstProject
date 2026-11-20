const express = require('express');
const router = express.Router();

let products = [
  { id: 1, name: 'Ноутбук', price: 50000, category: 'electronics', inStock: true },
  { id: 2, name: 'Смартфон', price: 30000, category: 'electronics', inStock: true },
  { id: 3, name: 'Книга', price: 500, category: 'books', inStock: false },
  { id: 4, name: 'Наушники', price: 4000, category: 'electronics', inStock: true }
];

// Получение всех товаров с фильтрацией по категории, наличию и диапазону цен
router.get('/', (req, res) => {
  const { category, inStock, minPrice, maxPrice } = req.query;
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (inStock !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.inStock === (inStock === 'true'));
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice, 10));
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice, 10));
  }

  res.json({
    data: filteredProducts,
    total: filteredProducts.length
  });
});

// Получение одного товара по ID
router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }

  res.json({ data: product });
});

// Создание нового товара с валидацией обязательных полей
router.post('/', (req, res) => {
  const { name, price, category, inStock = true } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Поля name, price и category обязательны' });
  }

  const newProduct = {
    id: Math.max(...products.map(p => p.id), 0) + 1,
    name,
    price: parseInt(price, 10),
    category,
    inStock: Boolean(inStock),
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  res.status(201).json({
    message: 'Товар создан',
    data: newProduct
  });
});

module.exports = router;
