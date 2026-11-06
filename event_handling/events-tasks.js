// 1.1. Создайте функцию handleBasicClick, которая обрабатывает клик по кнопке #basic-btn
function handleBasicClick(event) {
    const output = document.getElementById('basic-output');
    if (output) {
        output.textContent = `Тип: ${event.type}, X: ${event.clientX}, Y: ${event.clientY}, Элемент: <${event.target.tagName.toLowerCase()} id="${event.target.id}">`;
    }

    const btn = event.currentTarget || event.target;
    if (btn) {
        btn.classList.add('pulse');
        setTimeout(() => {
            btn.classList.remove('pulse');
        }, 500);
    }
}

// 1.2. Создайте функцию handleMouseEvents, которая обрабатывает события мыши на #color-box
function handleMouseEvents(event) {
    const box = document.getElementById('color-box');
    const mouseOutput = document.getElementById('mouse-output');

    if (event.type === 'mouseenter') {
        if (box) box.style.background = '#e74c3c';
    } else if (event.type === 'mouseleave') {
        if (box) box.style.background = '#3498db';
    } else if (event.type === 'mousemove') {
        if (mouseOutput) {
            mouseOutput.textContent = `Координаты мыши: X: ${event.offsetX}, Y: ${event.offsetY}`;
        }
    }
}

// 1.3. Создайте функцию setupBasicEvents, которая настраивает все обработчики для задачи 1
function setupBasicEvents() {
    const btn = document.getElementById('basic-btn');
    const box = document.getElementById('color-box');

    if (btn) {
        btn.addEventListener('click', handleBasicClick);
    }

    if (box) {
        box.addEventListener('mouseenter', handleMouseEvents);
        box.addEventListener('mouseleave', handleMouseEvents);
        box.addEventListener('mousemove', handleMouseEvents);
    }
}

// 2.1. Создайте функцию handleKeyEvents, которая обрабатывает события клавиатуры
function handleKeyEvents(event) {
    const output = document.getElementById('key-output');
    if (!output) return;

    const isCtrlS = event.ctrlKey && (event.key.toLowerCase() === 's' || event.code === 'KeyS');
    const isAltC = event.altKey && (event.key.toLowerCase() === 'c' || event.code === 'KeyC');
    const isShiftA = event.shiftKey && (event.key === 'A' || event.key === 'a' || event.code === 'KeyA');

    if (isCtrlS) {
        event.preventDefault();
        output.textContent = 'Комбинация [Ctrl + S] перехвачена! (Сохранение предотвращено)';
        return;
    }

    if (isAltC) {
        event.preventDefault();
        output.textContent = 'Комбинация [Alt + C] перехвачена!';
        return;
    }

    if (isShiftA && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        output.textContent = 'Комбинация [Shift + A] перехвачена!';
        return;
    }

    output.textContent = `key: "${event.key}", code: "${event.code}", ctrlKey: ${event.ctrlKey}, altKey: ${event.altKey}, shiftKey: ${event.shiftKey}`;
}

// 2.2. Создайте функцию setupKeyboardEvents, которая настраивает обработчики клавиатуры
function setupKeyboardEvents() {
    const input = document.getElementById('key-input');
    if (input) {
        input.addEventListener('keydown', handleKeyEvents);
        input.addEventListener('keyup', function(event) {
            // Мягкая обработка отпускания клавиши
        });
    }
}

// Вспомогательная функция обновления вывода выбранных элементов
function updateDelegationOutput() {
    const output = document.getElementById('delegation-output');
    if (!output) return;

    const selectedItems = document.querySelectorAll('#item-list .item.selected');
    const ids = Array.from(selectedItems).map(el => el.getAttribute('data-id'));
    output.textContent = `Выбранные элементы: ${ids.length > 0 ? ids.join(', ') : 'нет'}`;
}

// 3.1. Создайте функцию handleDelegationClick, используя делегирование событий
function handleDelegationClick(event) {
    // Если клик на .delete - удаляем родительский .item
    const deleteBtn = event.target.closest('.delete');
    if (deleteBtn) {
        const item = deleteBtn.closest('.item');
        if (item) {
            item.remove();
            updateDelegationOutput();
            return;
        }
    }

    // Если клик на сам .item (но не на крестик удаления)
    const item = event.target.closest('.item');
    if (item) {
        item.classList.toggle('selected');
        updateDelegationOutput();
    }
}

// 3.2. Создайте функцию addNewItem, которая добавляет новый элемент в список
function addNewItem() {
    const itemList = document.getElementById('item-list');
    if (!itemList) return null;

    const currentItems = itemList.querySelectorAll('.item');
    let maxId = 0;
    currentItems.forEach(el => {
        const id = parseInt(el.getAttribute('data-id'), 10);
        if (!isNaN(id) && id > maxId) {
            maxId = id;
        }
    });

    const newId = maxId + 1;
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.setAttribute('data-id', String(newId));
    newItem.innerHTML = `Элемент ${newId} <span class="delete">×</span>`;

    itemList.appendChild(newItem);
    return newItem;
}

// 3.3. Создайте функцию setupDelegationEvents, которая настраивает делегирование
function setupDelegationEvents() {
    const itemList = document.getElementById('item-list');
    const addBtn = document.getElementById('add-item-btn');

    if (itemList) {
        itemList.addEventListener('click', handleDelegationClick);
    }

    if (addBtn) {
        addBtn.addEventListener('click', addNewItem);
    }
}

// 4.1. Создайте функцию preventLinkDefault, которая предотвращает переход по ссылке
function preventLinkDefault(event) {
    event.preventDefault();
    const output = document.getElementById('prevention-output');
    if (output) {
        output.textContent = 'Переход по ссылке успешно предотвращен (event.preventDefault())';
    }

    const link = document.getElementById('prevent-link');
    if (link) {
        link.classList.add('shake');
        setTimeout(() => link.classList.remove('shake'), 300);
    }
}

// 4.2. Создайте функцию preventFormSubmit, которая обрабатывает отправку формы
function preventFormSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('prevent-form');
    const output = document.getElementById('prevention-output');
    if (!form || !output) return;

    const input = form.querySelector('input[type="text"]');
    const val = input ? input.value.trim() : '';

    if (!val) {
        output.textContent = 'Ошибка валидации: текстовое поле не должно быть пустым!';
        if (input) {
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 300);
        }
    } else {
        output.textContent = `Отправка формы перехвачена! Данные: "${val}"`;
        form.reset();
    }
}

// 4.3. Создайте функцию setupPreventionEvents, которая настраивает предотвращение
function setupPreventionEvents() {
    const link = document.getElementById('prevent-link');
    const form = document.getElementById('prevent-form');

    if (link) {
        link.addEventListener('click', preventLinkDefault);
    }

    if (form) {
        form.addEventListener('submit', preventFormSubmit);
    }
}

// 5.1. Создайте функцию createCustomEvent и запустите его
function triggerCustomEvent() {
    const event = new CustomEvent('customAction', {
        detail: { message: 'Привет от кастомного события!' },
        bubbles: true
    });
    document.dispatchEvent(event);
}

// 5.2. Создайте функцию handleCustomEvent, которая обрабатывает кастомное событие
function handleCustomEvent(event) {
    const output = document.getElementById('custom-output');
    if (output) {
        output.textContent = `Кастомные события: ${event.detail?.message || 'Событие получено'}`;
    }

    const btn = document.getElementById('trigger-custom');
    if (btn) {
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 500);
    }
}

// 5.3. Создайте функцию setupMultipleListeners, которая добавляет несколько обработчиков
function setupMultipleListeners() {
    const output = document.getElementById('custom-output');

    const listener1 = (e) => {
        console.log('[Слушатель 1] Получено кастомное событие:', e.detail?.message);
    };

    const listener2 = () => {
        console.log('[Слушатель 2] Обработка второй фазы события завершена');
    };

    const listener3 = () => {
        if (output) {
            output.textContent += ' | [Все 3 обработчика сработали синхронно]';
        }
    };

    document.addEventListener('customAction', listener1, { once: true });
    document.addEventListener('customAction', listener2, { once: true });
    document.addEventListener('customAction', listener3, { once: true });

    triggerCustomEvent();
}

// 5.4. Создайте функцию setupCustomEvents, которая настраивает кастомные события
function setupCustomEvents() {
    document.addEventListener('customAction', handleCustomEvent);

    const triggerBtn = document.getElementById('trigger-custom');
    const multiBtn = document.getElementById('multiple-listeners');

    if (triggerBtn) {
        triggerBtn.addEventListener('click', triggerCustomEvent);
    }

    if (multiBtn) {
        multiBtn.addEventListener('click', setupMultipleListeners);
    }
}

// 6.1. Создайте функцию loadImageWithEvents, которая загружает изображение
function loadImageWithEvents() {
    const container = document.getElementById('image-container');
    const output = document.getElementById('loading-output');
    if (!container || !output) return;

    container.innerHTML = '';
    container.className = 'image-container loading';
    output.textContent = 'Статус загрузки: Загрузка изображения... (loadstart)';

    const img = document.createElement('img');
    const randomSeed = Date.now();
    img.src = `https://picsum.photos/300/200?random=${randomSeed}`;
    img.alt = 'Случайное фото';

    img.addEventListener('load', function() {
        container.className = 'image-container success';
        output.textContent = 'Статус загрузки: Изображение успешно загружено! (событие load)';
    });

    img.addEventListener('error', function() {
        container.className = 'image-container error';
        output.textContent = 'Статус загрузки: Ошибка загрузки изображения (событие error)';
    });

    container.appendChild(img);
}

// 6.2. Создайте функцию simulateLoadError, которая симулирует ошибку загрузки
function simulateLoadError() {
    const container = document.getElementById('image-container');
    const output = document.getElementById('loading-output');
    if (!container || !output) return;

    container.innerHTML = '';
    container.className = 'image-container loading';
    output.textContent = 'Статус загрузки: Запрос к несуществующему ресурсу...';

    const brokenImg = document.createElement('img');
    brokenImg.src = `https://invalid-non-existent-domain-${Date.now()}.xyz/error.jpg`;

    brokenImg.addEventListener('error', function() {
        container.className = 'image-container error';
        output.textContent = 'Статус загрузки: Ошибка 404/Network Error (событие error успешно обработано)';
    });

    container.appendChild(brokenImg);
}

// 6.3. Создайте функцию setupLoadingEvents, которая настраивает события загрузки
function setupLoadingEvents() {
    const loadBtn = document.getElementById('load-image');
    const errorBtn = document.getElementById('load-error');

    if (loadBtn) {
        loadBtn.addEventListener('click', loadImageWithEvents);
    }

    if (errorBtn) {
        errorBtn.addEventListener('click', simulateLoadError);
    }
}
let timerInterval = null;
let timerValue = 0;

// 7.1. Создайте функцию startTimer, которая запускает секундомер
function startTimer() {
    if (timerInterval !== null) {
        return; // Запрет множественного запуска
    }

    const output = document.getElementById('timer-output');
    timerInterval = setInterval(() => {
        timerValue++;
        if (output) {
            output.textContent = `Таймер: ${timerValue}`;
        }
    }, 1000);
}

// 7.2. Создайте функцию stopTimer, которая останавливает секундомер
function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerValue = 0;
    const output = document.getElementById('timer-output');
    if (output) {
        output.textContent = 'Таймер: 0';
    }
}

// 7.3. Создайте функцию createDebounce, которая реализует debounce
function createDebounce(func, delay) {
    let timeoutId = null;

    return function(...args) {
        const context = this;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(context, args);
            timeoutId = null;
        }, delay);
    };
}

// 7.4. Создайте функцию createThrottle, которая реализует throttle
function createThrottle(func, interval) {
    let isThrottled = false;
    let savedArgs = null;
    let savedThis = null;

    function throttled(...args) {
        if (isThrottled) {
            savedArgs = args;
            savedThis = this;
            return;
        }

        func.apply(this, args);
        isThrottled = true;

        setTimeout(() => {
            isThrottled = false;
            if (savedArgs) {
                throttled.apply(savedThis, savedArgs);
                savedArgs = null;
                savedThis = null;
            }
        }, interval);
    }

    return throttled;
}

let debounceClickCount = 0;
let debouncedHandler = null;

// 7.5. Создайте функцию testDebounce, которая тестирует debounce
function testDebounce() {
    const asyncOutput = document.getElementById('async-output');

    if (!debouncedHandler) {
        debouncedHandler = createDebounce((count) => {
            if (asyncOutput) {
                asyncOutput.textContent = `Асинхронные события: [Debounce сработал!] Всего кликов: ${count}`;
            }
        }, 500);
    }

    debounceClickCount++;
    if (asyncOutput) {
        asyncOutput.textContent = `Асинхронные события: [Клик №${debounceClickCount}] Ожидание затишья 500мс...`;
    }
    debouncedHandler(debounceClickCount);
}

let throttleClickCount = 0;
let throttledHandler = null;

// 7.6. Создайте функцию testThrottle, которая тестирует throttle
function testThrottle() {
    const asyncOutput = document.getElementById('async-output');

    if (!throttledHandler) {
        throttledHandler = createThrottle((count) => {
            if (asyncOutput) {
                asyncOutput.textContent = `Асинхронные события: [Throttle выполнил вызов] Кликов обработано: ${count}`;
            }
        }, 1000);
    }

    throttleClickCount++;
    throttledHandler(throttleClickCount);
}

// 7.7. Создайте функцию setupTimerEvents, которая настраивает таймеры
function setupTimerEvents() {
    const startBtn = document.getElementById('start-timer');
    const stopBtn = document.getElementById('stop-timer');
    const debounceBtn = document.getElementById('debounce-btn');
    const throttleBtn = document.getElementById('throttle-btn');

    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (stopBtn) stopBtn.addEventListener('click', stopTimer);
    if (debounceBtn) debounceBtn.addEventListener('click', testDebounce);
    if (throttleBtn) throttleBtn.addEventListener('click', testThrottle);
}

function initializeEventHandlers() {
    setupBasicEvents();
    setupKeyboardEvents();
    setupDelegationEvents();
    setupPreventionEvents();
    setupCustomEvents();
    setupLoadingEvents();
    setupTimerEvents();

    console.log('Все обработчики событий инициализированы!');
}

// Запуск инициализации когда DOM загружен
document.addEventListener('DOMContentLoaded', initializeEventHandlers);
