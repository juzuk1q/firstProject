import React from 'react';
import { useLocation, Link } from 'react-router-dom';

// Страница подтверждения отправки с чтением state
const ContactSuccess = () => {
  const location = useLocation();
  const { message, formData } = location.state || {};

  return (
    <div className="page success-page">
      <h2>Успех!</h2>

      {message ? (
        <div className="success-banner">
          <p className="success-text">{message}</p>

          {formData && (
            <div className="summary-card">
              <h4>Отправленные данные:</h4>
              <p><strong>Имя:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Тема:</strong> {formData.subject}</p>
              <p><strong>Сообщение:</strong> {formData.message}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Нет данных для отображения</p>
      )}

      <div className="nav-links-block">
        <Link to="/contact" className="btn-link">← Отправить ещё одно сообщение</Link>
        <Link to="/" className="btn-link">На главную</Link>
      </div>
    </div>
  );
};

export default ContactSuccess;
