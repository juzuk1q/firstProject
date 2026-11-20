import React, { useState, useEffect, useRef, useCallback } from 'react';

// ЗАДАНИЕ 7: Создание кастомных хуков
// 7.1. Создайте кастомный хук useLocalStorage
function useLocalStorage(key, initialValue) {
  // ВАШ КОД ЗДЕСЬ
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Ошибка чтения localStorage ключа "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Ошибка записи в localStorage ключа "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

// 7.2. Создайте кастомный хук useFetch
function useFetch(url) {
  // ВАШ КОД ЗДЕСЬ
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка сети');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// 7.3. Создайте кастомный хук useToggle
function useToggle(initialValue = false) {
  // ВАШ КОД ЗДЕСЬ
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  return [value, toggle];
}

// 7.4. Создайте кастомный хук useDebounce
function useDebounce(value, delay) {
  // ВАШ КОД ЗДЕСЬ
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 7.5. Создайте кастомный хук useWindowSize
function useWindowSize() {
  // ВАШ КОД ЗДЕСЬ
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// Компоненты, использующие кастомные хуки

// 7.1. Компонент для useLocalStorage
function LocalStorageDemo() {
  // ВАШ КОД ЗДЕСЬ
  const [name, setName] = useLocalStorage('username', '');

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>useLocalStorage</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Введите имя (сохранится в localStorage)"
      />
      <div>Текущее имя: {name}</div>
      <button onClick={() => setName('')}>Очистить</button>
    </div>
  );
}

// 7.2. Компонент для useFetch
function FetchDemo() {
  // ВАШ КОД ЗДЕСЬ
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>useFetch</h3>
      {loading && <div>Загрузка пользователей...</div>}
      {error && <div style={{ color: 'red' }}>Ошибка: {error}</div>}
      {data && (
        <div>
          <h4>Пользователи:</h4>
          <ul>
            {data.slice(0, 3).map(user => (
              <li key={user.id}>{user.name} ({user.email})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// 7.3. Компонент для useToggle
function ToggleDemo() {
  // ВАШ КОД ЗДЕСЬ
  const [isVisible, toggleVisible] = useToggle(false);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>useToggle</h3>
      <button onClick={toggleVisible}>
        {isVisible ? 'Скрыть' : 'Показать'}
      </button>
      {isVisible && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0' }}>
          Секретный контент!
        </div>
      )}
    </div>
  );
}

// 7.4. Компонент для useDebounce
function DebounceDemo() {
  // ВАШ КОД ЗДЕСЬ
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (debouncedSearch) {
      // Имитация поиска
      const mockResults = [
        `Результат 1 для "${debouncedSearch}"`,
        `Результат 2 для "${debouncedSearch}"`,
        `Результат 3 для "${debouncedSearch}"`
      ];
      setResults(mockResults);
    } else {
      setResults([]);
    }
  }, [debouncedSearch]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>useDebounce</h3>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск (с debounce 500ms)"
      />
      <div>Текущий поиск: {search}</div>
      <div>Debounced поиск: {debouncedSearch}</div>

      {results.length > 0 && (
        <div>
          <h4>Результаты:</h4>
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// 7.5. Компонент для useWindowSize
function WindowSizeDemo() {
  // ВАШ КОД ЗДЕСЬ
  const { width, height } = useWindowSize();

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>useWindowSize</h3>
      <div>Ширина окна: {width}px</div>
      <div>Высота окна: {height}px</div>
    </div>
  );
}

// Основной компонент раздела
function CustomHooks() {
  return (
    <div id="custom" style={{ padding: '20px', border: '2px solid purple', margin: '10px' }}>
      <h2>Кастомные хуки</h2>
      <p>Создайте и используйте собственные хуки для повторного использования логики</p>

      <div>
        <h3>Задание 7: Создание кастомных хуков</h3>
        <LocalStorageDemo />
        <FetchDemo />
        <ToggleDemo />
        <DebounceDemo />
        <WindowSizeDemo />
      </div>
    </div>
  );
}

export default CustomHooks;
export {
  useLocalStorage,
  useFetch,
  useToggle,
  useDebounce,
  useWindowSize,
  LocalStorageDemo,
  FetchDemo,
  ToggleDemo,
  DebounceDemo,
  WindowSizeDemo
};
