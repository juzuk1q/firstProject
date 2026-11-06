// Подключение функций в среде Node.js
if (typeof require !== 'undefined' && typeof sum === 'undefined') {
    const funcs = require('./functions.js');
    Object.assign(global, funcs);
}

// Статистика тестирования
const testStats = {
    total: 0,
    passed: 0,
    failed: 0,
    startTime: Date.now()
};

// Вспомогательная функция глубокого сравнения значений
function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'number' && isNaN(a) && isNaN(b)) return true;
    if (a === null || b === null || typeof a !== 'object') return false;

    if (Array.isArray(a) !== Array.isArray(b)) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
            return false;
        }
    }
    return true;
}

// Вывод заголовка секции тестов
function renderSectionHeader(title) {
    if (typeof document !== 'undefined') {
        const container = document.getElementById('testResults');
        if (container) {
            const h2 = document.createElement('h2');
            h2.textContent = title;
            container.appendChild(h2);
        }
    }
    console.log(`\n=== ${title} ===`);
}

// Функция запуска одиночного теста

function runTest(testName, actual, expected, description = '') {
    testStats.total++;
    const isSuccess = deepEqual(actual, expected);

    if (isSuccess) {
        testStats.passed++;
    } else {
        testStats.failed++;
    }

    // Вывод в DOM (браузер)
    if (typeof document !== 'undefined') {
        const container = document.getElementById('testResults');
        if (container) {
            const el = document.createElement('div');
            el.className = `test-result ${isSuccess ? 'success' : 'error'}`;
            el.innerHTML = `
                <div>
                    <strong>${testName}:</strong> 
                    <span class="badge ${isSuccess ? 'badge-success' : 'badge-error'}">
                        ${isSuccess ? 'УСПЕХ' : '[X] ОШИБКА'}
                    </span>
                    ${description ? `<small style="color: #666; margin-left: 8px;">(${description})</small>` : ''}
                </div>
                <div style="margin-top: 4px; font-size: 0.9em;">
                    <div><code>Ожидалось:</code> ${JSON.stringify(expected)}</div>
                    <div><code>Получено: </code> ${JSON.stringify(actual)}</div>
                </div>
            `;
            container.appendChild(el);
        }
    }

    // Вывод в консоль
    const statusIcon = isSuccess ? '0' : 'err';
    console.log(`${statusIcon} ${testName} ${description ? `(${description})` : ''}`);
    if (!isSuccess) {
        console.error(`   Ожидалось: ${JSON.stringify(expected)}`);
        console.error(`   Получено:  ${JSON.stringify(actual)}`);
    }
}

// Вывод информации о заданиях в блок #tasksInfo
function renderTasksInfo() {
    if (typeof document === 'undefined') return;
    const infoContainer = document.getElementById('tasksInfo');
    if (!infoContainer) return;

    infoContainer.innerHTML = `
        <div class="task">
            <h3>Часть 2: Основные задания</h3>
            <ul>
                <li><code>sum(...numbers)</code> — сложение произвольного числа аргументов через rest parameters.</li>
                <li><code>createUser({ name, age, email })</code> — деструктуризация с параметром по умолчанию.</li>
                <li><code>secretMessage(password, message)</code> — скрытие данных с помощью замыкания (closure).</li>
            </ul>
        </div>
        <div class="task">
            <h3>Часть 3: Рекурсия и функции высшего порядка</h3>
            <ul>
                <li><code>compose(...functions)</code> — рекурсивная/композиционная цепочка вызовов справа налево.</li>
                <li><code>myMap(array, callback)</code> — собственная реализация Array.prototype.map.</li>
                <li><code>myFilter(array, callback)</code> — собственная реализация Array.prototype.filter.</li>
                <li><code>myReduce(array, callback, initialValue)</code> — полная реализация Array.prototype.reduce.</li>
            </ul>
        </div>
        <div class="task">
            <h3>Часть 4: Сложно, но важно</h3>
            <ul>
                <li><code>curry(fn)</code> — каррирование функции с произвольным разбиением аргументов.</li>
                <li><code>memoize(fn)</code> — кэширование результатов вызовов для ускорения повторных расчетов.</li>
                <li><code>debounce(fn, delay)</code> — откладывание вызова при частых повторных триггерах.</li>
                <li><code>throttle(fn, interval)</code> — лимитирование частоты вызовов до 1 раза за интервал.</li>
                <li><code>createValidator(options)</code> — фабрика функций-валидаторов с проверками.</li>
            </ul>
        </div>
    `;
}

// Вывод итогового саммари тестирования

function renderSummary() {
    const elapsed = Date.now() - testStats.startTime;
    const summaryText = `Всего тестов: ${testStats.total} | Успешно: ${testStats.passed} | Ошибок: ${testStats.failed} | Время: ${elapsed} мс`;

    if (typeof document !== 'undefined') {
        const container = document.getElementById('testResults');
        if (container) {
            const summaryEl = document.createElement('div');
            summaryEl.className = 'test-summary';
            summaryEl.innerHTML = `
                <h3>🏁 Итоги тестирования</h3>
                <p><strong>${summaryText}</strong></p>
                <div style="color: ${testStats.failed === 0 ? '#28a745' : '#dc3545'}; font-size: 1.1em; font-weight: bold;">
                    ${testStats.failed === 0 ? '🎉 Все тесты пройдены успешно!' : '⚠️ Обнаружены ошибки при выполнении тестов!'}
                </div>
            `;
            container.insertBefore(summaryEl, container.firstChild);
        }
    }

    console.log(`\n========================================`);
    console.log(summaryText);
    console.log(testStats.failed === 0 ? '🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ!' : '⚠️ ЕСТЬ ОШИБКИ В ТЕСТАХ!');
    console.log(`========================================\n`);
}

// Основной набор синхронных и асинхронных тестов
async function runAllTests() {
    renderTasksInfo();
    renderSectionHeader('Часть 2: Основные задания');

    // Тесты sum
    runTest('sum(1, 2, 3, 4, 5)', sum(1, 2, 3, 4, 5), 15, 'Сложение положительных чисел');
    runTest('sum(-5, 10, -3)', sum(-5, 10, -3), 2, 'Смешанные положительные и отрицательные числа');
    runTest('sum(0.5, 1.5, 2.25)', sum(0.5, 1.5, 2.25), 4.25, 'Сложение дробных чисел');
    runTest('sum(42)', sum(42), 42, 'Один переданный аргумент');
    runTest('sum()', sum(), 0, 'Краевой случай: вызов без аргументов возвращает 0');
    runTest('sum(0, 0, 0)', sum(0, 0, 0), 0, 'Краевой случай: сложение нулей');

    // Тесты createUser
    runTest(
        'createUser со всеми полями',
        createUser({ name: "Иван", age: 25, email: "ivan@example.com" }),
        "Пользователь: Иван, возраст: 25, email: ivan@example.com",
        "Полный объект пользователя"
    );
    runTest(
        'createUser с email по умолчанию',
        createUser({ name: "Анна", age: 30 }),
        "Пользователь: Анна, возраст: 30, email: не указан",
        "email не передан, применилось значение по умолчанию"
    );
    runTest(
        'createUser с age: 0',
        createUser({ name: "Младенец", age: 0 }),
        "Пользователь: Младенец, возраст: 0, email: не указан",
        "Краевой случай: нулевой возраст"
    );
    runTest(
        'createUser без аргументов',
        createUser(),
        "Пользователь: undefined, возраст: undefined, email: не указан",
        "Краевой случай: безопасный вызов без аргумента"
    );

    // Тесты secretMessage
    const box1 = secretMessage("qwerty123", "Секретный код от сейфа: 777");
    const box2 = secretMessage("admin", "Конфиденциальные данные сервера");

    runTest('secretMessage: верный пароль', box1("qwerty123"), "Секретный код от сейфа: 777", "Доступ с правильным паролем");
    runTest('secretMessage: неверный пароль', box1("wrongpass"), "Доступ запрещен", "Доступ с некорректным паролем");
    runTest('secretMessage: пустой пароль', box1(""), "Доступ запрещен", "Краевой случай: передача пустой строки");
    runTest('secretMessage: независимость замыканий', box2("admin"), "Конфиденциальные данные сервера", "Изоляция разных экземпляров замыкания");
    runTest('secretMessage: проверка изоляции паролей', box2("qwerty123"), "Доступ запрещен", "Пароль первого объекта не подходит ко второму");

    renderSectionHeader('Часть 3: Рекурсия и функции высшего порядка');

    // Тесты compose
    const add5 = x => x + 5;
    const multiplyBy2 = x => x * 2;
    const square = x => x * x;
    const composedMath = compose(square, multiplyBy2, add5); // ((x + 5) * 2)^2
    runTest('compose(square, multiplyBy2, add5)(3)', composedMath(3), 256, 'Порядок выполнения справа налево: (3+5)*2=16 -> 16^2=256');

    const toUpper = s => s.toUpperCase();
    const exclaim = s => `${s}!`;
    const greet = name => `привет, ${name}`;
    const shoutGreeting = compose(exclaim, toUpper, greet);
    runTest('compose строковых функций', shoutGreeting('мир'), 'ПРИВЕТ, МИР!', 'Последовательная трансформация строки');

    const mult2Args = (a, b) => a * b;
    const add10 = n => n + 10;
    const composeMultiArgs = compose(add10, mult2Args);
    runTest('compose с первой функцией от 2 аргументов', composeMultiArgs(3, 4), 22, 'Первая функция (mult2Args) принимает 2 аргумента: 3*4+10=22');

    runTest('compose одной функции', compose(add5)(10), 15, 'Краевой случай: передача одной функции');
    runTest('compose без аргументов', compose()(99), 99, 'Краевой случай: 0 функций возвращает тождественную функцию');

    // Тесты myMap
    const originalArr = [1, 2, 3, 4];
    const mapped = myMap(originalArr, (x) => x * 3);
    runTest('myMap умножение на 3', mapped, [3, 6, 9, 12], 'Базовое преобразование элементов');
    runTest('myMap иммутабельность', originalArr, [1, 2, 3, 4], 'Краевой случай: исходный массив не изменился');

    const mappedWithIndex = myMap(['a', 'b', 'c'], (char, index) => `${char}_${index}`);
    runTest('myMap доступ к индексу', mappedWithIndex, ['a_0', 'b_1', 'c_2'], 'Передача индекса элемента в callback');

    runTest('myMap пустой массив', myMap([], x => x * 2), [], 'Краевой случай: вызов с пустым массивом');

    // Тесты myFilter
    const numbersToFilter = [1, 2, 3, 4, 5, 6, 7, 8];
    const evens = myFilter(numbersToFilter, x => x % 2 === 0);
    runTest('myFilter четные числа', evens, [2, 4, 6, 8], 'Базовая фильтрация по предикату');
    runTest('myFilter иммутабельность', numbersToFilter, [1, 2, 3, 4, 5, 6, 7, 8], 'Краевой случай: исходный массив не изменился');

    const noneMatched = myFilter([1, 3, 5], x => x % 2 === 0);
    runTest('myFilter ни один не подошел', noneMatched, [], 'Краевой случай: ни один элемент не удовлетворяет условию');

    const allMatched = myFilter([2, 4, 6], x => x % 2 === 0);
    runTest('myFilter все подошли', allMatched, [2, 4, 6], 'Краевой случай: все элементы прошли фильтр');

    runTest('myFilter пустой массив', myFilter([], x => true), [], 'Краевой случай: фильтрация пустого массива');

    // Тесты myReduce
    const sumWithInit = myReduce([1, 2, 3, 4], (acc, x) => acc + x, 10);
    runTest('myReduce с initialValue', sumWithInit, 20, 'Суммирование с начальным значением 10');

    const sumWithoutInit = myReduce([1, 2, 3, 4, 5], (acc, x) => acc + x);
    runTest('myReduce без initialValue', sumWithoutInit, 15, 'Первый элемент используется как аккумулятор');

    const wordCount = myReduce(['яблоко', 'банан', 'яблоко', 'апельсин', 'банан'], (acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});
    runTest('myReduce группировка в объект', wordCount, { 'яблоко': 2, 'банан': 2, 'апельсин': 1 }, 'Построение частотного словаря');

    runTest('myReduce один элемент без initialValue', myReduce([777], (acc, x) => acc + x), 777, 'Массив из одного элемента возвращает его значение');
    runTest('myReduce пустой массив с initialValue', myReduce([], (acc, x) => acc + x, 42), 42, 'Пустой массив с начальным значением');

    let threwErrorOnEmpty = false;
    try {
        myReduce([], (acc, x) => acc + x);
    } catch (e) {
        threwErrorOnEmpty = e instanceof TypeError;
    }
    runTest('myReduce пустой массив без initialValue бросает TypeError', threwErrorOnEmpty, true, 'Краевой случай: соответствие спецификации Array.prototype.reduce');

    renderSectionHeader('Часть 4: Сложно, но важно');

    // Тесты curry
    const sum3 = (a, b, c) => a + b + c;
    const curriedSum3 = curry(sum3);

    runTest('curry вызов по одному аргументу', curriedSum3(1)(2)(3), 6, 'Последовательные вызовы f(1)(2)(3)');
    runTest('curry вызов пачками (1, 2)(3)', curriedSum3(1, 2)(3), 6, 'Частичное применение нескольких аргументов');
    runTest('curry вызов пачками (1)(2, 3)', curriedSum3(1)(2, 3), 6, 'Частичное применение (1)(2, 3)');
    runTest('curry вызов всех сразу (1, 2, 3)', curriedSum3(1, 2, 3), 6, 'Вызов со всеми аргументами сразу f(1, 2, 3)');

    const discountCalculator = (tax, discount, price) => price + (price * tax) - discount;
    const curriedDiscount = curry(discountCalculator);
    const standardTaxApply = curriedDiscount(0.2); // фиксируем налог 20%
    runTest('curry повторное использование частично примененной функции', standardTaxApply(50)(1000), 1150, 'Фиксация первого аргумента и повторное использование');

    // Тесты memoize
    let calcExecutionCount = 0;
    const heavyCalculation = (n) => {
        calcExecutionCount++;
        return n * n;
    };
    const memoizedCalc = memoize(heavyCalculation);

    const firstRun = memoizedCalc(5);
    const secondRun = memoizedCalc(5);
    const thirdRun = memoizedCalc(5);
    runTest('memoize корректность значения', firstRun, 25, 'Первое вычисление вернуло 25');
    runTest('memoize кэширование повторных вызовов', calcExecutionCount, 1, 'Функция выполнилась ровно 1 раз для 3 вызовов с одинаковым аргументом');
    runTest('memoize возврат из кэша', secondRun === 25 && thirdRun === 25, true, 'Последующие вызовы возвращают кэшированный результат');

    const anotherArgRun = memoizedCalc(10);
    runTest('memoize вычисление для нового аргумента', anotherArgRun, 100, 'Новый аргумент вызвал функцию заново');
    runTest('memoize счетчик после нового аргумента', calcExecutionCount, 2, 'Счетчик увеличился до 2');

    // Тесты createValidator
    const passwordValidator = createValidator({
        minLength: 8,
        hasNumbers: true,
        hasUpperCase: true
    });

    runTest('createValidator: корректный надежный пароль', passwordValidator("SuperPass123"), true, 'Длина >= 8, есть заглавная, есть цифра');
    runTest('createValidator: слишком короткий', passwordValidator("Pass1"), false, 'Ошибка: длина меньше 8');
    runTest('createValidator: нет цифр', passwordValidator("SuperPassword"), false, 'Ошибка: отсутствуют цифры');
    runTest('createValidator: нет заглавных букв', passwordValidator("superpass123"), false, 'Ошибка: отсутствуют заглавные буквы');
    runTest('createValidator: кириллица с заглавной и цифрой', passwordValidator("МойПароль2026"), true, 'Поддержка заглавных букв русского алфавита');
    runTest('createValidator: пустая строка', passwordValidator(""), false, 'Краевой случай: пустая строка');
    runTest('createValidator: нестроковый тип (null, число)', passwordValidator(123456789), false, 'Краевой случай: безопасная обработка нестрокового типа');

    const lengthOnlyValidator = createValidator({ minLength: 5 });
    runTest('createValidator: только проверка длины', lengthOnlyValidator("привет"), true, 'Опции без проверки цифр и регистра');

    renderSectionHeader('Асинхронные тесты: debounce и throttle');

    // Тестирование debounce
    await new Promise((resolve) => {
        let debounceCallCount = 0;
        let lastArg = null;
        const debouncedFn = debounce((val) => {
            debounceCallCount++;
            lastArg = val;
        }, 50);

        // Быстрая серия вызовов
        debouncedFn(1);
        debouncedFn(2);
        debouncedFn(3);

        setTimeout(() => {
            runTest('debounce объединение быстрых вызовов', debounceCallCount, 1, 'Функция вызвана ровно 1 раз после задержки');
            runTest('debounce последний переданный аргумент', lastArg, 3, 'Вызов произошел с последним актуальным значением (3)');

            // Проверка cancel
            let cancelledCallCount = 0;
            const cancellableFn = debounce(() => { cancelledCallCount++; }, 50);
            cancellableFn();
            cancellableFn.cancel();

            setTimeout(() => {
                runTest('debounce метод cancel()', cancelledCallCount, 0, 'Вызов успешно отменен до срабатывания таймера');
                resolve();
            }, 70);
        }, 80);
    });

    // Тестирование throttle
    await new Promise((resolve) => {
        let throttleCallCount = 0;
        const recordedArgs = [];
        const throttledFn = throttle((val) => {
            throttleCallCount++;
            recordedArgs.push(val);
        }, 60);

        throttledFn('первый'); // должен вызваться немедленно
        throttledFn('промежуточный_1'); // должен быть отложен
        throttledFn('последний'); // должен обновить отложенный вызов

        runTest('throttle немедленный первый вызов', throttleCallCount, 1, 'Первый вызов срабатывает сразу');
        runTest('throttle аргумент первого вызова', recordedArgs[0], 'первый', 'Первый запуск получил аргумент "первый"');

        setTimeout(() => {
            runTest('throttle отложенный завершающий вызов', throttleCallCount, 2, 'Второй вызов произошел по истечении интервала');
            runTest('throttle аргумент завершающего вызова', recordedArgs[1], 'последний', 'Второй запуск получил самое последнее значение ("последний")');
            resolve();
        }, 90);
    });

    // Итоговый отчет
    renderSummary();
}

// Запуск тестов при загрузке страницы в браузере или сразу в Node.js
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        runAllTests();
    });
} else {
    runAllTests();
}
