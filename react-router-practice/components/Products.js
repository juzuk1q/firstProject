import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Каталог товаров с фильтрацией по категории
const Products = () => {
  const [products] = useState([
    { id: 1, name: 'Ноутбук', price: 50000, category: 'electronics' },
    { id: 2, name: 'Смартфон', price: 30000, category: 'electronics' },
    { id: 3, name: 'Книга', price: 5000, category: 'books' },
    { id: 4, name: 'Наушники', price: 4000, category: 'electronics' },
    { id: 5, name: 'Футболка', price: 1500, category: 'clothing' }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(product => product.category === filter);

  return (
    <div className="page products-page">
      <h2>Наши товары</h2>

      <div className="filter-block">
        <label htmlFor="category-filter">Фильтр по категории: </label>
        <select
          id="category-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Все</option>
          <option value="electronics">Электроника</option>
          <option value="books">Книги</option>
          <option value="clothing">Одежда</option>
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="price">Цена: {product.price} руб.</p>
            <p className="category">Категория: {product.category}</p>
            <Link to={`/products/${product.id}`} className="card-link">Подробнее</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
