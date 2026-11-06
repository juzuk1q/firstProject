// Функция для вывода результатов с форматированием
function displayOutput(elementId, data, isError = false) {
    const output = document.getElementById(elementId);
    if (!output) return;

    const timestamp = new Date().toLocaleTimeString();
    const content = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);

    output.innerHTML = `[${timestamp}] ${content}`;
    output.className = `output ${isError ? 'error' : 'success'}`;
}

// Функция для обновления прогресс-бара
function updateProgress(percentage) {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
}

// Функция для добавления спиннера загрузки
function setLoadingState(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    if (isLoading) {
        button.disabled = true;
        button.setAttribute('data-original-text', button.textContent);
        button.innerHTML = '<span class="spinner"></span> Загрузка...';
    } else {
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text');
        button.innerHTML = originalText || button.textContent;
    }
}

// 1.1. Создайте функцию createBasicPromise, которая возвращает промис
function createBasicPromise(shouldResolve = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldResolve) {
                resolve('Успех!');
            } else {
                reject(new Error('Ошибка!'));
            }
        }, 1000);
    });
}

// 1.2. Создайте функцию handleBasicPromise, которая обрабатывает промис
function handleBasicPromise() {
    setLoadingState('basic-promise', true);
    displayOutput('promise-output', 'Ожидание выполнения промиса (1 сек)...');

    return createBasicPromise(true)
        .then((result) => {
            displayOutput('promise-output', `Результат .then: ${result}`);
            return result;
        })
        .catch((error) => {
            displayOutput('promise-output', `Ошибка: ${error.message}`, true);
        })
        .finally(() => {
            setLoadingState('basic-promise', false);
        });
}

// 1.3. Создайте функцию createPromiseChain, которая демонстрирует цепочку промисов
function createPromiseChain() {
    setLoadingState('promise-chain', true);
    displayOutput('promise-output', 'Запуск цепочки промисов...');

    const step = (message, delay = 500) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(message), delay);
        });
    };

    return step('Шаг 1: Инициализация')
        .then((res1) => {
            displayOutput('promise-output', `${res1} завершен! Переход к шагу 2...`);
            return step(`${res1} -> Шаг 2: Обработка данных`);
        })
        .then((res2) => {
            displayOutput('promise-output', `${res2} завершен! Переход к шагу 3...`);
            return step(`${res2} -> Шаг 3: Сохранение результата`);
        })
        .then((finalResult) => {
            displayOutput('promise-output', `Цепочка завершена: ${finalResult}`);
            return finalResult;
        })
        .catch((err) => {
            displayOutput('promise-output', `Сбой в цепочке: ${err.message}`, true);
        })
        .finally(() => {
            setLoadingState('promise-chain', false);
        });
}

// 1.4. Создайте функцию handlePromiseError, которая обрабатывает ошибки в промисах
function handlePromiseError() {
    setLoadingState('promise-error', true);
    displayOutput('promise-output', 'Запуск промиса, который завершится ошибкой...');

    return createBasicPromise(false)
        .then((result) => {
            displayOutput('promise-output', `Неожиданный успех: ${result}`);
        })
        .catch((error) => {
            displayOutput('promise-output', `Поймана ошибка через .catch(): ${error.message}`, true);
            return error.message;
        })
        .finally(() => {
            setLoadingState('promise-error', false);
        });
}

// 1.5. Создайте функцию setupPromiseEvents, которая настраивает обработчики
function setupPromiseEvents() {
    const basicBtn = document.getElementById('basic-promise');
    const chainBtn = document.getElementById('promise-chain');
    const errorBtn = document.getElementById('promise-error');

    if (basicBtn) basicBtn.addEventListener('click', handleBasicPromise);
    if (chainBtn) chainBtn.addEventListener('click', createPromiseChain);
    if (errorBtn) errorBtn.addEventListener('click', handlePromiseError);
}

// 2.1. Создайте функцию basicAsyncAwait, которая использует async/await
async function basicAsyncAwait() {
    setLoadingState('basic-async', true);
    displayOutput('async-output', 'Ожидание через async/await...');

    try {
        const result = await createBasicPromise(true);
        await delayWithPromise(300); // Дополнительная задержка перед выводом
        displayOutput('async-output', `Результат async/await: ${result}`);
        return result;
    } catch (err) {
        displayOutput('async-output', `Ошибка: ${err.message}`, true);
    } finally {
        setLoadingState('basic-async', false);
    }
}

// 2.2. Создайте функцию handleAsyncError с try/catch
async function handleAsyncError() {
    setLoadingState('async-error', true);
    displayOutput('async-output', 'Выполнение с отловом ошибки в try/catch...');

    try {
        const res = await createBasicPromise(false);
        displayOutput('async-output', `Успех: ${res}`);
    } catch (error) {
        displayOutput('async-output', `Ошибка успешно перехвачена в блоке catch: ${error.message}`, true);
        return error.message;
    } finally {
        setLoadingState('async-error', false);
    }
}

// 2.3. Создайте функцию parallelAsyncExecution для параллельного выполнения
async function parallelAsyncExecution() {
    setLoadingState('async-parallel', true);
    displayOutput('async-output', 'Параллельный запуск 3 промисов...');

    const startTime = performance.now();
    try {
        const p1 = delayWithPromise(600).then(() => 'Операция 1 (600мс)');
        const p2 = delayWithPromise(800).then(() => 'Операция 2 (800мс)');
        const p3 = delayWithPromise(500).then(() => 'Операция 3 (500мс)');

        const results = await Promise.all([p1, p2, p3]);
        const elapsed = (performance.now() - startTime).toFixed(1);

        displayOutput('async-output', {
            message: 'Все промисы параллельно завершены!',
            results: results,
            totalTimeMs: `${elapsed} мс (вместо последовательных 1900 мс)`
        });
        return results;
    } catch (err) {
        displayOutput('async-output', `Ошибка параллельного выполнения: ${err.message}`, true);
    } finally {
        setLoadingState('async-parallel', false);
    }
}

// 2.4. Создайте функцию setupAsyncEvents, которая настраивает обработчики
function setupAsyncEvents() {
    const basicAsyncBtn = document.getElementById('basic-async');
    const asyncErrorBtn = document.getElementById('async-error');
    const asyncParallelBtn = document.getElementById('async-parallel');

    if (basicAsyncBtn) basicAsyncBtn.addEventListener('click', basicAsyncAwait);
    if (asyncErrorBtn) asyncErrorBtn.addEventListener('click', handleAsyncError);
    if (asyncParallelBtn) asyncParallelBtn.addEventListener('click', parallelAsyncExecution);
}

// 3.1. Создайте функцию fetchUsers, которая загружает пользователей с JSONPlaceholder API
async function fetchUsers() {
    const dataContainer = document.getElementById('api-data');
    setLoadingState('fetch-users', true);
    displayOutput('api-output', 'Отправка GET-запроса на получение пользователей...');

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error(`HTTP ошибка: статус ${response.status}`);
        }
        const users = await response.json();

        if (dataContainer) {
            dataContainer.innerHTML = '';
            users.slice(0, 6).forEach(user => {
                const card = document.createElement('div');
                card.className = 'user-card';
                card.innerHTML = `
                    <h4>${user.name} (@${user.username})</h4>
                    <p>📧 Email: ${user.email}</p>
                    <p>🏢 Компания: ${user.company.name}</p>
                    <p>🌐 Сайт: ${user.website}</p>
                `;
                dataContainer.appendChild(card);
            });
        }

        displayOutput('api-output', `Успешно загружено ${users.length} пользователей (первые 6 выведены ниже)`);
        return users;
    } catch (error) {
        displayOutput('api-output', `Не удалось загрузить пользователей: ${error.message}`, true);
    } finally {
        setLoadingState('fetch-users', false);
    }
}

// 3.2. Создайте функцию createPost, которая отправляет POST запрос
async function createPost() {
    setLoadingState('fetch-post', true);
    displayOutput('api-output', 'Отправка POST-запроса на создание поста...');

    const newPostData = {
        title: 'Учебный пост по асинхронному JavaScript',
        body: 'Изучаем fetch, async/await и отправку JSON на сервер.',
        userId: 1
    };

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(newPostData),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP статус: ${response.status}`);
        }

        const createdPost = await response.json();
        displayOutput('api-output', {
            status: 'Пост успешно создан на сервере (код 201 Created)!',
            responseData: createdPost
        });
        return createdPost;
    } catch (error) {
        displayOutput('api-output', `Ошибка при отправке POST: ${error.message}`, true);
    } finally {
        setLoadingState('fetch-post', false);
    }
}

// 3.3. Создайте функцию testApiError, которая тестирует обработку ошибок API
async function testApiError() {
    setLoadingState('fetch-error', true);
    displayOutput('api-output', 'Выполнение запроса к заведомо несуществующему адресу...');

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/non-existent-endpoint-404-test');
        if (!response.ok) {
            throw new Error(`Ошибка API [HTTP ${response.status} ${response.statusText || 'Not Found'}]`);
        }
        const data = await response.json();
        displayOutput('api-output', data);
    } catch (error) {
        displayOutput('api-output', `Обработана ошибка запроса: ${error.message}`, true);
        return error.message;
    } finally {
        setLoadingState('fetch-error', false);
    }
}

// 3.4. Создайте функцию setupApiEvents, которая настраивает обработчики API
function setupApiEvents() {
    const fetchUsersBtn = document.getElementById('fetch-users');
    const fetchPostBtn = document.getElementById('fetch-post');
    const fetchErrorBtn = document.getElementById('fetch-error');

    if (fetchUsersBtn) fetchUsersBtn.addEventListener('click', fetchUsers);
    if (fetchPostBtn) fetchPostBtn.addEventListener('click', createPost);
    if (fetchErrorBtn) fetchErrorBtn.addEventListener('click', testApiError);
}

let intervalId = null;
let intervalCounter = 0;

// 4.1. Создайте функцию startAsyncInterval, которая запускает асинхронный интервал
async function startAsyncInterval() {
    if (intervalId !== null) return; // Защита от повторного запуска

    const output = document.getElementById('interval-output');
    intervalId = setInterval(async () => {
        intervalCounter++;
        // Асинхронное обновление
        await delayWithPromise(10);
        if (output) {
            output.textContent = `Интервал: ${intervalCounter}`;
        }
    }, 1000);
}

// 4.2. Создайте функцию stopAsyncInterval, которая останавливает интервал
function stopAsyncInterval() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    intervalCounter = 0;
    const output = document.getElementById('interval-output');
    if (output) {
        output.textContent = 'Интервал: 0';
    }
}

// 4.3. Создайте функцию delayWithPromise, которая создает задержку с промисом
function delayWithPromise(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// 4.4. Создайте функцию testDelay, которая тестирует задержку
async function testDelay() {
    const timerOutput = document.getElementById('timer-output');
    setLoadingState('delay-promise', true);

    if (timerOutput) timerOutput.textContent = 'Таймер: старт цепочки задержек...';

    await delayWithPromise(600);
    if (timerOutput) timerOutput.textContent = 'Таймер: прошло 600 мс (1/3)';

    await delayWithPromise(600);
    if (timerOutput) timerOutput.textContent = 'Таймер: прошло 1200 мс (2/3)';

    await delayWithPromise(600);
    if (timerOutput) timerOutput.textContent = 'Таймер: завершено успешно (1800 мс)!';

    setLoadingState('delay-promise', false);
}

// 4.5. Создайте функцию setupTimerEvents, которая настраивает обработчики таймеров
function setupTimerEvents() {
    const startBtn = document.getElementById('start-interval');
    const stopBtn = document.getElementById('stop-interval');
    const delayBtn = document.getElementById('delay-promise');

    if (startBtn) startBtn.addEventListener('click', startAsyncInterval);
    if (stopBtn) stopBtn.addEventListener('click', stopAsyncInterval);
    if (delayBtn) delayBtn.addEventListener('click', testDelay);
}

// 5.1. Создайте функцию asyncTryCatch, которая демонстрирует try/catch с async
async function asyncTryCatch() {
    displayOutput('error-output', 'Выполнение операций с вложенными try/catch блоками...');

    let report = [];

    // Блок 1: Локальный перехват
    try {
        report.push('Блок 1: попытка выполнить деление на ноль в проверке...');
        await delayWithPromise(200);
        throw new RangeError('Недопустимый диапазон значений параметра');
    } catch (e) {
        report.push(`Блок 1 перехватил ${e.name}: ${e.message}`);
    }

    // Блок 2: Продолжение работы программы после первой ошибки
    try {
        report.push('Блок 2: критическая сетевая операция...');
        await delayWithPromise(200);
        throw new TypeError('Некорректный тип данных ответа');
    } catch (e) {
        report.push(`Блок 2 перехватил ${e.name}: ${e.message}`);
    }

    displayOutput('error-output', report.join('\n'));
    return report;
}

// 5.2. Создайте функцию handleMultipleErrors, которая обрабатывает множественные ошибки
async function handleMultipleErrors() {
    displayOutput('error-output', 'Запуск нескольких задач через Promise.allSettled...');

    const tasks = [
        delayWithPromise(200).then(() => 'Задача A: выполнена'),
        delayWithPromise(300).then(() => { throw new Error('Задача B: сбой сети'); }),
        delayWithPromise(150).then(() => 'Задача C: выполнена'),
        delayWithPromise(250).then(() => { throw new Error('Задача D: таймаут'); })
    ];

    const results = await Promise.allSettled(tasks);

    const fulfilled = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const rejected = results.filter(r => r.status === 'rejected').map(r => r.reason.message);

    displayOutput('error-output', {
        summary: `Всего задач: ${results.length}. Успешно: ${fulfilled.length}, С ошибками: ${rejected.length}`,
        fulfilledTasks: fulfilled,
        rejectedErrors: rejected
    });

    return results;
}

// 5.3. Создайте функцию retryWithBackoff, которая реализует повторные попытки
async function retryWithBackoff(operation, maxRetries = 3, baseDelay = 300) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation(attempt);
        } catch (error) {
            lastError = error;
            if (attempt === maxRetries) {
                break;
            }
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.warn(`Попытка ${attempt} не удалась (${error.message}). Повтор через ${delay}мс...`);
            await delayWithPromise(delay);
        }
    }

    throw new Error(`Все ${maxRetries} попытки исчерпаны. Последняя ошибка: ${lastError.message}`);
}

// 5.4. Создайте функцию setupErrorEvents, которая настраивает обработчики ошибок
function setupErrorEvents() {
    const tryCatchBtn = document.getElementById('try-catch');
    const multiErrorsBtn = document.getElementById('multiple-errors');
    const retryBtn = document.getElementById('retry-pattern');

    if (tryCatchBtn) tryCatchBtn.addEventListener('click', asyncTryCatch);
    if (multiErrorsBtn) multiErrorsBtn.addEventListener('click', handleMultipleErrors);

    if (retryBtn) {
        retryBtn.addEventListener('click', async () => {
            setLoadingState('retry-pattern', true);
            displayOutput('error-output', 'Запуск операции с повторными попытками (Exponential Backoff)...');

            let attemptsMade = 0;
            const unstableOperation = async (attempt) => {
                attemptsMade++;
                if (attempt < 3) {
                    throw new Error(`Временный сбой на попытке #${attempt}`);
                }
                return `Успех достигнут на попытке #${attempt}!`;
            };

            try {
                const res = await retryWithBackoff(unstableOperation, 3, 200);
                displayOutput('error-output', `Результат Retry-паттерна: ${res}`);
            } catch (err) {
                displayOutput('error-output', err.message, true);
            } finally {
                setLoadingState('retry-pattern', false);
            }
        });
    }
}

// 6.1. Создайте функцию demonstratePromiseAll, которая использует Promise.all
async function demonstratePromiseAll() {
    setLoadingState('promise-all', true);
    displayOutput('parallel-output', 'Выполнение 5 параллельных промисов через Promise.all...');

    const startTime = performance.now();
    const promises = [
        delayWithPromise(300).then(() => 'Данные профиля (300мс)'),
        delayWithPromise(500).then(() => 'Список друзей (500мс)'),
        delayWithPromise(200).then(() => 'Сообщения (200мс)'),
        delayWithPromise(400).then(() => 'Уведомления (400мс)'),
        delayWithPromise(600).then(() => 'Настройки (600мс)')
    ];

    try {
        const results = await Promise.all(promises);
        const elapsed = (performance.now() - startTime).toFixed(1);

        displayOutput('parallel-output', {
            type: 'Promise.all (ждёт завершения ВСЕХ промисов)',
            totalTime: `${elapsed} мс (равно времени самого долгого промиса: ~600мс)`,
            results: results
        });
        return results;
    } catch (e) {
        displayOutput('parallel-output', `Promise.all завершился ошибкой: ${e.message}`, true);
    } finally {
        setLoadingState('promise-all', false);
    }
}

// 6.2. Создайте функцию demonstratePromiseRace, которая использует Promise.race
async function demonstratePromiseRace() {
    setLoadingState('promise-race', true);
    displayOutput('parallel-output', 'Гонка промисов (Promise.race)...');

    const startTime = performance.now();
    const promises = [
        delayWithPromise(800).then(() => 'Сервер США (800мс)'),
        delayWithPromise(250).then(() => 'Сервер Европа (250мс - ПОБЕДИТЕЛЬ)'),
        delayWithPromise(600).then(() => 'Сервер Азия (600мс)')
    ];

    try {
        const winner = await Promise.race(promises);
        const elapsed = (performance.now() - startTime).toFixed(1);

        displayOutput('parallel-output', {
            type: 'Promise.race (возвращает ПЕРВЫЙ завершившийся результат)',
            winner: winner,
            timeElapsed: `${elapsed} мс`
        });
        return winner;
    } catch (e) {
        displayOutput('parallel-output', `Ошибка в гонке: ${e.message}`, true);
    } finally {
        setLoadingState('promise-race', false);
    }
}

// 6.3. Создайте функцию demonstratePromiseAllSettled, которая использует Promise.allSettled
async function demonstratePromiseAllSettled() {
    setLoadingState('promise-allSettled', true);
    displayOutput('parallel-output', 'Анализ работы Promise.allSettled со смешанными результатами...');

    const promises = [
        delayWithPromise(200).then(() => 'Успешный сервис 1'),
        delayWithPromise(300).then(() => { throw new Error('Сервис 2 упал'); }),
        delayWithPromise(150).then(() => 'Успешный сервис 3')
    ];

    const results = await Promise.allSettled(promises);
    displayOutput('parallel-output', {
        type: 'Promise.allSettled (никогда не реджектится целиком)',
        outcomes: results.map(r => ({
            status: r.status,
            data: r.status === 'fulfilled' ? r.value : r.reason.message
        }))
    });

    setLoadingState('promise-allSettled', false);
    return results;
}

// 6.4. Создайте функцию setupParallelEvents, которая настраивает обработчики
function setupParallelEvents() {
    const allBtn = document.getElementById('promise-all');
    const raceBtn = document.getElementById('promise-race');
    const allSettledBtn = document.getElementById('promise-allSettled');

    if (allBtn) allBtn.addEventListener('click', demonstratePromiseAll);
    if (raceBtn) raceBtn.addEventListener('click', demonstratePromiseRace);
    if (allSettledBtn) allSettledBtn.addEventListener('click', demonstratePromiseAllSettled);
}

// 7.1. Создайте функцию sequentialApiRequests, которая делает последовательные запросы
async function sequentialApiRequests() {
    setLoadingState('sequential-requests', true);
    displayOutput('scenario-output', 'Выполнение цепочки связанных запросов: Пользователь -> Посты -> Комментарии...');

    try {
        // Шаг 1: Получаем пользователя
        const userRes = await fetch('https://jsonplaceholder.typicode.com/users/1');
        const user = await userRes.json();

        // Шаг 2: Получаем посты пользователя
        const postsRes = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
        const posts = await postsRes.json();
        const firstPost = posts[0];

        // Шаг 3: Получаем комментарии к первому посту
        const commentsRes = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${firstPost.id}`);
        const comments = await commentsRes.json();

        const chainSummary = {
            step1_User: `${user.name} (${user.email})`,
            step2_FirstPostTitle: firstPost.title,
            step3_CommentsCount: comments.length,
            firstCommentSample: comments[0]?.body?.slice(0, 80) + '...'
        };

        displayOutput('scenario-output', chainSummary);
        return chainSummary;
    } catch (err) {
        displayOutput('scenario-output', `Ошибка последовательных запросов: ${err.message}`, true);
    } finally {
        setLoadingState('sequential-requests', false);
    }
}

// 7.2. Создайте функцию simulateFileUpload, которая симулирует загрузку файла
async function simulateFileUpload() {
    setLoadingState('upload-simulation', true);
    displayOutput('scenario-output', 'Симуляция отправки файла на сервер...');
    updateProgress(0);

    return new Promise((resolve) => {
        let percent = 0;
        const interval = setInterval(() => {
            percent += 10;
            updateProgress(percent);
            displayOutput('scenario-output', `Загрузка файла: ${percent}%`);

            if (percent >= 100) {
                clearInterval(interval);
                displayOutput('scenario-output', '🎉 Файл успешно загружен на 100%!');
                setLoadingState('upload-simulation', false);
                resolve(true);
            }
        }, 100);
    });
}

// 7.3. Создайте функцию createRequestCache, которая кэширует результаты запросов
function createRequestCache() {
    const cache = new Map();

    return async function cachedRequest(url) {
        if (cache.has(url)) {
            return { data: cache.get(url), fromCache: true };
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка запроса: статус ${response.status}`);
        }
        const data = await response.json();
        cache.set(url, data);
        return { data: data, fromCache: false };
    };
}

const apiCacheInstance = createRequestCache();

// 7.4. Создайте функцию setupRealScenarioEvents, которая настраивает обработчики
function setupRealScenarioEvents() {
    const seqBtn = document.getElementById('sequential-requests');
    const uploadBtn = document.getElementById('upload-simulation');
    const cacheBtn = document.getElementById('cache-requests');

    if (seqBtn) seqBtn.addEventListener('click', sequentialApiRequests);
    if (uploadBtn) uploadBtn.addEventListener('click', simulateFileUpload);

    if (cacheBtn) {
        cacheBtn.addEventListener('click', async () => {
            setLoadingState('cache-requests', true);
            const targetUrl = 'https://jsonplaceholder.typicode.com/todos/1';

            try {
                const startTime = performance.now();
                const result = await apiCacheInstance(targetUrl);
                const elapsed = (performance.now() - startTime).toFixed(1);

                displayOutput('scenario-output', {
                    url: targetUrl,
                    fromCache: result.fromCache ? 'из кэша' : 'сетевой запрос выполнен',
                    timeMs: `${elapsed} мс`,
                    todo: result.data
                });
            } catch (e) {
                displayOutput('scenario-output', `Ошибка кэширования: ${e.message}`, true);
            } finally {
                setLoadingState('cache-requests', false);
            }
        });
    }
}

function initializeAsyncOperations() {
    setupPromiseEvents();
    setupAsyncEvents();
    setupApiEvents();
    setupTimerEvents();
    setupErrorEvents();
    setupParallelEvents();
    setupRealScenarioEvents();

    console.log('Все асинхронные обработчики инициализированы!');
}

// Запуск инициализации когда DOM загружен
document.addEventListener('DOMContentLoaded', initializeAsyncOperations);
