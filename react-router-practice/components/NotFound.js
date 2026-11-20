import React from 'react';
import { Link } from 'react-router-dom';

// Страница 404 для неопознанных маршрутов
const NotFound = () => {
  return (
    <div className="page not-found-page">
      <h2>404 - Страница не найдена</h2>
      <p>Извините, запрашиваемая страница не существует.</p>
      <Link to="/" className="btn-link">Вернуться на главную</Link>
    </div>
  );
};

export default NotFound;
