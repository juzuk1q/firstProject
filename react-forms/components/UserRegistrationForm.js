import React, { useState } from 'react';

/**
 * Задание 1: Создание базовой формы регистрации пользователя
 * Используются управляемые компоненты (controlled components).
 */
function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    newsletter: false,
    age: '',
    bio: ''
  });

  const [submittedData, setSubmittedData] = useState(null);

  // Универсальный обработчик изменений для всех полей ввода
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData);
    console.log('Данные формы отправлены:', formData);
    alert(`Регистрация успешна!\nИмя: ${formData.name}\nEmail: ${formData.email}`);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
      newsletter: false,
      age: '',
      bio: ''
    });
    setSubmittedData(null);
  };

  return (
    <div className="form-card" style={{ maxWidth: '500px', margin: '20px auto', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>
        Задание 1: Базовая форма регистрации
      </h3>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
        Все поля управляются через локальное состояние React (управляемые компоненты).
      </p>

      <form onSubmit={handleSubmit}>
        {/* Имя */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Имя:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите ваше имя"
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@domain.com"
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          />
        </div>

        {/* Пароль */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Пароль:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          />
        </div>

        {/* Подтверждение пароля */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Подтверждение пароля:
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Повторите пароль"
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          />
        </div>

        {/* Пол (radio buttons) */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Пол:
          </label>
          <label style={{ marginRight: '16px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleChange}
            /> Мужской
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleChange}
            /> Женский
          </label>
        </div>

        {/* Возраст (select) */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Возраст:
          </label>
          <select
            name="age"
            value={formData.age}
            onChange={handleChange}
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          >
            <option value="">-- Выберите возраст --</option>
            <option value="18-24">18-24 года</option>
            <option value="25-34">25-34 года</option>
            <option value="35-44">35-44 года</option>
            <option value="45+">45 лет и старше</option>
          </select>
        </div>

        {/* Подписка на рассылку (checkbox) */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
            />
            Подписаться на новостную рассылку
          </label>
        </div>

        {/* О себе (textarea) */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            О себе:
          </label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Расскажите немного о себе..."
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', resize: 'vertical' }}
          />
        </div>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{ flex: 1, padding: '10px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Зарегистрироваться
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{ padding: '10px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
          >
            Сброс
          </button>
        </div>
      </form>

      {/* Превью отправленных данных */}
      {submittedData && (
        <div style={{ marginTop: '20px', padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#16a34a' }}>✅ Данные успешно зафиксированы в State:</h4>
          <pre style={{ margin: 0, fontSize: '12px', overflowX: 'auto' }}>
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default UserRegistrationForm;
