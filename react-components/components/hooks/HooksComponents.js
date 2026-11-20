import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';

// ==========================================
// ЗАДАНИЕ 6: Хуки useState и useEffect
// ==========================================

// 6.1. Создайте функциональный компонент CounterWithHooks
// Аналог классового Counter, но с использованием useState
export function CounterWithHooks({ initialValue = 0 }) {
  const [count, setCount] = useState(initialValue);

  return (
    <div style={{ margin: '1rem 0' }}>
      <h4>Счетчик на хуках (useState)</h4>
      <div className="counter">Значение: {count}</div>
      <button onClick={() => setCount(prev => prev + 1)}>+1</button>
      <button onClick={() => setCount(prev => prev - 1)}>-1</button>
      <button onClick={() => setCount(initialValue)}>Сброс</button>
    </div>
  );
}

// 6.2. Создайте компонент UserProfile с использованием useState
// Форма редактирования профиля пользователя
export function UserProfile() {
  const [profile, setProfile] = useState({
    name: 'Алексей Смирнов',
    role: 'Frontend Developer',
    bio: 'Разрабатываю интерактивные веб-интерфейсы на React.'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(tempProfile);
    setIsEditing(false);
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <h4>Профиль пользователя (useState)</h4>
      {!isEditing ? (
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
          <p><strong>Имя:</strong> {profile.name}</p>
          <p><strong>Роль:</strong> {profile.role}</p>
          <p><strong>О себе:</strong> {profile.bio}</p>
          <button onClick={() => { setTempProfile(profile); setIsEditing(true); }}>
            Редактировать
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="profile-form">
          <input
            type="text"
            name="name"
            value={tempProfile.name}
            onChange={handleInputChange}
            placeholder="Имя"
          />
          <input
            type="text"
            name="role"
            value={tempProfile.role}
            onChange={handleInputChange}
            placeholder="Должность / роль"
          />
          <textarea
            name="bio"
            rows="3"
            value={tempProfile.bio}
            onChange={handleInputChange}
            placeholder="О себе"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
          />
          <div style={{ marginTop: '0.5rem' }}>
            <button type="submit" style={{ background: '#27ae60' }}>Сохранить</button>
            <button type="button" onClick={() => setIsEditing(false)} style={{ background: '#7f8c8d' }}>Отмена</button>
          </div>
        </form>
      )}
    </div>
  );
}

// 6.3. Создайте компонент EffectDemo с использованием useEffect
// Демонстрирует разные варианты использования useEffect
export function EffectDemo() {
  const [renderCount, setRenderCount] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [statusLog, setStatusLog] = useState([]);

  // 1. Эффект с пустым массивом зависимостей [] (монтирование/размонтирование)
  useEffect(() => {
    setStatusLog(prev => [...prev, '🟢 [Компонент смонтирован (только 1 раз)]']);

    const interval = setInterval(() => {
      setTimerSeconds(s => s + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      console.log('🔴 [Компонент размонтирован]');
    };
  }, []);

  // 2. Эффект с зависимостью [renderCount]
  useEffect(() => {
    if (renderCount > 0) {
      setStatusLog(prev => [...prev.slice(-3), `🔄 Сработал эффект на изменение renderCount: ${renderCount}`]);
    }
  }, [renderCount]);

  return (
    <div style={{ margin: '1rem 0' }}>
      <h4>Демонстрация работы useEffect</h4>
      <p>Таймер (монтирование): <strong>{timerSeconds} сек.</strong></p>
      <p>Ручной счетчик рендеров: <strong>{renderCount}</strong></p>
      <button onClick={() => setRenderCount(c => c + 1)}>Вызвать зависимый эффект</button>

      <div style={{ background: '#2c3e50', color: '#ecf0f1', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', marginTop: '0.5rem' }}>
        <strong>Лог эффектов:</strong>
        {statusLog.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// ЗАДАНИЕ 7: Кастомные хуки и useContext
// ==========================================

// 7.1. Создайте кастомный хук useLocalStorage
// Для синхронизации состояния с localStorage
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Ошибка чтения localStorage по ключу "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`Ошибка записи в localStorage по ключу "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// 7.2. Создайте кастомный хук useFetch
// Для выполнения HTTP запросов
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ошибка: ${res.status}`);
        return res.json();
      })
      .then(result => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}

// Создайте Context для темы
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 7.3. Создайте компонент ThemeToggle с использованием useContext
// Переключение между светлой и темной темой
export function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
      <h4>Контекст темы (useContext)</h4>
      <p>Текущая активная тема: <strong>{theme === 'dark' ? '🌙 Темная' : '☀️ Светлая'}</strong></p>
      <button onClick={toggleTheme}>
        Переключить на {theme === 'dark' ? 'Светлую' : 'Темную'} тему
      </button>
    </div>
  );
}

// Демонстрация хука useLocalStorage
function LocalStorageDemo() {
  const [savedNote, setSavedNote] = useLocalStorage('student_demo_note', 'Привет из LocalStorage!');

  return (
    <div style={{ margin: '1rem 0' }}>
      <h4>Кастомный хук useLocalStorage</h4>
      <input
        type="text"
        value={savedNote}
        onChange={(e) => setSavedNote(e.target.value)}
        placeholder="Текст сохраняется в LocalStorage..."
      />
      <p style={{ fontSize: '0.85rem', color: '#666' }}>
        Значение сохраняется в браузере при перезагрузке страницы.
      </p>
    </div>
  );
}

// Основной компонент раздела
function HooksComponents() {
  return (
    <section className="task-section">
      <h2>React Hooks</h2>

      <div className="component-demo">
        <h3>Задание 6: useState и useEffect</h3>
        <div id="hooks-output-1" className="output">
          <CounterWithHooks initialValue={5} />
          <UserProfile />
          <EffectDemo />
        </div>
      </div>

      <div className="component-demo">
        <h3>Задание 7: Кастомные хуки и Context</h3>
        <div id="hooks-output-2" className="output">
          <LocalStorageDemo />
          <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider>
        </div>
      </div>
    </section>
  );
}

export default HooksComponents;
