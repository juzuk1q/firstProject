// функция для вывода результатов тестов
function runTest(testName, actual, expected) {
    const isEqual = JSON.stringify(actual) === JSON.stringify(expected);
    // отрисовка в HTML, если запуск в браузере
    if (typeof document !== 'undefined') {
        const resultElement = document.createElement('div');
        resultElement.className = `test-result ${isEqual ? 'success' : 'error'}`;
        resultElement.innerHTML = `
            <strong>${testName}:</strong>
            ${isEqual ? 'УСПЕХ' : 'ОШИБКА'}
            <br>
            Ожидалось: ${JSON.stringify(expected)}
            <br>
            Получено: ${JSON.stringify(actual)}
        `;
        const container = document.getElementById('testResults');
        if (container) {
            container.appendChild(resultElement);
        }
    }
    console.log(`${testName}:`, isEqual ? 'УСПЕХ' : 'ОШИБКА', { expected, actual });
}

// запуск всех тестов
function runAllTests() {
    console.log('=== ЗАПУСК Тестов ===');
    // тесты для чисел
    runTest('isPrime(7)', isPrime(7), true);
    runTest('isPrime(10)', isPrime(10), false);
    runTest('factorial(5)', factorial(5), 120);
    runTest('gcd(54, 24)', gcd(54, 24), 6);
    runTest('fibonacci(6)', fibonacci(6), [0, 1, 1, 2, 3, 5]);
    // тесты для строк
    runTest('isPalindrome("А роза упала на лапу Азора")', isPalindrome("А роза упала на лапу Азора"), true);
    runTest('countVowels("JavaScript")', countVowels("JavaScript"), 3);
    runTest('reverseString("hello")', reverseString("hello"), "olleh");
    runTest('findLongestWord("Самое длинное слово в предложении")', findLongestWord("Самое длинное слово в предложении"), "предложении");
    // тесты для массивов
    runTest('findMax([3, 7, 2, 9, 1])', findMax([3, 7, 2, 9, 1]), 9);
    runTest('removeDuplicates([1, 2, 2, 3, 4, 4, 5])', removeDuplicates([1, 2, 2, 3, 4, 4, 5]), [1, 2, 3, 4, 5]);
    runTest('bubbleSort([64, 34, 25, 12, 22, 11, 90])', bubbleSort([64, 34, 25, 12, 22, 11, 90]), [11, 12, 22, 25, 34, 64, 90]);
    runTest('binarySearch([1, 3, 5, 7, 9], 5)', binarySearch([1, 3, 5, 7, 9], 5), 2);
    // тесты для утилитарных функций
    runTest('formatCurrency(1234.56)', formatCurrency(1234.56), "1 234.56 ₽");
    runTest('isValidEmail("test@example.com")', isValidEmail("test@example.com"), true);
    console.log('=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');
}

// дополнительные в консоли
function demonstrateAlgorithms() {
    console.log('\n=== ДЕМОНСТРАЦИЯ АЛГОРИТМОВ ===');
    console.log('Сгенерированный пароль:', generatePassword(12));
    console.log('Числа Фибоначчи до 10:', fibonacci(10));
    console.log('Проверка email "invalid.email":', isValidEmail("invalid.email"));
    const testArray = [5, 2, 8, 1, 9];
    console.log('Исходный массив:', testArray);
    console.log('Отсортированный массив:', bubbleSort(testArray));
    console.log('Максимальный элемент:', findMax(testArray));
}

document.addEventListener('DOMContentLoaded', function() {
    runAllTests();
    demonstrateAlgorithms();
});