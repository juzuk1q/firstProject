import React, { useState } from 'react';
import UserRegistrationForm from './components/UserRegistrationForm';
import UserRegistrationFormWithValidation from './components/UserRegistrationFormWithValidation';
import ContactFormUncontrolled from './components/ContactFormUncontrolled';

function App() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '30px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif', color: '#1e293b' }}>
      <header style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 30px' }}>
        <h1 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>
          Практическая работа №17: «React: работа с формами»
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px', margin: '0 0 20px' }}>
          Управляемые и неуправляемые компоненты, валидация полей ввода и обработка событий
        </p>

        {/* Навигационные табы */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: activeTab === 'all' ? '#1e293b' : '#e2e8f0',
              color: activeTab === 'all' ? '#ffffff' : '#334155'
            }}
          >
            Все формы
          </button>
          <button
            onClick={() => setActiveTab('basic')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: activeTab === 'basic' ? '#3b82f6' : '#e2e8f0',
              color: activeTab === 'basic' ? '#ffffff' : '#334155'
            }}
          >
            Задание 1: Базовая форма
          </button>
          <button
            onClick={() => setActiveTab('validated')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: activeTab === 'validated' ? '#10b981' : '#e2e8f0',
              color: activeTab === 'validated' ? '#ffffff' : '#334155'
            }}
          >
            Задание 2: С валидацией
          </button>
          <button
            onClick={() => setActiveTab('uncontrolled')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: activeTab === 'uncontrolled' ? '#8b5cf6' : '#e2e8f0',
              color: activeTab === 'uncontrolled' ? '#ffffff' : '#334155'
            }}
          >
            Задание 3: Неуправляемая (useRef)
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {(activeTab === 'all' || activeTab === 'basic') && (
          <section style={{ marginBottom: '40px' }}>
            <UserRegistrationForm />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'validated') && (
          <section style={{ marginBottom: '40px' }}>
            <UserRegistrationFormWithValidation />
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'uncontrolled') && (
          <section style={{ marginBottom: '40px' }}>
            <ContactFormUncontrolled />
          </section>
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: '40px', padding: '20px', color: '#94a3b8', fontSize: '14px', borderTop: '1px solid #e2e8f0' }}>
        <p>Практическая работа №17 • React Forms • Выполнено в соответствии со стандартами React 18</p>
      </footer>
    </div>
  );
}

export default App;
