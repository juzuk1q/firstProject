import React from 'react';

function HooksTests() {
  const runTests = () => {
    const testResults = [];

    // Простые проверки наличия компонентов
    try {
      const basicHooks = document.querySelectorAll('[id^="basic"]');
      testResults.push({
        name: 'Базовые хуки созданы',
        passed: basicHooks.length > 0,
        message: `Найдено компонентов: ${basicHooks.length}`
      });
    } catch (error) {
      testResults.push({
        name: 'Базовые хуки',
        passed: false,
        message: `Ошибка: ${error.message}`
      });
    }

    // Проверка продвинутых хуков
    try {
      const advancedHooks = document.querySelectorAll('[id^="advanced"]');
      testResults.push({
        name: 'Продвинутые хуки созданы',
        passed: advancedHooks.length > 0,
        message: `Найдено компонентов: ${advancedHooks.length}`
      });
    } catch (error) {
      testResults.push({
        name: 'Продвинутые хуки',
        passed: false,
        message: `Ошибка: ${error.message}`
      });
    }

    // Проверка кастомных хуков
    try {
      const customHooks = document.querySelectorAll('[id^="custom"]');
      testResults.push({
        name: 'Кастомные хуки созданы',
        passed: customHooks.length > 0,
        message: `Найдено компонентов: ${customHooks.length}`
      });
    } catch (error) {
      testResults.push({
        name: 'Кастомные хуки',
        passed: false,
        message: `Ошибка: ${error.message}`
      });
    }

    // Вывод результатов
    console.log('=== РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ ХУКОВ ===');
    testResults.forEach(test => {
      console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.message}`);
    });

    const passedTests = testResults.filter(test => test.passed).length;
    const totalTests = testResults.length;

    alert(`Тестирование завершено: ${passedTests}/${totalTests} тестов пройдено\nПроверьте консоль для подробностей.`);
  };

  return (
    <div style={{ padding: '20px', border: '2px solid orange', margin: '10px' }}>
      <h2>Тестирование хуков</h2>
      <button
        onClick={runTests}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Запустить тесты
      </button>

      <div style={{ margin: '20px 0', textAlign: 'left' }}>
        <h4>Инструкция по проверке:</h4>
        <ul style={{ listStyleType: 'none', paddingLeft: 0, lineHeight: '1.8' }}>
          <li>✅ Счетчик - увеличивается/уменьшается/сбрасывается</li>
          <li>✅ Форма - сохраняет значения в state</li>
          <li>✅ Список задач - добавляет/удаляет/фильтрует задачи</li>
          <li>✅ Таймер - запускается/останавливается</li>
          <li>✅ Размер окна - отображает текущие размеры</li>
          <li>✅ Загрузка данных - показывает данные с API</li>
          <li>✅ Корзина - добавляет/удаляет товары, считает сумму</li>
          <li>✅ Секундомер - работает с useReducer</li>
          <li>✅ Тема - переключается через useContext</li>
          <li>✅ useMemo - оптимизирует вычисления</li>
          <li>✅ useRef - работает с DOM и значениями</li>
          <li>✅ Кастомные хуки - работают корректно</li>
        </ul>
      </div>
    </div>
  );
}

export default HooksTests;
