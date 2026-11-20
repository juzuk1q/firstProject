import React, { useReducer, useContext, useCallback, useMemo, useRef, useState, useEffect } from 'react';

// Контекст для примера
const ThemeContext = React.createContext();

// ЗАДАНИЕ 3: useReducer - Управление сложным состоянием
// 3.1. Создайте reducer и компонент ShoppingCart
function cartReducer(state, action) {
  // ВАШ КОД ЗДЕСЬ
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return { items: [] };

    default:
      return state;
  }
}

function ShoppingCart() {
  // ВАШ КОД ЗДЕСЬ
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const sampleItems = [
    { id: 1, name: 'Товар 1', price: 100 },
    { id: 2, name: 'Товар 2', price: 200 },
    { id: 3, name: 'Товар 3', price: 300 }
  ];

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Корзина покупок</h3>

      <div>
        <h4>Добавить товары:</h4>
        {sampleItems.map(item => (
          <button key={item.id} onClick={() => addItem(item)} style={{ marginRight: '5px' }}>
            Добавить {item.name}
          </button>
        ))}
      </div>

      <div>
        <h4>Товары в корзине:</h4>
        {state.items.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
            <span>{item.name}</span>
            <span>{item.price} руб.</span>
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            <button onClick={() => removeItem(item.id)}>Удалить</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
        Общая сумма: {total}
      </div>

      <button onClick={() => dispatch({ type: 'CLEAR_CART' })} style={{ marginTop: '10px' }}>
        Очистить корзину
      </button>
    </div>
  );
}

// 3.2. Создайте компонент Stopwatch с useReducer
function stopwatchReducer(state, action) {
  // ВАШ КОД ЗДЕСЬ
  switch (action.type) {
    case 'START':
      return { ...state, isRunning: true };
    case 'STOP':
      return { ...state, isRunning: false };
    case 'RESET':
      return { isRunning: false, time: 0, laps: [] };
    case 'TICK':
      return { ...state, time: state.time + 1 };
    case 'LAP':
      return { ...state, laps: [...state.laps, state.time] };
    default:
      return state;
  }
}

function Stopwatch() {
  // ВАШ КОД ЗДЕСЬ
  const [state, dispatch] = useReducer(stopwatchReducer, {
    isRunning: false,
    time: 0,
    laps: []
  });

  useEffect(() => {
    let interval;
    if (state.isRunning) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isRunning]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Секундомер: {state.time} сек.</h3>
      <button onClick={() => dispatch({ type: state.isRunning ? 'STOP' : 'START' })}>
        {state.isRunning ? 'Стоп' : 'Старт'}
      </button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Сброс</button>
      <button onClick={() => dispatch({ type: 'LAP' })}>Круг</button>

      {state.laps.length > 0 && (
        <div>
          <h4>Круги:</h4>
          <ul>
            {state.laps.map((lap, index) => (
              <li key={index}>Круг {index + 1}: {lap} сек.</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ЗАДАНИЕ 4: useContext - Доступ к контексту
// 4.1. Создайте компонент ThemeToggle
function ThemeToggle() {
  // ВАШ КОД ЗДЕСЬ
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '20px',
      margin: '10px',
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000'
    }}>
      <h3>Тема: {theme}</h3>
      <button onClick={toggleTheme}>Переключить тему</button>
    </div>
  );
}

// ЗАДАНИЕ 5: useCallback и useMemo - Оптимизация
// 5.1. Создайте компонент ExpensiveCalculation
function ExpensiveCalculation() {
  // ВАШ КОД ЗДЕСЬ
  const [number, setNumber] = useState(1);
  const [renderCount, setRenderCount] = useState(0);

  // Имитация сложных вычислений
  const expensiveResult = useMemo(() => {
    console.log('Выполняются сложные вычисления...');
    let result = 0;
    for (let i = 0; i < 100000000; i++) {
      result += number;
    }
    return result;
  }, [number]);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Сложные вычисления</h3>
      <div>Число: {number}</div>
      <div>Результат: {expensiveResult}</div>
      <div>Количество рендеров: {renderCount}</div>
      <button onClick={() => setNumber(prev => prev + 1)}>Увеличить число</button>
      <button onClick={() => setRenderCount(0)}>Сбросить счетчик рендеров</button>
    </div>
  );
}

// ЗАДАНИЕ 6: useRef - Прямой доступ к DOM
// 6.1. Создайте компонент FocusInput
function FocusInput() {
  // ВАШ КОД ЗДЕСЬ
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Фокус на input</h3>
      <input ref={inputRef} placeholder="Нажмите кнопку для фокуса" />
      <button onClick={focusInput}>Фокус на input</button>
    </div>
  );
}

// 6.2. Создайте компонент PreviousValue
function PreviousValue() {
  // ВАШ КОД ЗДЕСЬ
  const [value, setValue] = useState('');
  const previousValue = useRef('');

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Текущее и предыдущее значение</h3>
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Введите текст" />
      <div>Текущее: {value}</div>
      <div>Предыдущее: {previousValue.current}</div>
    </div>
  );
}

// Провайдер темы
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Основной компонент раздела
function AdvancedHooks() {
  return (
    <ThemeProvider>
      <div id="advanced" style={{ padding: '20px', border: '2px solid green', margin: '10px' }}>
        <h2>Продвинутые хуки</h2>

        <div>
          <h3>Задание 3: useReducer</h3>
          <ShoppingCart />
          <Stopwatch />
        </div>

        <div>
          <h3>Задание 4: useContext</h3>
          <ThemeToggle />
        </div>

        <div>
          <h3>Задание 5: useCallback и useMemo</h3>
          <ExpensiveCalculation />
        </div>

        <div>
          <h3>Задание 6: useRef</h3>
          <FocusInput />
          <PreviousValue />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default AdvancedHooks;
export { ThemeContext, ThemeProvider, ShoppingCart, Stopwatch, ThemeToggle, ExpensiveCalculation, FocusInput, PreviousValue };
