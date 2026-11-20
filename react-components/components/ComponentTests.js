import React from 'react';

// Компонент для тестирования и демонстрации
export function ComponentTests() {
  const runTests = () => {
    const testResults = [];

    // Тест 1: Проверка создания компонентов
    try {
      // Проверяем, что все основные компоненты созданы
      const basicComponents = document.querySelectorAll('#basic-output-1 > *');
      const statefulComponents = document.querySelectorAll('#stateful-output-1 > *');
      const hooksComponents = document.querySelectorAll('#hooks-output-1 > *');

      testResults.push({
        name: 'Базовые компоненты созданы',
        passed: basicComponents.length > 0,
        message: `Найдено компонентов: ${basicComponents.length}`
      });

      testResults.push({
        name: 'Компоненты с состоянием созданы',
        passed: statefulComponents.length > 0,
        message: `Найдено компонентов: ${statefulComponents.length}`
      });

      testResults.push({
        name: 'Hooks компоненты созданы',
        passed: hooksComponents.length > 0,
        message: `Найдено компонентов: ${hooksComponents.length}`
      });

    } catch (error) {
      testResults.push({
        name: 'Общие тесты',
        passed: false,
        message: `Ошибка: ${error.message}`
      });
    }

    // Вывод результатов
    console.log('=== РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ ===');
    testResults.forEach(test => {
      console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.message}`);
    });

    const passedTests = testResults.filter(test => test.passed).length;
    const totalTests = testResults.length;

    alert(`Тестирование завершено: ${passedTests}/${totalTests} тестов пройдено`);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <button
        onClick={runTests}
        style={{
          background: '#27ae60',
          color: 'white',
          padding: '1rem 2rem',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1.1rem',
          cursor: 'pointer'
        }}
      >
        Запустить тесты компонентов
      </button>

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <h3>Инструкция по проверке:</h3>
        <ul>
          <li>Убедитесь, что все компоненты отображаются корректно</li>
          <li>Проверьте работу счетчиков и форм</li>
          <li>Убедитесь, что обработчики событий работают</li>
          <li>Проверьте работу хуков и жизненного цикла</li>
        </ul>
      </div>
    </div>
  );
}

export default ComponentTests;
