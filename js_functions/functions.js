// Создайте функцию sum, которая принимает любое количество аргументов
// Используйте rest parameters для получения всех аргументов
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

// Создайте функцию createUser, которая принимает объект с деструктуризацией
// Объект должен содержать: name, age, email (email - необязательный)
function createUser({ name, age, email = "не указан" } = {}) {
    return `Пользователь: ${name}, возраст: ${age}, email: ${email}`;
}

// Создайте функцию secretMessage, которая сохраняет секретное сообщение
// и возвращает функцию для его проверки
function secretMessage(password, message) {
    return function(attemptPassword) {
        if (attemptPassword === password) {
            return message;
        }
        return "Доступ запрещен";
    };
}

// Создайте функцию compose, которая принимает несколько функций
// и возвращает их композицию (результат последовательного применения)
function compose(...functions) {
    if (functions.length === 0) {
        return (arg) => arg;
    }
    if (functions.length === 1) {
        return functions[0];
    }
    return function(...args) {
        const lastFn = functions[functions.length - 1];
        const restFns = functions.slice(0, -1);
        return compose(...restFns)(lastFn(...args));
    };
}

// Реализуйте функцию myMap, которая работает как Array.prototype.map
function myMap(array, callback) {
    if (!Array.isArray(array)) {
        throw new TypeError('myMap: Первый аргумент должен быть массивом');
    }
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (i in array) {
            result.push(callback(array[i], i, array));
        }
    }
    return result;
}

// Реализуйте функцию myFilter, которая работает как Array.prototype.filter
function myFilter(array, callback) {
    if (!Array.isArray(array)) {
        throw new TypeError('myFilter: Первый аргумент должен быть массивом');
    }
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (i in array && Boolean(callback(array[i], i, array))) {
            result.push(array[i]);
        }
    }
    return result;
}

// Реализуйте функцию myReduce, которая работает как Array.prototype.reduce
function myReduce(array, callback, initialValue) {
    if (!Array.isArray(array)) {
        throw new TypeError('myReduce: Первый аргумент должен быть массивом');
    }
    const hasInitialValue = arguments.length >= 3;
    let accumulator;
    let startIndex = 0;

    if (hasInitialValue) {
        accumulator = initialValue;
    } else {
        let found = false;
        for (let i = 0; i < array.length; i++) {
            if (i in array) {
                accumulator = array[i];
                startIndex = i + 1;
                found = true;
                break;
            }
        }
        if (!found) {
            throw new TypeError('myReduce: Редукция пустого массива без начального значения невозможна');
        }
    }

    for (let i = startIndex; i < array.length; i++) {
        if (i in array) {
            accumulator = callback(accumulator, array[i], i, array);
        }
    }

    return accumulator;
}

// Каррирование
// Реализуйте функцию curry, которая превращает функцию от нескольких аргументов в цепочку функций
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function(...nextArgs) {
            return curried.apply(this, args.concat(nextArgs));
        };
    };
}

// Мемоизация 
// Реализуйте функцию memoize, которая кэширует результаты вызовов функции
function memoize(fn) {
    const cache = new Map();

    const memoized = function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };

    memoized.cache = cache;
    return memoized;
}

// Дебаунсинг
// Реализуйте функцию debounce, которая откладывает вызов функции
function debounce(fn, delay) {
    let timeoutId = null;

    const debounced = function(...args) {
        const context = this;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn.apply(context, args);
            timeoutId = null;
        }, delay);
    };

    debounced.cancel = function() {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return debounced;
}

// Троттлинг
// Реализуйте функцию throttle, которая ограничивает частоту вызовов функции
function throttle(fn, interval) {
    let isThrottled = false;
    let savedArgs = null;
    let savedThis = null;

    function throttled(...args) {
        if (isThrottled) {
            savedArgs = args;
            savedThis = this;
            return;
        }

        fn.apply(this, args);
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

// Функция-валидатор
// Реализуйте функцию createValidator, которая возвращает функцию проверки
// Валидатор должен проверять: минимальную длину, наличие цифр, наличие заглавных букв
function createValidator(options = {}) {
    const minLength = options.minLength ?? options.min ?? 0;
    const requireNumbers = options.hasNumbers ?? options.hasNumber ?? options.requireDigit ?? options.requireNumbers ?? false;
    const requireUppercase = options.hasUpperCase ?? options.hasUppercase ?? options.requireUppercase ?? false;

    const validator = function(value) {
        if (typeof value !== 'string') {
            return false;
        }
        if (minLength > 0 && value.length < minLength) {
            return false;
        }
        if (requireNumbers && !/\d/.test(value)) {
            return false;
        }
        if (requireUppercase && !/[A-ZА-ЯЁ]/.test(value)) {
            return false;
        }
        return true;
    };

    validator.validateDetailed = function(value) {
        const errors = [];
        if (typeof value !== 'string') {
            errors.push('Значение должно быть строкой');
            return { isValid: false, errors };
        }
        if (minLength > 0 && value.length < minLength) {
            errors.push(`Длина строки меньше минимальной (${minLength})`);
        }
        if (requireNumbers && !/\d/.test(value)) {
            errors.push('Строка должна содержать хотя бы одну цифру');
        }
        if (requireUppercase && !/[A-ZА-ЯЁ]/.test(value)) {
            errors.push('Строка должна содержать хотя бы одну заглавную букву');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    };

    return validator;
}
