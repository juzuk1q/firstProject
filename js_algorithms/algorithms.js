// функция для определния простого числа
// временная сложность: O(√n) - сублинейная.
function isPrime(num){
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    // все простые числа > 3
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) {
            return false;
        }
    }
    return true;
}

// вычисление факториала
// временная сложность: O(n) - линейная.
function factorial(num){
    if (num < 0) return null;
    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
    }
    return result;
}

// фибоначи
// временная сложность: O(n) - линейная.
function fibonacci(num){
    if (num <= 0) return [];
    if (num === 1) return [0];
    const sequence = [0, 1];
    for (let i = 2; i < num; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
}

// наибольший общий делитель
// временная сложность: O(log(min(a, b))) - логарифмическая.
function gcd(a, b){
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}


// -------
// работа со строками
// --------

// проверка на палиндром 
// временная сложность: O(n) - линейная.
function isPalindrome(str){
    const cleaned = str.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '');
    let left = 0;
    let right = cleaned.length - 1;
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// подсчёт гласных в строке
// временная сложность: O(n) - линейная.
function countVowels(str){
    const vowels = new Set([
        'а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я',
        'a', 'e', 'i', 'o', 'u'
    ]);
    let count = 0;
    const lower = str.toLowerCase();
    for (let i = 0; i < lower.length; i++) {
        if (vowels.has(lower[i])) {
            count++;
        }
    }
    return count;
}

// переворачиваем строку без встроенных функций
// временная сложность: O(n) - линейная.
function reverseString(str){
    let reversed = '';
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}

// ищем самое длинное слово
// временная сложность: O(n) - линейная.
function findLongestWord(sentence) {
    const words = sentence.match(/[a-zA-Zа-яА-ЯёЁ0-9-]+/g) || [];
    let longest = '';
    for (const word of words) {
        if (word.length > longest.length) {
            longest = word;
        }
    }
    return longest;
}
 

// -------
// работа с массивами
// --------

// находим максимальный элемент в массиве
// временная сложность: O(n) - линейная.
function findMax(arr) {
    if (!arr || arr.length === 0) return undefined;
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

// удаляем дубликаты их массива
// временная сложность: O(n) - линейная.
function removeDuplicates(arr) {
    const seen = new Set();
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (!seen.has(arr[i])) {
            seen.add(arr[i]);
            result.push(arr[i]);
        }
    }
    return result;
}

// пузырчатая сортировка 
// временная сложность: O(n²) в худшем и среднем случае, O(n) в лучшем (уже отсортированный массив с флагом swapped).
function bubbleSort(arr) {
    const result = [...arr];
    const n = result.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            if (result[j] > result[j + 1]) {
                const temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return result;
}
// -------------------- метод бинарного поиска
// временная сложность: O(log n) - логарифмическая.
// Определение значения элемента в середине структуры данных. Полученное значение сравнивается с ключом.
// Если ключ меньше значения середины, то поиск осуществляется в первой половине элементов, иначе — во второй.
// Поиск сводится к тому, что вновь определяется значение серединного элемента в выбранной половине и сравнивается с ключом.
// Процесс продолжается до тех пор, пока не будет найден элемент со значением ключа или не станет пустым интервал для поиска.

function binarySearch(sortedArr, target) {
    let left = 0;
    let right = sortedArr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (sortedArr[mid] === target) {
            return mid;
        }
        if (sortedArr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

// -------
// утилитарный функции
// --------

// форматирование денежной суммы в читаемый вид (ток рубли)
// временная сложность: O(1) / O(k) где k - длина числа.
function formatCurrency(amount, currency = '₽') {
    const str = String(amount);
    const [integerPart, decimalPart] = str.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return decimalPart !== undefined 
        ? `${formattedInteger}.${decimalPart} ${currency}`
        : `${formattedInteger} ${currency}`;
}

// валидность email адреса с помощью regexp
// временная сложность: O(n) - линейная по длине строки.
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// генератор паролей (только заданной длины)
// временная сложность: O(length) - линейная.
function generatePassword(length = 8) {
    if (length < 4) length = 4;
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    const all = lower + upper + digits + special;
    // наличие хотя бы одного символа каждого типа
    const password = [
        lower[Math.floor(Math.random() * lower.length)],
        upper[Math.floor(Math.random() * upper.length)],
        digits[Math.floor(Math.random() * digits.length)],
        special[Math.floor(Math.random() * special.length)]
    ];
    // дополняем случайными символами до требуемой длины
    for (let i = 4; i < length; i++) {
        password.push(all[Math.floor(Math.random() * all.length)]);
    }
    // перемешиваем символы 
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }
    return password.join('');
}