// 1.1. Создайте функцию createCard, которая создает карточку с заголовком и текстом
// и добавляет ее в элемент с id="target1"
function createCard(title, content) {
    const target = document.getElementById('target1');
    if (!target) return null;

    const card = document.createElement('div');
    card.className = 'card';

    const h4 = document.createElement('h4');
    h4.textContent = title;

    const p = document.createElement('p');
    p.textContent = content;

    card.appendChild(h4);
    card.appendChild(p);
    target.appendChild(card);

    return card;
}

// 1.2. Создайте функцию createList, которая создает нумерованный список
// из массива элементов и добавляет его в #target1
function createList(items) {
    const target = document.getElementById('target1');
    if (!target || !Array.isArray(items)) return null;

    const ol = document.createElement('ol');
    items.forEach(itemText => {
        const li = document.createElement('li');
        li.textContent = itemText;
        ol.appendChild(li);
    });

    target.appendChild(ol);
    return ol;
}

// 2.1. Создайте функцию countChildren, которая возвращает количество
// дочерних элементов у #parent-element
function countChildren() {
    const parent = document.getElementById('parent-element');
    return parent ? parent.children.length : 0;
}

// 2.2. Создайте функцию findSpecialChild, которая находит элемент
// с классом "special" внутри #parent-element и возвращает его текст
function findSpecialChild() {
    const parent = document.getElementById('parent-element');
    if (!parent) return '';
    const specialChild = parent.querySelector('.special');
    return specialChild ? specialChild.textContent.trim() : '';
}

// 2.3. Создайте функцию getParentBackground, которая возвращает
// цвет фона родительского элемента для .child элементов
function getParentBackground() {
    const child = document.querySelector('.child');
    if (!child || !child.parentElement) return '';
    return window.getComputedStyle(child.parentElement).backgroundColor;
}

// 3.1. Создайте функцию toggleStyle, которая переключает класс "active-style"
// у элемента #style-target при клике на кнопку #toggle-style
function setupStyleToggle() {
    const toggleBtn = document.getElementById('toggle-style');
    const styleTarget = document.getElementById('style-target');

    if (toggleBtn && styleTarget) {
        toggleBtn.addEventListener('click', function() {
            styleTarget.classList.toggle('active-style');
        });
    }
}

// 3.2. Создайте функцию changeHeaderColor, которая меняет цвет фона header
// на случайный цвет при вызове
function changeHeaderColor() {
    const header = document.getElementById('main-header') || document.querySelector('header');
    if (!header) return '';

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const randomColor = `rgb(${r}, ${g}, ${b})`;

    header.style.background = randomColor;
    return randomColor;
}

// 3.3. Создайте функцию animateElement, которая добавляет анимацию
// к элементу #style-target (изменение размера и прозрачности)
function animateElement() {
    const styleTarget = document.getElementById('style-target');
    if (!styleTarget) return;

    styleTarget.style.transition = 'all 0.4s ease';
    styleTarget.style.transform = 'scale(1.1)';
    styleTarget.style.opacity = '0.6';

    setTimeout(() => {
        styleTarget.style.transform = 'scale(1)';
        styleTarget.style.opacity = '1';
    }, 400);
}

// 4.1. Создайте функцию setupClickCounter, которая подсчитывает клики
// на кнопке #click-btn и обновляет текст в #click-counter
function setupClickCounter() {
    let count = 0;
    const clickBtn = document.getElementById('click-btn');
    const clickCounter = document.getElementById('click-counter');

    if (clickBtn && clickCounter) {
        clickBtn.addEventListener('click', function() {
            count++;
            clickCounter.textContent = `Кликов: ${count}`;
        });
    }
}

// 4.2. Создайте функцию setupInputDisplay, которая отображает
// введенный текст из #text-input в #input-display в реальном времени
function setupInputDisplay() {
    const textInput = document.getElementById('text-input');
    const inputDisplay = document.getElementById('input-display');

    if (textInput && inputDisplay) {
        textInput.addEventListener('input', function() {
            inputDisplay.textContent = textInput.value;
        });
    }
}

// 4.3. Создайте функцию setupKeyboardEvents, которая обрабатывает
// нажатия клавиш и выводит информацию о них
function setupKeyboardEvents() {
    document.addEventListener('keydown', function(event) {
        console.log(`[Keyboard Event] key: "${event.key}", code: "${event.code}"`);
    });
}

// 5.1. Создайте функцию addListItem, которая добавляет новый элемент
// в список #dynamic-list из значения #item-input
function addListItem() {
    const input = document.getElementById('item-input');
    const list = document.getElementById('dynamic-list');

    if (!input || !list) return null;

    const value = input.value.trim();
    if (!value) return null;

    const li = document.createElement('li');
    li.className = 'list-item';

    const textSpan = document.createElement('span');
    textSpan.textContent = value;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.className = 'delete-btn';

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    list.appendChild(li);

    input.value = '';
    input.focus();

    return li;
}

// 5.2. Создайте функцию removeListItem, которая удаляет элемент списка
// при клике на кнопку удаления
function removeListItem(event) {
    if (event.target && event.target.tagName === 'BUTTON') {
        const li = event.target.closest('li.list-item');
        if (li) {
            li.remove();
        }
    }
}

// 5.3. Создайте функцию clearList, которая очищает весь список #dynamic-list
function clearList() {
    const list = document.getElementById('dynamic-list');
    if (list) {
        list.innerHTML = '';
    }
}

// 5.4. Создайте функцию setupListEvents, которая настраивает все обработчики
// для работы со списком (добавление, удаление, очистка)
function setupListEvents() {
    const addBtn = document.getElementById('add-item');
    const clearBtn = document.getElementById('clear-list');
    const list = document.getElementById('dynamic-list');
    const input = document.getElementById('item-input');

    if (addBtn) {
        addBtn.addEventListener('click', addListItem);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearList);
    }

    if (list) {
        list.addEventListener('click', removeListItem);
    }

    if (input) {
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                addListItem();
            }
        });
    }
}

// 6.1. Создайте функцию validateForm, которая проверяет форму #user-form
function validateForm(formData) {
    const errors = {};

    // Проверка имени: не пустое, минимум 2 символа
    if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Имя обязательно и должно содержать минимум 2 символа';
    }

    // Проверка email: соответствует формату email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
        errors.email = 'Введите корректный email (например, user@example.com)';
    }

    // Проверка возраста: число от 1 до 120
    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        errors.age = 'Возраст должен быть числом от 1 до 120';
    }

    return Object.keys(errors).length > 0 ? errors : null;
}

// 6.2. Создайте функцию displayFormErrors, которая показывает ошибки валидации
function displayFormErrors(errors) {
    const output = document.getElementById('form-output');
    if (!output || !errors) return;

    output.className = 'error-message';
    output.innerHTML = '';

    const ul = document.createElement('ul');
    Object.values(errors).forEach(errMsg => {
        const li = document.createElement('li');
        li.textContent = errMsg;
        ul.appendChild(li);
    });

    output.appendChild(ul);
}

// 6.3. Создайте функцию displayFormSuccess, которая показывает успешное сообщение
function displayFormSuccess(userData) {
    const output = document.getElementById('form-output');
    if (!output) return;

    output.className = 'success-message';
    output.innerHTML = `
        <strong>Форма успешно отправлена!</strong>
        <p>Имя: ${userData.name}</p>
        <p>Email: ${userData.email}</p>
        <p>Возраст: ${userData.age}</p>
    `;
}

// 6.4. Создайте функцию handleFormSubmit, которая обрабатывает отправку формы
function handleFormSubmit(event) {
    if (event) {
        event.preventDefault();
    }

    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const ageInput = document.getElementById('user-age');
    const form = document.getElementById('user-form');

    const formData = {
        name: nameInput ? nameInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        age: ageInput ? ageInput.value.trim() : ''
    };

    const errors = validateForm(formData);
    if (errors) {
        displayFormErrors(errors);
    } else {
        displayFormSuccess(formData);
        if (form) {
            form.reset();
        }
    }
}

// 6.5. Создайте функцию setupForm, которая настраивает обработчик для формы
function setupForm() {
    const form = document.getElementById('user-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Вызовите здесь все функции настройки
function initializeApp() {
    // Вызовите функции настройки:
    setupStyleToggle();
    setupClickCounter();
    setupInputDisplay();
    setupKeyboardEvents();
    setupListEvents();
    setupForm();

    // Вызовите createCard и createList для демонстрации
    createCard('Пример карточки', 'Это содержимое карточки');
    createList(['Первый элемент', 'Второй элемент', 'Третий элемент']);

    console.log('Приложение инициализировано!');
}

// Запуск инициализации когда DOM загружен
document.addEventListener('DOMContentLoaded', initializeApp);
