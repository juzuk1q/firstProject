
(function runAsyncTestSuite() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTests);
    } else {
        initTests();
    }

    async function initTests() {
        console.log('%c=== ЗАПУСК ТЕСТОВ: АСИНХРОННЫЕ ОПЕРАЦИИ JAVASCRIPT ===', 'color: #3498db; font-weight: bold; font-size: 15px;');

        const testContainer = createTestUiContainer();

        const stats = {
            total: 0,
            passed: 0,
            failed: 0,
            startTime: performance.now()
        };

        function assert(testName, condition, details = {}) {
            stats.total++;
            const isSuccess = Boolean(condition);

            if (isSuccess) {
                stats.passed++;
                console.log(`%c[УСПЕХ] ${testName}`, 'color: #27ae60; font-weight: bold;', details);
            } else {
                stats.failed++;
                console.error(`❌ [ОШИБКА] ${testName}`, details);
            }

            renderTestResult(testContainer, testName, isSuccess);
        }

        console.group('1. Основы промисов (Задача 1)');

        // Резолв промиса
        const resValue = await createBasicPromise(true);
        assert(
            'createBasicPromise(true): успешно резолвится со значением "Успех!"',
            resValue === 'Успех!',
            { resValue }
        );

        // Реджект промиса
        let rejectedMsg = null;
        try {
            await createBasicPromise(false);
        } catch (e) {
            rejectedMsg = e.message;
        }
        assert(
            'createBasicPromise(false): реджектится с сообщением "Ошибка!"',
            rejectedMsg === 'Ошибка!',
            { rejectedMsg }
        );

        // Тест цепочки промисов
        const chainResult = await createPromiseChain();
        assert(
            'createPromiseChain: последовательно передает данные через 3 шага',
            typeof chainResult === 'string' && chainResult.includes('Шаг 3'),
            { chainResult }
        );

        console.groupEnd();

        console.group('2. Async/Await (Задача 2)');

        const asyncRes = await basicAsyncAwait();
        assert(
            'basicAsyncAwait: возвращает результат выполнения через await',
            asyncRes === 'Успех!',
            { asyncRes }
        );

        const caughtAsyncErr = await handleAsyncError();
        assert(
            'handleAsyncError: перехватывает ошибку в try/catch без аварийного падения',
            caughtAsyncErr === 'Ошибка!',
            { caughtAsyncErr }
        );

        const parallelRes = await parallelAsyncExecution();
        assert(
            'parallelAsyncExecution: возвращает массив результатов параллельного выполнения',
            Array.isArray(parallelRes) && parallelRes.length === 3,
            { parallelRes }
        );

        console.groupEnd();

        console.group('3. Работа с внешними API (Задача 3)');

        try {
            const users = await fetchUsers();
            assert(
                'fetchUsers: загружает список пользователей и отрисовывает карточки',
                Array.isArray(users) && users.length > 0 && document.querySelectorAll('#api-data .user-card').length > 0,
                { count: users?.length, cardsRendered: document.querySelectorAll('#api-data .user-card').length }
            );
        } catch (e) {
            assert('fetchUsers: обработка запроса к API', false, { error: e.message });
        }

        try {
            const post = await createPost();
            assert(
                'createPost: отправляет POST запрос и получает подтверждение создания (id = 101)',
                post && (post.id === 101 || post.title.includes('Учебный')),
                { post }
            );
        } catch (e) {
            assert('createPost: POST запрос к API', false, { error: e.message });
        }

        const apiErrResult = await testApiError();
        assert(
            'testApiError: корректно распознает ошибку 404 несуществующего эндпоинта',
            typeof apiErrResult === 'string' && apiErrResult.includes('404'),
            { apiErrResult }
        );

        console.groupEnd();

        console.group('4. Асинхронные таймеры и интервалы (Задача 4)');

        // Проверка delayWithPromise
        const delayStart = performance.now();
        await delayWithPromise(100);
        const delayElapsed = performance.now() - delayStart;
        assert(
            'delayWithPromise: задерживает выполнение минимум на указанное число миллисекунд',
            delayElapsed >= 90,
            { delayElapsed }
        );

        // Проверка старта и остановки интервала
        startAsyncInterval();
        const initialIntId = intervalId;
        startAsyncInterval(); // Повторный вызов не должен дублировать
        assert(
            'startAsyncInterval: защищен от повторного одновременного запуска',
            intervalId === initialIntId && intervalId !== null,
            { intervalId }
        );

        stopAsyncInterval();
        const intervalOutput = document.getElementById('interval-output');
        assert(
            'stopAsyncInterval: останавливает интервал и сбрасывает счетчик в 0',
            intervalId === null && intervalCounter === 0 && intervalOutput.textContent.includes('0'),
            { intervalId, intervalCounter, text: intervalOutput.textContent }
        );

        console.groupEnd();

        console.group('5. Обработка ошибок и Retry (Задача 5)');

        const tryCatchReports = await asyncTryCatch();
        assert(
            'asyncTryCatch: изолированно обрабатывает разные типы ошибок в нескольких блоках',
            Array.isArray(tryCatchReports) && tryCatchReports.length === 4,
            { tryCatchReports }
        );

        const allSettledResults = await handleMultipleErrors();
        assert(
            'handleMultipleErrors: возвращает 4 результата (2 fulfilled, 2 rejected)',
            Array.isArray(allSettledResults) &&
            allSettledResults.filter(r => r.status === 'fulfilled').length === 2 &&
            allSettledResults.filter(r => r.status === 'rejected').length === 2,
            { allSettledResults }
        );

        // Тест retryWithBackoff: успех со второй попытки
        let attemptsCount = 0;
        const retrySuccess = await retryWithBackoff(async (attempt) => {
            attemptsCount++;
            if (attempt < 2) throw new Error('Временный сбой сети');
            return 'Успех после повтора';
        }, 3, 50);

        assert(
            'retryWithBackoff: завершается успешно при восстановлении на последующей попытке',
            retrySuccess === 'Успех после повтора' && attemptsCount === 2,
            { retrySuccess, attemptsCount }
        );

        // Тест retryWithBackoff: исчерпание всех попыток (краевой случай)
        let exhaustedError = null;
        try {
            await retryWithBackoff(async () => {
                throw new Error('Перманентный сбой сервера');
            }, 2, 30);
        } catch (err) {
            exhaustedError = err.message;
        }

        assert(
            'retryWithBackoff (краевой случай): выбрасывает исключение после превышения maxRetries',
            exhaustedError !== null && exhaustedError.includes('исчерпаны'),
            { exhaustedError }
        );

        console.groupEnd();

        console.group('6. Параллельные операции (Задача 6)');

        const allResults = await demonstratePromiseAll();
        assert(
            'demonstratePromiseAll: возвращает массив из 5 параллельно выполненных промисов',
            Array.isArray(allResults) && allResults.length === 5,
            { count: allResults.length }
        );

        const raceWinner = await demonstratePromiseRace();
        assert(
            'demonstratePromiseRace: возвращает результат самого быстрого промиса',
            typeof raceWinner === 'string' && raceWinner.includes('ПОБЕДИТЕЛЬ'),
            { raceWinner }
        );

        const settledResults = await demonstratePromiseAllSettled();
        assert(
            'demonstratePromiseAllSettled: корректно фиксирует результаты всех промисов без падения',
            Array.isArray(settledResults) && settledResults.length === 3,
            { settledResults }
        );

        console.groupEnd();

        console.group('7. Реальные сценарии (Задача 7)');

        // Последовательные связанные запросы
        const seqResult = await sequentialApiRequests();
        assert(
            'sequentialApiRequests: успешно связывает User -> Posts -> Comments в цепочку',
            seqResult && seqResult.step1_User && seqResult.step2_FirstPostTitle && seqResult.step3_CommentsCount > 0,
            { seqResult }
        );

        // Тест симуляции загрузки
        const uploadResult = await simulateFileUpload();
        const progressFill = document.getElementById('progress-fill');
        assert(
            'simulateFileUpload: доводит прогресс загрузки файла до 100%',
            uploadResult === true && progressFill.style.width === '100%',
            { progressWidth: progressFill.style.width }
        );

        // Тест кэширования запросов
        const testCache = createRequestCache();
        const urlToTest = 'https://jsonplaceholder.typicode.com/todos/2';

        const req1 = await testCache(urlToTest);
        const req2 = await testCache(urlToTest);

        assert(
            'createRequestCache: первый запрос выполняет сетевой вызов (fromCache: false)',
            req1.fromCache === false && req1.data && req1.data.id === 2,
            { req1 }
        );

        assert(
            'createRequestCache: повторный запрос с тем же URL берет результат из кэша (fromCache: true)',
            req2.fromCache === true && req2.data.id === 2,
            { req2 }
        );

        console.groupEnd();

        renderSummaryBanner(testContainer, stats);
    }

    function createTestUiContainer() {
        let section = document.getElementById('test-results-container');
        if (!section) {
            section = document.createElement('section');
            section.id = 'test-results-container';
            section.className = 'task-area';
            section.innerHTML = `
                <h3>Результаты автоматических тестов (async-tests.js)</h3>
                <div id="test-summary-header"></div>
                <div id="test-list-results"></div>
            `;
            const tasksSection = document.getElementById('tasks-section');
            if (tasksSection) {
                tasksSection.parentNode.insertBefore(section, tasksSection.nextSibling);
            } else {
                document.body.appendChild(section);
            }
        }
        return section;
    }

    function renderTestResult(container, testName, isSuccess) {
        const listResults = container.querySelector('#test-list-results');
        if (!listResults) return;

        const el = document.createElement('div');
        el.className = `test-result ${isSuccess ? 'test-success' : 'test-failure'}`;
        el.innerHTML = `
            <strong>${isSuccess ? 'УСПЕХ' : '[X] ОШИБКА'}:</strong> ${escapeHtml(testName)}
        `;
        listResults.appendChild(el);
    }

    function renderSummaryBanner(container, stats) {
        const header = container.querySelector('#test-summary-header');
        if (!header) return;

        const duration = (performance.now() - stats.startTime).toFixed(1);
        const allPassed = stats.failed === 0;

        header.innerHTML = `
            <div style="padding: 12px; margin-bottom: 12px; border-radius: 6px; font-weight: bold; background: ${allPassed ? '#d4edda' : '#f8d7da'}; color: ${allPassed ? '#155724' : '#721c24'};">
                ${allPassed ? 'Все тесты успешно пройдены.' : 'Обнаружены непройденные тесты!'}
                (Всего тестов: ${stats.total}, Пройдено: ${stats.passed}, Ошибок: ${stats.failed}, Время: ${duration} мс)
            </div>
        `;

        console.log(
            `%c=== ИТОГИ ТЕСТОВ: ${stats.passed}/${stats.total} пройдено (${duration} мс) ===`,
            `color: ${allPassed ? '#27ae60' : '#e74c3c'}; font-weight: bold; font-size: 15px;`
        );
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
})();
