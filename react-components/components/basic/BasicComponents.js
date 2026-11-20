import React, { useState } from 'react';

// ЗАДАНИЕ 1: Функциональный компонент с props

// 1.1. Создайте компонент WelcomeMessage, который принимает props name и age
// и отображает приветственное сообщение
export function WelcomeMessage({ name = 'Гость', age = 18 }) {
  return (
    <div className="welcome-message">
      👋 Добро пожаловать, <strong>{name}</strong>! Ваш возраст: <strong>{age}</strong> лет.
    </div>
  );
}

// 1.2. Создайте компонент UserCard, который отображает карточку пользователя
// Принимает props: user { name, email, avatar, isOnline }
export function UserCard({ user }) {
  if (!user) return <div className="user-card-item">Данные пользователя не переданы</div>;

  const {
    name = 'Аноним',
    email = 'no-email@example.com',
    avatar = 'https://i.pravatar.cc/100',
    isOnline = false
  } = user;

  return (
    <div className="user-card-item">
      <img src={avatar} alt={name} className="user-avatar" />
      <div className="user-info">
        <h4>{name}</h4>
        <p>✉️ {email}</p>
        <span className={`user-status ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? '🟢 Онлайн' : '⚪ Не в сети'}
        </span>
      </div>
    </div>
  );
}

// 1.3. Создайте компонент Button с кастомными props
// Принимает: variant ('primary', 'secondary'), size, onClick, children
export function Button({ variant = 'primary', size = 'medium', onClick, children }) {
  const sizeStyles = {
    small: { padding: '0.4rem 0.8rem', fontSize: '0.85rem' },
    medium: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    large: { padding: '1rem 2rem', fontSize: '1.2rem' }
  };

  const style = sizeStyles[size] || sizeStyles.medium;
  const className = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';

  return (
    <button className={className} style={style} onClick={onClick}>
      {children}
    </button>
  );
}

// ЗАДАНИЕ 2: Работа с children и условный рендеринг

// 2.1. Создайте компонент Card, который принимает title и children
// и отображает их в стилизованной карточке
export function Card({ title, children }) {
  return (
    <div className="card-box">
      {title && <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>{title}</h4>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// 2.2. Создайте компонент Toggle, который показывает/скрывает children
// по клику на кнопку
export function Toggle({ buttonText = 'Показать/скрыть', children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ margin: '0.5rem 0' }}>
      <button onClick={() => setIsVisible(prev => !prev)}>
        {buttonText} {isVisible ? '▲' : '▼'}
      </button>
      {isVisible && (
        <div className="fade-in" style={{ padding: '0.5rem 0' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// 2.3. Создайте компонент ConditionalMessage, который показывает разное сообщение
// в зависимости от переданного статуса ('success', 'error', 'warning')
export function ConditionalMessage({ status = 'success' }) {
  const statusConfig = {
    success: { className: 'msg-success', text: '✅ Операция выполнена успешно!' },
    error: { className: 'msg-error', text: '❌ Произошла непредвиденная ошибка.' },
    warning: { className: 'msg-warning', text: '⚠️ Обратите внимание: требуется проверка.' }
  };

  const config = statusConfig[status] || statusConfig.success;

  return (
    <div className={config.className}>
      {config.text}
    </div>
  );
}

// Основной компонент раздела
function BasicComponents() {
  const userData = {
    name: "Анна Иванова",
    email: "anna@example.com",
    avatar: "https://i.pravatar.cc/100",
    isOnline: true
  };

  return (
    <section className="task-section">
      <h2>Базовые компоненты</h2>

      <div className="component-demo">
        <h3>Задание 1: Компоненты с props</h3>
        <div id="basic-output-1" className="output">
          <WelcomeMessage name="Иван" age={25} />
          <UserCard user={userData} />
          <Button variant="primary" onClick={() => alert('Клик!')}>Нажми меня</Button>
        </div>
      </div>

      <div className="component-demo">
        <h3>Задание 2: Children и условный рендеринг</h3>
        <div id="basic-output-2" className="output">
          <Card title="Пример карточки">
            <p>Это содержимое карточки, переданное через props.children</p>
          </Card>

          <Toggle buttonText="Показать/скрыть">
            <p style={{ background: '#e0f2fe', padding: '0.5rem', borderRadius: '4px' }}>
              🔒 Секретный контент, доступный только после открытия!
            </p>
          </Toggle>

          <ConditionalMessage status="success" />
        </div>
      </div>
    </section>
  );
}

export default BasicComponents;
