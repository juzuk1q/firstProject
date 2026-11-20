import React, { useState } from 'react';

/**
 * Задание 2: Форма регистрации с комплексной валидацией
 * Реализована валидация всех полей, подсветка ошибок и предотвращение отправки невалидной формы.
 */
function UserRegistrationFormWithValidation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    newsletter: false,
    age: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Валидация одного конкретного поля
  const validateField = (name, value, currentFormData = formData) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Имя обязательно для заполнения';
        } else if (value.trim().length < 2) {
          error = 'Имя должно содержать не менее 2 символов';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email обязателен для заполнения';
        } else {
          // Регулярное выражение для проверки формата email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) {
            error = 'Некорректный формат email (пример: user@example.com)';
          }
        }
        break;

      case 'password':
        if (!value) {
          error = 'Пароль обязателен для заполнения';
        } else if (value.length < 8) {
          error = 'Пароль должен содержать минимум 8 символов';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Подтверждение пароля обязательно';
        } else if (value !== currentFormData.password) {
          error = 'Пароли не совпадают';
        }
        break;

      case 'gender':
        if (!value) {
          error = 'Пожалуйста, выберите пол';
        }
        break;

      case 'age':
        if (!value) {
          error = 'Возраст должен быть выбран';
        }
        break;

      case 'bio':
        if (!value.trim()) {
          error = 'Поле «О себе» обязательно для заполнения';
        } else if (value.trim().length < 10) {
          error = 'Напишите хотя бы пару слов (минимум 10 символов)';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Валидация всей формы
  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ['name', 'email', 'password', 'confirmPassword', 'gender', 'age', 'bio'];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    const updatedFormData = {
      ...formData,
      [name]: fieldValue
    };

    setFormData(updatedFormData);

    // Валидация на лету, если пользователь уже касался поля
    if (touched[name]) {
      const fieldError = validateField(name, fieldValue, updatedFormData);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError
      }));

      // Если изменился пароль, дополнительно перепроверяем confirmPassword
      if (name === 'password' && touched.confirmPassword) {
        const confirmErr = validateField('confirmPassword', formData.confirmPassword, updatedFormData);
        setErrors((prev) => ({
          ...prev,
          confirmPassword: confirmErr
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Отмечаем все поля как touched, чтобы ошибки отобразились сразу
    const allTouched = {
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      gender: true,
      age: true,
      bio: true
    };
    setTouched(allTouched);

    const isValid = validateForm();

    if (isValid) {
      setSuccessData(formData);
      console.log('Форма успешно валидирована и отправлена:', formData);
    } else {
      setSuccessData(null);
      console.warn('Ошибки валидации:', errors);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      newsletter: false,
      age: '',
      bio: ''
    });
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
    setSuccessData(null);
  };

  return (
    <div className="form-card" style={{ maxWidth: '540px', margin: '20px auto', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #10b981', paddingBottom: '8px' }}>
        Задание 2: Форма регистрации с валидацией
      </h3>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
        Проверка обязательных полей, формата email, длины пароля (≥8) и совпадения паролей.
      </p>

      {successData && (
        <div style={{ marginBottom: '20px', padding: '14px', backgroundColor: '#ecfdf5', border: '1px solid #10b981', borderRadius: '6px', color: '#065f46' }}>
          <strong>🎉 Регистрация успешно завершена!</strong>
          <div style={{ marginTop: '6px', fontSize: '13px' }}>
            Пользователь <b>{successData.name}</b> ({successData.email}) успешно зарегистрирован.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Имя */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Имя <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Иван Иванов"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 12px',
              border: `1px solid ${errors.name && touched.name ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: '6px',
              backgroundColor: errors.name && touched.name ? '#fef2f2' : '#ffffff'
            }}
          />
          {touched.name && errors.name && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>
          )}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Email <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="user@example.com"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 12px',
              border: `1px solid ${errors.email && touched.email ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: '6px',
              backgroundColor: errors.email && touched.email ? '#fef2f2' : '#ffffff'
            }}
          />
          {touched.email && errors.email && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>
          )}
        </div>

        {/* Пароль */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Пароль (мин. 8 символов) <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Минимум 8 знаков"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 12px',
              border: `1px solid ${errors.password && touched.password ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: '6px',
              backgroundColor: errors.password && touched.password ? '#fef2f2' : '#ffffff'
            }}
          />
          {touched.password && errors.password && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.password}</div>
          )}
        </div>

        {/* Подтверждение пароля */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Подтверждение пароля <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Повторите пароль"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 12px',
              border: `1px solid ${errors.confirmPassword && touched.confirmPassword ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: '6px',
              backgroundColor: errors.confirmPassword && touched.confirmPassword ? '#fef2f2' : '#ffffff'
            }}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword}</div>
          )}
        </div>

        {/* Пол */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Пол <span style={{ color: '#ef4444' }}>*</span>
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
          {touched.gender && errors.gender && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.gender}</div>
          )}
        </div>

        {/* Возраст (select) */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Возраст <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            name="age"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 12px',
              border: `1px solid ${errors.age && touched.age ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: '6px',
              backgroundColor: errors.age && touched.age ? '#fef2f2' : '#ffffff'
            }}
          >
            <option value="">-- Выберите возраст --</option>
            <option value="under18">До 18 лет</option>
            <option value="18-24">18 - 24 года</option>
            <option value="25-34">25 - 34 года</option>
            <option value="35-44">35 - 44 года</option>
            <option value="45+">45+ лет</option>
          </select>
          {touched.age && errors.age && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.age}</div>
          )}
        </div>

        {/* Подписка на рассылку (checkbox) - необязательное поле */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
            />
            Получать новости и обновления по email (необязательно)
          </label>
        </div>

        {/* О себе (textarea) */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            О себе <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Краткая информация о ваших увлечениях или профессии..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 12px',
              border: `1px solid ${errors.bio && touched.bio ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: '6px',
              backgroundColor: errors.bio && touched.bio ? '#fef2f2' : '#ffffff',
              resize: 'vertical'
            }}
          />
          {touched.bio && errors.bio && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.bio}</div>
          )}
        </div>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '10px 16px',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Отправить с проверкой
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '10px 16px',
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Сброс
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserRegistrationFormWithValidation;
