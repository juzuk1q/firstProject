import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Детальная карточка товара с получением ID из URL
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const products = {
    1: { name: 'Ноутбук', price: 50000, description: 'Мощный игровой ноутбук', category: 'electronics' },
    2: { name: 'Смартфон', price: 30000, description: 'Смартфон с отличной камерой', category: 'electronics' },
    3: { name: 'Книга', price: 5000, description: 'Интересная книга о программировании', category: 'books' },
    4: { name: 'Наушники', price: 4000, description: 'Беспроводные наушники с шумоподавлением', category: 'electronics' },
    5: { name: 'Футболка', price: 1500, description: 'Хлопковая качественная футболка', category: 'clothing' }
  };

  const product = products[id];

  if (!product) {
    return (
      <div className="page product-detail-page">
        <h2>Товар не найден</h2>
        <p>Товара с ID {id} не существует.</p>
        <button onClick={() => navigate('/products')} className="btn">Вернуться к товарам</button>
      </div>
    );
  }

  return (
    <div className="page product-detail-page">
      <button onClick={() => navigate(-1)} className="btn back-btn">Назад</button>

      <h2>{product.name}</h2>
      <div className="product-info-box">
        <p><strong>Цена:</strong> {product.price} руб.</p>
        <p><strong>Описание:</strong> {product.description}</p>
        <p><strong>Категория:</strong> {product.category}</p>
        <p><strong>ID товара:</strong> {id}</p>
      </div>

      <div className="links-block">
        <Link to="/products" className="btn-link">← К списку товаров</Link>
      </div>
    </div>
  );
};

export default ProductDetail;
