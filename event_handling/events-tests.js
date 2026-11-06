(function runEventsTestSuite() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTests);
    } else {
        initTests();
    }

    async function initTests() {
        console.log('%c=== ЗАПУСК ТЕСТОВ: ОБРАБОТКА СОБЫТИЙ JAVASCRIPT ===', 'color: #3498db; font-weight: bold; font-size: 15px;');

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
                console.log(`%c✅ [УСПЕХ] ${testName}`, 'color: #27ae60; font-weight: bold;', details);
            } else {
                stats.failed++;
                console.error(`❌ [ОШИБКА] ${testName}`, details);
            }

            renderTestResult(testContainer, testName, isSuccess);
        }

        console.group('1. Базовые обработчики событий (Задача 1)');

        const basicBtn = document.getElementById('basic-btn');
        const basicOutput = document.getElementById('basic-output');
        const colorBox = document.getElementById('color-box');
        const mouseOutput = document.getElementById('mouse-output');

        // Тест клика basicBtn
        basicBtn.click();
        assert(
            'handleBasicClick: выводит тип события, координаты и целевой элемент',
            basicOutput.textContent.includes('click') && basicOutput.textContent.includes('button'),
            { outputText: basicOutput.textContent }
        );

        assert(
            'handleBasicClick: добавляет анимационный класс "pulse"',
            basicBtn.classList.contains('pulse'),
            { btnClasses: basicBtn.className }
        );

        // Тест mouseenter на colorBox
        colorBox.dispatchEvent(new MouseEvent('mouseenter'));
        assert(
            'handleMouseEvents (mouseenter): меняет фон на #e74c3c',
            colorBox.style.background.includes('rgb(231, 76, 60)') || colorBox.style.background.includes('#e74c3c'),
            { currentBg: colorBox.style.background }
        );

        // Тест mouseleave на colorBox
        colorBox.dispatchEvent(new MouseEvent('mouseleave'));
        assert(
            'handleMouseEvents (mouseleave): возвращает исходный фон #3498db',
            colorBox.style.background.includes('rgb(52, 152, 219)') || colorBox.style.background.includes('#3498db'),
            { currentBg: colorBox.style.background }
        );

        // Тест mousemove на colorBox
        colorBox.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 85 }));
        assert(
            'handleMouseEvents (mousemove): обновляет координаты курсора',
            mouseOutput.textContent.includes('Координаты мыши:'),
            { mouseText: mouseOutput.textContent }
        );

        console.groupEnd();

        console.group('2. События клавиатуры и хоткеи (Задача 2)');

        const keyInput = document.getElementById('key-input');
        const keyOutput = document.getElementById('key-output');

        // Обычный ввод клавиши
        const regularKeyEvt = new KeyboardEvent('keydown', { key: 'q', code: 'KeyQ' });
        keyInput.dispatchEvent(regularKeyEvt);
        assert(
            'handleKeyEvents: корректно отображает информацию об обычной клавише',
            keyOutput.textContent.includes('key: "q"') && keyOutput.textContent.includes('code: "KeyQ"'),
            { keyOutputText: keyOutput.textContent }
        );

        // Комбинация Ctrl + S
        const ctrlSEvt = new KeyboardEvent('keydown', { key: 's', code: 'KeyS', ctrlKey: true, cancelable: true });
        keyInput.dispatchEvent(ctrlSEvt);
        assert(
            'handleKeyEvents: перехватывает Ctrl+S и предотвращает дефолтное действие',
            ctrlSEvt.defaultPrevented && keyOutput.textContent.includes('Ctrl + S'),
            { defaultPrevented: ctrlSEvt.defaultPrevented, text: keyOutput.textContent }
        );

        // Комбинация Alt + C
        const altCEvt = new KeyboardEvent('keydown', { key: 'c', code: 'KeyC', altKey: true, cancelable: true });
        keyInput.dispatchEvent(altCEvt);
        assert(
            'handleKeyEvents: перехватывает Alt+C',
            altCEvt.defaultPrevented && keyOutput.textContent.includes('Alt + C'),
            { defaultPrevented: altCEvt.defaultPrevented }
        );

        // Комбинация Shift + A
        const shiftAEvt = new KeyboardEvent('keydown', { key: 'A', code: 'KeyA', shiftKey: true, cancelable: true });
        keyInput.dispatchEvent(shiftAEvt);
        assert(
            'handleKeyEvents: перехватывает Shift+A',
            shiftAEvt.defaultPrevented && keyOutput.textContent.includes('Shift + A'),
            { defaultPrevented: shiftAEvt.defaultPrevented }
        );

        console.groupEnd();

        console.group('3. Делегирование событий (Задача 3)');

        const itemList = document.getElementById('item-list');
        const addItemBtn = document.getElementById('add-item-btn');
        const delegationOutput = document.getElementById('delegation-output');

        const initialItemsCount = itemList.querySelectorAll('.item').length;
        const firstItem = itemList.querySelector('.item');

        // Клик по элементу для выбора/снятия выбора
        firstItem.click();
        assert(
            'handleDelegationClick: добавляет класс "selected" при клике на элемент',
            firstItem.classList.contains('selected') && delegationOutput.textContent.includes('1'),
            { isSelected: firstItem.classList.contains('selected'), output: delegationOutput.textContent }
        );

        firstItem.click();
        assert(
            'handleDelegationClick: снимает класс "selected" при повторном клике',
            !firstItem.classList.contains('selected'),
            { isSelected: firstItem.classList.contains('selected') }
        );

        // Добавление нового элемента
        addItemBtn.click();
        const updatedCount = itemList.querySelectorAll('.item').length;
        const newlyAddedItem = itemList.lastElementChild;

        assert(
            'addNewItem: добавляет новый элемент в список с уникальным data-id',
            updatedCount === initialItemsCount + 1 && newlyAddedItem.hasAttribute('data-id'),
            { newId: newlyAddedItem.getAttribute('data-id'), count: updatedCount }
        );

        // Удаление элемента через крестик (делегирование)
        const deleteSpan = newlyAddedItem.querySelector('.delete');
        deleteSpan.click();
        const afterDeleteCount = itemList.querySelectorAll('.item').length;

        assert(
            'handleDelegationClick: удаляет элемент при клике на крестик .delete',
            afterDeleteCount === initialItemsCount,
            { afterDeleteCount }
        );

        console.groupEnd();

        console.group('4. Предотвращение поведения (Задача 4)');

        const preventLink = document.getElementById('prevent-link');
        const preventForm = document.getElementById('prevent-form');
        const preventionOutput = document.getElementById('prevention-output');

        // Клик по ссылке
        const linkClickEvt = new MouseEvent('click', { cancelable: true });
        preventLink.dispatchEvent(linkClickEvt);

        assert(
            'preventLinkDefault: предотвращает переход по ссылке (preventDefault)',
            linkClickEvt.defaultPrevented && preventionOutput.textContent.includes('предотвращен'),
            { defaultPrevented: linkClickEvt.defaultPrevented }
        );

        assert(
            'preventLinkDefault: добавляет анимационный класс "shake"',
            preventLink.classList.contains('shake'),
            { classes: preventLink.className }
        );

        // Отправка пустой формы
        const formInput = preventForm.querySelector('input[type="text"]');
        formInput.value = '';
        const emptySubmitEvt = new Event('submit', { cancelable: true });
        preventForm.dispatchEvent(emptySubmitEvt);

        assert(
            'preventFormSubmit: блокирует отправку пустой формы и выводит ошибку',
            emptySubmitEvt.defaultPrevented && preventionOutput.textContent.includes('не должно быть пустым'),
            { outputText: preventionOutput.textContent }
        );

        // Отправка формы с данными
        formInput.value = 'Секретные данные';
        const validSubmitEvt = new Event('submit', { cancelable: true });
        preventForm.dispatchEvent(validSubmitEvt);

        assert(
            'preventFormSubmit: перехватывает валидные данные формы',
            validSubmitEvt.defaultPrevented && preventionOutput.textContent.includes('Секретные данные'),
            { outputText: preventionOutput.textContent }
        );

        console.groupEnd();

        console.group('5. Кастомные события (Задача 5)');

        const triggerCustomBtn = document.getElementById('trigger-custom');
        const customOutput = document.getElementById('custom-output');

        triggerCustomBtn.click();
        assert(
            'triggerCustomEvent + handleCustomEvent: перехватывает событие customAction и читает detail.message',
            customOutput.textContent.includes('Привет от кастомного события!'),
            { customText: customOutput.textContent }
        );

        let listenerCalled = false;
        document.addEventListener('customAction', (e) => {
            if (e.detail?.message) listenerCalled = true;
        }, { once: true });

        triggerCustomEvent();
        assert(
            'triggerCustomEvent: корректно диспетчеризирует CustomEvent с параметрами bubbles: true',
            listenerCalled === true,
            { listenerCalled }
        );

        console.groupEnd();

        console.group('6. События загрузки и ошибок (Задача 6)');

        const imageContainer = document.getElementById('image-container');
        const loadingOutput = document.getElementById('loading-output');

        // Вызов симуляции ошибки
        simulateLoadError();
        const brokenImg = imageContainer.querySelector('img');
        assert(
            'simulateLoadError: создает изображение с ошибочным URL и выставляет статус загрузки',
            brokenImg !== null && loadingOutput.textContent.includes('Запрос к несуществующему ресурсу'),
            { imgSrc: brokenImg?.src }
        );

        // Симулируем событие ошибки на изображении
        brokenImg.dispatchEvent(new Event('error'));
        assert(
            'simulateLoadError: обработчик error добавляет класс контейнеру "error"',
            imageContainer.classList.contains('error') && loadingOutput.textContent.includes('Ошибка'),
            { containerClasses: imageContainer.className, outputText: loadingOutput.textContent }
        );

        console.groupEnd();

        console.group('7. Таймеры, Debounce и Throttle (Задача 7)');

        // Тест таймера: запуск и остановка
        startTimer();
        const activeInterval = timerInterval;
        startTimer(); // Повторный вызов не должен плодить интервалы
        assert(
            'startTimer: запрещает множественный запуск интервала',
            timerInterval === activeInterval && timerInterval !== null,
            { intervalId: timerInterval }
        );

        stopTimer();
        const timerOutput = document.getElementById('timer-output');
        assert(
            'stopTimer: корректно сбрасывает interval и значение счетчика в 0',
            timerInterval === null && timerValue === 0 && timerOutput.textContent.includes('0'),
            { timerInterval, timerValue, outputText: timerOutput.textContent }
        );

        // Тест createDebounce
        await new Promise((resolve) => {
            let debounceExecutionCount = 0;
            let lastValue = null;

            const fn = createDebounce((val) => {
                debounceExecutionCount++;
                lastValue = val;
            }, 50);

            fn('первый');
            fn('второй');
            fn('финальный');

            setTimeout(() => {
                assert(
                    'createDebounce: объединяет серию быстрых вызовов в один с последним значением',
                    debounceExecutionCount === 1 && lastValue === 'финальный',
                    { debounceExecutionCount, lastValue }
                );
                resolve();
            }, 90);
        });

        // Тест createThrottle
        await new Promise((resolve) => {
            let throttleExecutionCount = 0;
            const values = [];

            const fn = createThrottle((val) => {
                throttleExecutionCount++;
                values.push(val);
            }, 60);

            fn('вызов_1'); // должен вызваться сразу (leading)
            fn('вызов_2');
            fn('вызов_3'); // должен вызваться после интервала (trailing)

            assert(
                'createThrottle: первый вызов срабатывает немедленно',
                throttleExecutionCount === 1 && values[0] === 'вызов_1',
                { throttleExecutionCount, firstValue: values[0] }
            );

            setTimeout(() => {
                assert(
                    'createThrottle: завершающий вызов срабатывает по истечении интервала',
                    throttleExecutionCount === 2 && values[1] === 'вызов_3',
                    { throttleExecutionCount, values }
                );
                resolve();
            }, 100);
        });

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
                <h3>Результаты автоматических тестов (events-tests.js)</h3>
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
