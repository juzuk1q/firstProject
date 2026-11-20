import React from 'react';
import BasicHooks from './components/BasicHooks';
import AdvancedHooks from './components/AdvancedHooks';
import CustomHooks from './components/CustomHooks';
import HooksTests from './components/HooksTests';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Практическая работа №16: React Hooks</h1>
        <p>Студент: [Ваше имя] | Группа: [Ваша группа]</p>
        <p>Изучите и реализуйте различные React хуки</p>
      </header>

      <main>
        <BasicHooks />
        <AdvancedHooks />
        <CustomHooks />
        <HooksTests />
      </main>

      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#666' }}>
        <p>Проверьте консоль браузера для отладки и запустите тесты</p>
      </footer>
    </div>
  );
}

export default App;
