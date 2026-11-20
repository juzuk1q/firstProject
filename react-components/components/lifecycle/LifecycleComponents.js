import React, { Component } from 'react';

// ЗАДАНИЕ 5: Методы жизненного цикла

// 5.1. Создайте классовый компонент Timer
// Отображает секундомер с кнопками старт/стоп/сброс
// Используйте componentDidMount, componentWillUnmount
export class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      isRunning: false
    };
    this.intervalId = null;
  }

  componentDidMount() {
    console.log('[Timer] Component mounted');
  }

  componentWillUnmount() {
    console.log('[Timer] Component will unmount, cleaning up interval');
    this.clearInterval();
  }

  clearInterval = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  };

  handleStart = () => {
    if (this.state.isRunning) return;

    this.setState({ isRunning: true });
    this.intervalId = setInterval(() => {
      this.setState((prev) => ({ seconds: prev.seconds + 1 }));
    }, 1000);
  };

  handleStop = () => {
    this.setState({ isRunning: false });
    this.clearInterval();
  };

  handleReset = () => {
    this.handleStop();
    this.setState({ seconds: 0 });
  };

  render() {
    const { seconds, isRunning } = this.state;

    return (
      <div style={{ margin: '1rem 0' }}>
        <h4>Секундомер (Timer с жизненным циклом)</h4>
        <div className="timer-display">⏱ {seconds} сек.</div>
        <button onClick={this.handleStart} disabled={isRunning} style={{ background: '#27ae60' }}>Старт</button>
        <button onClick={this.handleStop} disabled={!isRunning} style={{ background: '#e67e22' }}>Стоп</button>
        <button onClick={this.handleReset} style={{ background: '#7f8c8d' }}>Сброс</button>
      </div>
    );
  }
}

// 5.2. Создайте компонент WindowSizeTracker
// Отображает текущий размер окна браузера
// Используйте componentDidMount и componentWillUnmount для добавления/удаления слушателя
export class WindowSizeTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: typeof window !== 'undefined' ? window.innerWidth : 1024,
      height: typeof window !== 'undefined' ? window.innerHeight : 768
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  render() {
    const { width, height } = this.state;

    return (
      <div className="window-size-box">
        <h4>Размер окна браузера (WindowSizeTracker)</h4>
        <p>Ширина: <strong>{width}px</strong> | Высота: <strong>{height}px</strong></p>
      </div>
    );
  }
}

// 5.3. Создайте компонент DataFetcher
// Загружает данные с API при монтировании и обновлении props
// Используйте componentDidMount и componentDidUpdate
export class DataFetcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchData(this.props.url);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.fetchData(this.props.url);
    }
  }

  fetchData = async (url) => {
    if (!url) return;
    this.setState({ loading: true, error: null });

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      this.setState({ data, loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  render() {
    const { data, loading, error } = this.state;

    return (
      <div className="data-fetcher-box">
        <h4>Загрузка данных (DataFetcher)</h4>
        {loading && <p>⏳ Загрузка списка пользователей...</p>}
        {error && <p className="error">❌ Ошибка: {error}</p>}
        {data && (
          <div>
            <p>Успешно загружено пользователей: <strong>{data.length}</strong></p>
            <ul style={{ paddingLeft: '20px' }}>
              {data.slice(0, 3).map((user) => (
                <li key={user.id}>{user.name} ({user.email})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

// Основной компонент раздела
class LifecycleComponents extends Component {
  render() {
    return (
      <section className="task-section">
        <h2>Жизненный цикл компонентов</h2>

        <div className="component-demo">
          <h3>Задание 5: Методы жизненного цикла</h3>
          <div id="lifecycle-output" className="output">
            <Timer />
            <WindowSizeTracker />
            <DataFetcher url="https://jsonplaceholder.typicode.com/users" />
          </div>
        </div>
      </section>
    );
  }
}

export default LifecycleComponents;
