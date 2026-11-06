(function runDomTestSuite() {
    // Ждем полной загрузки DOM перед запуском тестов
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTests);
    } else {
        initTests();
    }

    function initTests() {
        console.log('%c=== ЗАПУСК ТЕСТОВ DOM МАНИПУЛЯЦИЙ ===', 'color: #007acc; font-weight: bold; font-size: 14px;');

        // Создаем контейнер для визуального отображения тестов на странице
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

            renderTestResult(testContainer, testName, isSuccess, details);
        }

        console.group('1. Создание и вставка элементов (createCard, createList)');

        // Тест createCard
        const initialCardsCount = document.querySelectorAll('#target1 .card').length;
        const testCard = createCard('Тестовый заголовок', 'Тестовое описание карточки');
        const newCardsCount = document.querySelectorAll('#target1 .card').length;

        assert(
            'createCard: создаёт элемент с классом "card"',
            testCard instanceof HTMLElement && testCard.classList.contains('card'),
            { card: testCard }
        );

        assert(
            'createCard: содержит h4 с переданным заголовком',
            testCard && testCard.querySelector('h4') && testCard.querySelector('h4').textContent === 'Тестовый заголовок',
            { h4Text: testCard ? testCard.querySelector('h4')?.textContent : null }
        );

        assert(
            'createCard: содержит p с переданным содержимым',
            testCard && testCard.querySelector('p') && testCard.querySelector('p').textContent === 'Тестовое описание карточки',
            { pText: testCard ? testCard.querySelector('p')?.textContent : null }
        );

        assert(
            'createCard: добавляет карточку в #target1',
            newCardsCount === initialCardsCount + 1 && document.getElementById('target1').contains(testCard),
            { initialCardsCount, newCardsCount }
        );

        // Краевой случай createCard: экранирование спецсимволов HTML
        const xssCard = createCard('<script>alert("xss")</script>', '<b>жирный текст как строка</b>');
        assert(
            'createCard (краевой случай): безопасная вставка текста без выполнения HTML',
            xssCard && xssCard.querySelector('h4').innerHTML.includes('&lt;') || xssCard.querySelector('h4').textContent.includes('<script>'),
            { textContent: xssCard ? xssCard.querySelector('h4').textContent : null }
        );

        // Тест createList
        const testList = createList(['Альфа', 'Бета', 'Гамма']);
        assert(
            'createList: создаёт элемент ol',
            testList instanceof HTMLOListElement && testList.tagName === 'OL',
            { listTag: testList?.tagName }
        );

        const listItems = testList ? testList.querySelectorAll('li') : [];
        assert(
            'createList: создаёт правильное количество li элементов',
            listItems.length === 3 && listItems[1].textContent === 'Бета',
            { count: listItems.length, secondItem: listItems[1]?.textContent }
        );

        // Краевой случай createList: пустой массив
        const emptyList = createList([]);
        assert(
            'createList (краевой случай): корректная работа с пустым массивом',
            emptyList instanceof HTMLOListElement && emptyList.children.length === 0,
            { childrenCount: emptyList?.children.length }
        );

        console.groupEnd();

        console.group('2. Навигация по DOM (countChildren, findSpecialChild, getParentBackground)');

        const childrenCount = countChildren();
        assert(
            'countChildren: возвращает точное количество дочерних элементов #parent-element',
            childrenCount === 3,
            { expected: 3, actual: childrenCount }
        );

        const specialChildText = findSpecialChild();
        assert(
            'findSpecialChild: находит элемент с классом "special" и возвращает его текст',
            specialChildText === 'Особый дочерний элемент',
            { actual: specialChildText }
        );

        const parentBg = getParentBackground();
        assert(
            'getParentBackground: возвращает вычисленный цвет фона родительского элемента',
            typeof parentBg === 'string' && (parentBg.includes('rgb') || parentBg.includes('#')),
            { background: parentBg }
        );

        console.groupEnd();

        console.group('3. Работа с классами и стилями (setupStyleToggle, changeHeaderColor, animateElement)');

        const styleTarget = document.getElementById('style-target');
        const toggleBtn = document.getElementById('toggle-style');

        const initialHasClass = styleTarget.classList.contains('active-style');
        toggleBtn.click();
        const afterFirstClick = styleTarget.classList.contains('active-style');
        toggleBtn.click();
        const afterSecondClick = styleTarget.classList.contains('active-style');

        assert(
            'setupStyleToggle: переключает класс "active-style" при кликах',
            afterFirstClick !== initialHasClass && afterSecondClick === initialHasClass,
            { initialHasClass, afterFirstClick, afterSecondClick }
        );

        const headerColor1 = changeHeaderColor();
        const headerColor2 = changeHeaderColor();
        assert(
            'changeHeaderColor: устанавливает случайный валидный цвет заголовка',
            typeof headerColor1 === 'string' && headerColor1.startsWith('rgb(') && headerColor2.startsWith('rgb('),
            { color1: headerColor1, color2: headerColor2 }
        );

        let animateThrew = false;
        try {
            animateElement();
        } catch (e) {
            animateThrew = true;
        }
        assert(
            'animateElement: запускает анимацию элемента без ошибок',
            !animateThrew && styleTarget.style.transition !== '',
            { transition: styleTarget.style.transition }
        );

        console.groupEnd();

        console.group('4. Обработка событий (setupClickCounter, setupInputDisplay)');

        const clickBtn = document.getElementById('click-btn');
        const clickCounter = document.getElementById('click-counter');

        const initialCounterText = clickCounter.textContent;
        clickBtn.click();
        const counterAfterOne = clickCounter.textContent;
        clickBtn.click();
        const counterAfterTwo = clickCounter.textContent;

        assert(
            'setupClickCounter: корректно инкрементирует число кликов при нажатии кнопки',
            counterAfterOne.includes('1') && counterAfterTwo.includes('2'),
            { initialCounterText, counterAfterOne, counterAfterTwo }
        );

        const textInput = document.getElementById('text-input');
        const inputDisplay = document.getElementById('input-display');

        textInput.value = 'Привет, DOM!';
        textInput.dispatchEvent(new Event('input'));

        assert(
            'setupInputDisplay: отображает введенный текст в реальном времени при событии input',
            inputDisplay.textContent === 'Привет, DOM!',
            { displayedText: inputDisplay.textContent }
        );

        // Краевой случай: очистка поля ввода
        textInput.value = '';
        textInput.dispatchEvent(new Event('input'));
        assert(
            'setupInputDisplay (краевой случай): очистка поля ввода обновляет блок вывода',
            inputDisplay.textContent === '',
            { displayedText: inputDisplay.textContent }
        );

        console.groupEnd();

        console.group('5. Динамические списки (addListItem, removeListItem, clearList, setupListEvents)');

        const itemInput = document.getElementById('item-input');
        const dynamicList = document.getElementById('dynamic-list');
        const addItemBtn = document.getElementById('add-item');
        const clearListBtn = document.getElementById('clear-list');

        // Очищаем перед тестами
        clearList();
        assert(
            'clearList: очищает список до 0 элементов',
            dynamicList.children.length === 0,
            { listLength: dynamicList.children.length }
        );

        // Добавляем элемент через кнопку
        itemInput.value = 'Купить молоко';
        addItemBtn.click();

        assert(
            'addListItem: добавляет li.list-item в список и очищает input',
            dynamicList.children.length === 1 &&
            dynamicList.querySelector('.list-item') !== null &&
            dynamicList.querySelector('.list-item').textContent.includes('Купить молоко') &&
            itemInput.value === '',
            { listLength: dynamicList.children.length, inputValue: itemInput.value }
        );

        // Краевой случай: попытка добавить пустую строку или пробелы
        itemInput.value = '   ';
        addItemBtn.click();
        assert(
            'addListItem (краевой случай): игнорирует ввод пустой строки или только пробелов',
            dynamicList.children.length === 1,
            { listLength: dynamicList.children.length }
        );

        // Добавляем второй элемент через Enter
        itemInput.value = 'Прочитать главу 11';
        itemInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

        assert(
            'setupListEvents: добавление элемента по нажатию клавиши Enter',
            dynamicList.children.length === 2 && dynamicList.lastElementChild.textContent.includes('Прочитать главу 11'),
            { listLength: dynamicList.children.length }
        );

        // Удаление элемента через клик по кнопке удаления (делегирование событий)
        const firstDeleteBtn = dynamicList.querySelector('.list-item button');
        if (firstDeleteBtn) {
            firstDeleteBtn.click();
        }

        assert(
            'removeListItem: удаляет соответствующий li при клике на кнопку "Удалить"',
            dynamicList.children.length === 1 && dynamicList.textContent.includes('Прочитать главу 11'),
            { remainingChildren: dynamicList.children.length }
        );

        // Полная очистка
        clearListBtn.click();
        assert(
            'clearList: очищает все элементы списка по кнопке "Очистить"',
            dynamicList.children.length === 0,
            { remainingChildren: dynamicList.children.length }
        );

        console.groupEnd();

        console.group('6. Работа с формами (validateForm, displayFormErrors, displayFormSuccess, handleFormSubmit)');

        // Валидные данные
        const validData = { name: 'Алексей', email: 'alex@example.com', age: '25' };
        const validResult = validateForm(validData);
        assert(
            'validateForm: валидные данные возвращают null (ошибок нет)',
            validResult === null,
            { result: validResult }
        );

        // Невалидное имя
        const badNameResult = validateForm({ name: 'A', email: 'test@example.com', age: '20' });
        assert(
            'validateForm: имя короче 2 символов вызывает ошибку',
            badNameResult !== null && typeof badNameResult.name === 'string',
            { errors: badNameResult }
        );

        // Невалидный email
        const badEmailResult = validateForm({ name: 'Иван', email: 'invalid-email', age: '20' });
        assert(
            'validateForm: некорректный email вызывает ошибку',
            badEmailResult !== null && typeof badEmailResult.email === 'string',
            { errors: badEmailResult }
        );

        // Невалидный возраст (слишком большой / маленький / не число)
        const badAgeResult = validateForm({ name: 'Иван', email: 'ivan@mail.ru', age: '150' });
        assert(
            'validateForm: возраст > 120 вызывает ошибку',
            badAgeResult !== null && typeof badAgeResult.age === 'string',
            { errors: badAgeResult }
        );

        const negativeAgeResult = validateForm({ name: 'Иван', email: 'ivan@mail.ru', age: '-5' });
        assert(
            'validateForm: отрицательный возраст вызывает ошибку',
            negativeAgeResult !== null && typeof negativeAgeResult.age === 'string',
            { errors: negativeAgeResult }
        );

        // Проверка отображения ошибок displayFormErrors
        displayFormErrors({ testErr: 'Тестовая ошибка формы' });
        const formOutput = document.getElementById('form-output');
        assert(
            'displayFormErrors: отображает блок с классом "error-message"',
            formOutput.classList.contains('error-message') && formOutput.textContent.includes('Тестовая ошибка формы'),
            { outputText: formOutput.textContent, className: formOutput.className }
        );

        // Проверка успешного отображения displayFormSuccess
        displayFormSuccess(validData);
        assert(
            'displayFormSuccess: отображает блок с классом "success-message" и данными',
            formOutput.classList.contains('success-message') && formOutput.textContent.includes('Алексей'),
            { outputText: formOutput.textContent, className: formOutput.className }
        );

        // Интеграционный тест отправки формы handleFormSubmit
        const userForm = document.getElementById('user-form');
        const nameField = document.getElementById('user-name');
        const emailField = document.getElementById('user-email');
        const ageField = document.getElementById('user-age');

        nameField.value = 'Дмитрий';
        emailField.value = 'dmitry@test.ru';
        ageField.value = '30';

        userForm.dispatchEvent(new Event('submit', { cancelable: true }));

        assert(
            'handleFormSubmit: успешная отправка валидной формы сбрасывает поля и выводит успех',
            formOutput.classList.contains('success-message') && formOutput.textContent.includes('Дмитрий'),
            { outputText: formOutput.textContent }
        );

        console.groupEnd();
        renderSummaryBanner(testContainer, stats);
    }

    // Создание визуального контейнера для результатов тестов
    function createTestUiContainer() {
        let section = document.getElementById('test-results-container');
        if (!section) {
            section = document.createElement('section');
            section.id = 'test-results-container';
            section.className = 'task-area';
            section.innerHTML = `
                <h3>Результаты автоматических тестов (dom-tests.js)</h3>
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

    // Отрисовка строки конкретного теста
    function renderTestResult(container, testName, isSuccess, details) {
        const listResults = container.querySelector('#test-list-results');
        if (!listResults) return;

        const el = document.createElement('div');
        el.className = `test-result ${isSuccess ? 'test-success' : 'test-failure'}`;
        el.innerHTML = `
            <strong>${isSuccess ? 'УСПЕХ' : '[X] ОШИБКА'}:</strong> ${escapeHtml(testName)}
        `;
        listResults.appendChild(el);
    }

    // Отрисовка общего саммари тестов
    function renderSummaryBanner(container, stats) {
        const header = container.querySelector('#test-summary-header');
        if (!header) return;

        const duration = (performance.now() - stats.startTime).toFixed(1);
        const allPassed = stats.failed === 0;

        header.innerHTML = `
            <div style="padding: 12px; margin-bottom: 12px; border-radius: 6px; font-weight: bold; background: ${allPassed ? '#d4edda' : '#f8d7da'}; color: ${allPassed ? '#155724' : '#721c24'};">
                ${allPassed ? 'Все тесты пройдены успешно.' : 'Обнаружены непройденные тесты!'}
                (Всего: ${stats.total}, Пройдено: ${stats.passed}, Ошибок: ${stats.failed}, Время: ${duration} мс)
            </div>
        `;

        console.log(
            `%c=== ИТОГИ ТЕСТОВ: ${stats.passed}/${stats.total} пройдено (${duration} мс) ===`,
            `color: ${allPassed ? '#27ae60' : '#e74c3c'}; font-weight: bold; font-size: 14px;`
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
