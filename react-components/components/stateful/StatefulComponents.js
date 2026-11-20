import React, { Component } from 'react';

// ЗАДАНИЕ 3: Классовые компоненты с состоянием

// 3.1. Создайте классовый компонент Counter
// Должен отображать счетчик и кнопки для увеличения/уменьшения
export class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.initialValue !== undefined ? props.initialValue : 0
    };
  }

  increment = () => {
    this.setState((prev) => ({ count: prev.count + 1 }));
  };

  decrement = () => {
    this.setState((prev) => ({ count: prev.count - 1 }));
  };

  reset = () => {
    this.setState({ count: this.props.initialValue || 0 });
  };

  render() {
    return (
      <div className="stateful-counter">
        <div className="counter">Значение: {this.state.count}</div>
        <button onClick={this.increment}>+1</button>
        <button onClick={this.decrement}>-1</button>
        <button onClick={this.reset}>Сброс</button>
      </div>
    );
  }
}

// 3.2. Создайте классовый компонент LoginForm
// Должен содержать поля email и password, кнопку отправки и отображать ошибки валидации
export class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      success: ''
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: '',
      success: ''
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    if (!email || !email.includes('@')) {
      this.setState({ error: 'Пожалуйста, введите корректный адрес Email.' });
      return;
    }
    if (!password || password.length < 6) {
      this.setState({ error: 'Пароль должен содержать минимум 6 символов.' });
      return;
    }

    this.setState({
      success: `Успешный вход! Email: ${email}`,
      error: ''
    });
  };

  render() {
    const { email, password, error, success } = this.state;

    return (
      <form className="login-form" onSubmit={this.handleSubmit}>
        <h4>Форма входа</h4>
        {error && <div className="error" style={{ padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '4px' }}>{error}</div>}
        {success && <div className="success" style={{ padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '4px' }}>{success}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email адрес"
          value={email}
          onChange={this.handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={password}
          onChange={this.handleChange}
        />
        <button type="submit">Войти</button>
      </form>
    );
  }
}

// 3.3. Создайте классовый компонент ColorPicker
// Позволяет выбирать цвет из предустановленных вариантов и показывает выбранный цвет
export class ColorPicker extends Component {
  constructor(props) {
    super(props);
    const colors = props.colors && props.colors.length > 0
      ? props.colors
      : ['#ff0000', '#00ff00', '#0000ff'];

    this.state = {
      selectedColor: colors[0],
      colors
    };
  }

  handleSelectColor = (color) => {
    this.setState({ selectedColor: color });
  };

  render() {
    const { selectedColor, colors } = this.state;

    return (
      <div style={{ margin: '1rem 0' }}>
        <h4>Выбор цвета (ColorPicker)</h4>
        <div className="color-palette">
          {colors.map((color, index) => (
            <button
              key={index}
              className="color-btn"
              style={{
                backgroundColor: color,
                outline: selectedColor === color ? '3px solid #2c3e50' : 'none'
              }}
              onClick={() => this.handleSelectColor(color)}
              title={color}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <span>Выбранный цвет: <strong>{selectedColor}</strong></span>
          <div style={{ width: '24px', height: '24px', backgroundColor: selectedColor, borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
      </div>
    );
  }
}

// ЗАДАНИЕ 4: Обработка событий и формы

// 4.1. Создайте классовый компонент TodoList
// Добавление, удаление и отметка выполнения задач
export class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        { id: 1, text: 'Изучить классовые компоненты', completed: true },
        { id: 2, text: 'Разобраться с методами жизненного цикла', completed: false }
      ],
      inputValue: ''
    };
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleAddTodo = (e) => {
    e.preventDefault();
    const text = this.state.inputValue.trim();
    if (!text) return;

    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };

    this.setState((prev) => ({
      todos: [...prev.todos, newTodo],
      inputValue: ''
    }));
  };

  handleToggleTodo = (id) => {
    this.setState((prev) => ({
      todos: prev.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  handleDeleteTodo = (id) => {
    this.setState((prev) => ({
      todos: prev.todos.filter((todo) => todo.id !== id)
    }));
  };

  render() {
    const { todos, inputValue } = this.state;

    return (
      <div style={{ margin: '1rem 0' }}>
        <h4>Список дел (TodoList)</h4>
        <form onSubmit={this.handleAddTodo} style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Что нужно сделать?"
            value={inputValue}
            onChange={this.handleInputChange}
            style={{ flex: 1 }}
          />
          <button type="submit">Добавить</button>
        </form>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span
                onClick={() => this.handleToggleTodo(todo.id)}
                style={{
                  cursor: 'pointer',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#888' : '#333'
                }}
              >
                {todo.completed ? '☑️' : '⬜'} {todo.text}
              </span>
              <button
                onClick={() => this.handleDeleteTodo(todo.id)}
                style={{ padding: '0.2rem 0.5rem', margin: 0, background: '#e74c3c', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

// 4.2. Создайте классовый компонент SearchBox
// Поле поиска с отображением результатов и очисткой
export class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.items = props.items || ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Redux'];
    this.state = {
      searchTerm: ''
    };
  }

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleClear = () => {
    this.setState({ searchTerm: '' });
  };

  render() {
    const { searchTerm } = this.state;
    const filteredItems = this.items.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div style={{ margin: '1rem 0' }}>
        <h4>Поиск технологий (SearchBox)</h4>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Введите запрос..."
            value={searchTerm}
            onChange={this.handleSearchChange}
          />
          {searchTerm && (
            <button onClick={this.handleClear} style={{ background: '#7f8c8d' }}>Очистить</button>
          )}
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <strong>Найдено ({filteredItems.length}):</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '0.5rem' }}>
            {filteredItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

// Основной компонент раздела
class StatefulComponents extends Component {
  render() {
    return (
      <section className="task-section">
        <h2>Компоненты с состоянием</h2>

        <div className="component-demo">
          <h3>Задание 3: Классовые компоненты</h3>
          <div id="stateful-output-1" className="output">
            <Counter initialValue={0} />
            <LoginForm />
            <ColorPicker colors={['#ff0000', '#00ff00', '#0000ff']} />
          </div>
        </div>

        <div className="component-demo">
          <h3>Задание 4: Обработка событий</h3>
          <div id="stateful-output-2" className="output">
            <TodoList />
            <SearchBox items={['React', 'JavaScript', 'HTML', 'CSS']} />
          </div>
        </div>
      </section>
    );
  }
}

export default StatefulComponents;
