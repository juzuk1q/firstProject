import React, { useRef, useState } from 'react';

/**
 * Задание 3: Форма обратной связи на неуправляемых компонентах (Uncontrolled Components)
 * Значения полей формы контролируются напрямую DOM-узлами через хук useRef,
 * а не состоянием React (useState).
 */
function ContactFormUncontrolled() {
  const formRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const topicRef = useRef(null);
  const messageRef = useRef(null);
  const subscribeRef = useRef(null);

  const [feedback, setFeedback] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFeedback(null);

    // Прямое чтение данных из DOM через ref.current.value
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const topic = topicRef.current.value;
    const message = messageRef.current.value.trim();
    const isSubscribed = subscribeRef.current.checked;

    // Валидация при отправке формы
    if (!name) {
      setErrorMessage('Пожалуйста, введите ваше имя');
      nameRef.current.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMessage('Пожалуйста, введите корректный адрес электронной почты');
      emailRef.current.focus();
      return;
    }

    if (!topic) {
      setErrorMessage('Пожалуйста, укажите тему обращения');
      topicRef.current.focus();
      return;
    }

    if (!message || message.length < 5) {
      setErrorMessage('Сообщение должно содержать не менее 5 символов');
      messageRef.current.focus();
      return;
    }

    const collectedData = {
      name,
      email,
      topic,
      message,
      isSubscribed,
      submittedAt: new Date().toLocaleTimeString()
    };

    console.log('Неуправляемая форма успешно отправлена:', collectedData);
    setFeedback(collectedData);

    // Очистка формы напрямую через вызов нативного DOM-метода формы reset()
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleClear = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setFeedback(null);
    setErrorMessage('');
  };

  return (
    <div className="form-card" style={{ maxWidth: '520px', margin: '20px auto', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #8b5cf6', paddingBottom: '8px' }}>
        Задание 3: Форма обратной связи (useRef)
      </h3>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
        Неуправляемые компоненты: значения читаются напрямую из DOM в момент submit без ререндеров на каждый ввод символа.
      </p>

      {errorMessage && (
        <div style={{ marginBottom: '16px', padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #ef4444', borderRadius: '6px', color: '#b91c1c', fontSize: '13px' }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {feedback && (
        <div style={{ marginBottom: '16px', padding: '14px', backgroundColor: '#f5f3ff', border: '1px solid #8b5cf6', borderRadius: '6px', color: '#5b21b6' }}>
          <strong>✅ Обращение отправлено!</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '13px' }}>
            <li>Отправитель: <b>{feedback.name}</b> ({feedback.email})</li>
            <li>Тема: <b>{feedback.topic}</b></li>
            <li>Сообщение: <i>{feedback.message}</i></li>
            <li>Уведомления: {feedback.isSubscribed ? 'Включены' : 'Выключены'}</li>
            <li>Время: {feedback.submittedAt}</li>
          </ul>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>
        {/* Имя */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Ваше имя:
          </label>
          <input
            ref={nameRef}
            type="text"
            defaultValue=""
            placeholder="Иван Петров"
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Email для ответа:
          </label>
          <input
            ref={emailRef}
            type="email"
            defaultValue=""
            placeholder="ivan@example.com"
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          />
        </div>

        {/* Тема */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Тема сообщения:
          </label>
          <select
            ref={topicRef}
            defaultValue=""
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          >
            <option value="">-- Выберите тему обращения --</option>
            <option value="Техническая поддержка">Техническая поддержка</option>
            <option value="Предложение по сотрудничеству">Предложение по сотрудничеству</option>
            <option value="Вопрос по оплате">Вопрос по оплате</option>
            <option value="Другое">Другое</option>
          </select>
        </div>

        {/* Сообщение */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Текст обращения:
          </label>
          <textarea
            ref={messageRef}
            rows="4"
            defaultValue=""
            placeholder="Опишите ваш вопрос подробно..."
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', resize: 'vertical' }}
          />
        </div>

        {/* Чекбокс */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input
              ref={subscribeRef}
              type="checkbox"
              defaultChecked={false}
            />
            Получить копию ответа на email
          </label>
        </div>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{ flex: 1, padding: '10px 16px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Отправить через DOM (useRef)
          </button>
          <button
            type="button"
            onClick={handleClear}
            style={{ padding: '10px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
          >
            Очистить
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactFormUncontrolled;
