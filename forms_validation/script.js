document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const status = document.getElementById('formStatus');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const birthDate = document.getElementById('birthDate');
    const bio = document.getElementById('bio');
    const charCount = document.getElementById('charCount');

    // поля, у которых есть сообщение об ошибке и которые проверяем
    const fields = Array.from(form.elements).filter(el =>
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) &&
        !['radio', 'checkbox'].includes(el.type) || el.id === 'terms'
    );

    // дата рождения: максимум сегодняшний день
    birthDate.max = new Date().toISOString().split('T')[0];

    // счётчик символов
    bio.addEventListener('input', () => {
        charCount.textContent = bio.value.length;
    });

    // получение текста ошибки (пустая строка = поле корректно)
    function getError(field) {
        const value = field.value.trim();
        const v = field.validity;

        if (field.type === 'checkbox') {
            return field.required && !field.checked
                ? 'Необходимо принять условия использования' : '';
        }

        // необязательное пустое поле всегда корректно
        if (!field.required && value === '') return '';

        if (field.required && value === '') return 'Это поле обязательно для заполнения';

        if (field.type === 'email' && v.typeMismatch) return 'Введите корректный email, например name@mail.com';
        if (v.tooShort) return `Минимум символов: ${field.minLength} (сейчас ${field.value.length})`;
        if (v.tooLong) return `Максимум символов: ${field.maxLength}`;

        if (v.patternMismatch) {
            if (field.id === 'password') {
                return field.value.length < 8
                    ? 'Минимум 8 символов'
                    : 'Нужны заглавная и строчная буквы, цифра, без пробелов';
            }
            if (field.type === 'tel') return 'Формат телефона: +7 (999) 999-99-99';
            return 'Некорректное значение';
        }

        // подтверждение пароля
        if (field.id === 'confirmPassword' && field.value !== password.value) {
            return 'Пароли не совпадают';
        }

        // дата рождения в допустимом диапазоне
        if (field.type === 'date' && (v.rangeUnderflow || v.rangeOverflow || v.badInput)) {
            return 'Укажите корректную дату рождения';
        }

        return '';
    }

    // показ или скрытие ошибки (визуально + для скринридера)
    function showState(field, message) {
        const errorEl = document.getElementById(field.id + 'Error');
        const hasValue = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';

        field.classList.toggle('error', message !== '');
        field.classList.toggle('valid', message === '' && hasValue && field.type !== 'checkbox');

        if (message) {
            field.setAttribute('aria-invalid', 'true');
        } else {
            field.removeAttribute('aria-invalid');
        }
        if (errorEl) errorEl.textContent = message;
    }

    function validate(field) {
        const message = getError(field);
        showState(field, message);
        return message === '';
    }

    // валидация в реальном времени 
    fields.forEach(field => {
        const eventName = (field.tagName === 'SELECT' || field.type === 'checkbox' || field.type === 'date')
            ? 'change' : 'blur';

        // первый раз проверяем, когда пользователь закончил ввод
        field.addEventListener(eventName, () => {
            field.dataset.touched = 'true';
            validate(field);
        });

        // дальше исправляем ошибку на лету, пока пользователь вводит
        field.addEventListener('input', () => {
            if (field.dataset.touched) validate(field);
        });
    });

    // пароль изменился, подтверждение нужно перепроверить
    password.addEventListener('input', () => {
        if (confirmPassword.value !== '') {
            confirmPassword.dataset.touched = 'true';
            validate(confirmPassword);
        }
    });

    // отправка 
    let submitted = false; // true, когда form.reset() вызван после успешной отправки
    form.addEventListener('submit', event => {
        event.preventDefault();

        let firstInvalid = null;
        fields.forEach(field => {
            field.dataset.touched = 'true';
            if (!validate(field) && !firstInvalid) firstInvalid = field;
        });

        if (firstInvalid) {
            setStatus('fail', 'Пожалуйста, исправьте ошибки в форме');
            firstInvalid.focus();
            return;
        }

        submitted = true;
        form.reset();
        setStatus('success', 'Форма успешно отправлена!');
    });

    form.addEventListener('reset', () => {
        const afterSubmit = submitted;
        submitted = false;
        setTimeout(() => { resetUi(); if (!afterSubmit) setStatus('', ''); }, 0);
    });

    function resetUi() {
        charCount.textContent = '0';
        fields.forEach(field => {
            delete field.dataset.touched;
            showState(field, '');
            field.classList.remove('valid');
        });
    }

    function setStatus(type, text) {
        status.className = 'form-status' + (type ? ' ' + type : '');
        status.textContent = text;
    }
});
