import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Форма обратной связи с программной навигацией
const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'general'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/contact/success', {
      state: {
        message: 'Ваше сообщение успешно отправлено!',
        formData
      }
    });
  };

  return (
    <div className="page contact-page">
      <h2>Свяжитесь с нами</h2>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="contact-name">Имя:</label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-email">Email:</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-subject">Тема:</label>
          <select
            id="contact-subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          >
            <option value="general">Общий вопрос</option>
            <option value="support">Техническая поддержка</option>
            <option value="sales">Вопросы по продажам</option>
            <option value="feedback">Обратная связь</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="contact-message">Сообщение:</label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
          />
        </div>

        <button type="submit" className="btn submit-btn">Отправить сообщение</button>
      </form>
    </div>
  );
};

export default Contact;
