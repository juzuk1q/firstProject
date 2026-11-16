// === FETCH API - ОСНОВНЫЕ ЗАДАНИЯ ===
// Базовый URL для JSONPlaceholder API
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// ==========================================
// ЗАДАНИЕ 1: Базовые GET запросы
// ==========================================

// 1.1. Создайте функцию fetchGetRequest, которая выполняет простой GET запрос
async function fetchGetRequest() {
  setLoadingState('fetch-get', true);
  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`);
    if (!response.ok) {
      throw new Error(`HTTP ошибка! Статус: ${response.status}`);
    }
    const data = await response.json();
    displayOutput('get-output', data);
    return data;
  } catch (error) {
    displayOutput('get-output', error, true);
    throw error;
  } finally {
    setLoadingState('fetch-get', false);
  }
}

// 1.2. Создайте функцию fetchJsonData, которая получает и отображает JSON данные
async function fetchJsonData() {
  setLoadingState('fetch-json', true);
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`HTTP ошибка! Статус: ${response.status}`);
    }
    const users = await response.json();
    displayData('get-data', users);
    displayOutput('get-output', `Успешно загружено пользователей: ${users.length}`);
    return users;
  } catch (error) {
    displayOutput('get-output', error, true);
    throw error;
  } finally {
    setLoadingState('fetch-json', false);
  }
}

// 1.3. Создайте функцию fetchWithError, которая тестирует обработку ошибок
async function fetchWithError() {
  setLoadingState('fetch-error', true);
  try {
    // Демонстрация HTTP ошибки (404 Not Found)
    const response = await fetch(`${API_BASE_URL}/non-existent-endpoint-404`);
    if (!response.ok) {
      const errorDetails = {
        type: 'HTTP Error',
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        explanation: 'Fetch НЕ реджектит промис при 404/500! Статус нужно проверять вручную через response.ok.'
      };
      displayOutput('get-output', errorDetails, true);
      return errorDetails;
    }
  } catch (networkError) {
    // Сетевая ошибка (DNS failure, off-line)
    displayOutput('get-output', {
      type: 'Network Error',
      message: networkError.message,
      explanation: 'Сетевая ошибка отклоняет (reject) промис fetch.'
    }, true);
  } finally {
    setLoadingState('fetch-error', false);
  }
}

// 1.4. Создайте функцию setupGetRequests, которая настраивает обработчики
function setupGetRequests() {
  const btnGet = document.getElementById('fetch-get');
  const btnJson = document.getElementById('fetch-json');
  const btnError = document.getElementById('fetch-error');

  if (btnGet) btnGet.addEventListener('click', fetchGetRequest);
  if (btnJson) btnJson.addEventListener('click', fetchJsonData);
  if (btnError) btnError.addEventListener('click', fetchWithError);
}

// ==========================================
// ЗАДАНИЕ 2: POST, PUT, DELETE запросы
// ==========================================

// 2.1. Создайте функцию fetchPostRequest, которая отправляет POST запрос
async function fetchPostRequest() {
  setLoadingState('fetch-post', true);
  try {
    const newPost = {
      title: 'Новый тестовый заголовок поста',
      body: 'Тело созданного через Fetch API поста для практической работы.',
      userId: 1
    };

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(newPost)
    });

    if (!response.ok) {
      throw new Error(`Ошибка POST: ${response.status}`);
    }

    const createdPost = await response.json();
    displayOutput('crud-output', {
      action: 'POST (Создание ресурса)',
      status: response.status,
      data: createdPost
    });
    return createdPost;
  } catch (error) {
    displayOutput('crud-output', error, true);
    throw error;
  } finally {
    setLoadingState('fetch-post', false);
  }
}

// 2.2. Создайте функцию fetchPutRequest, которая отправляет PUT запрос
async function fetchPutRequest() {
  setLoadingState('fetch-put', true);
  try {
    const updatedPost = {
      id: 1,
      title: 'Полностью обновленный заголовок (PUT)',
      body: 'Полностью замененный текст тела поста.',
      userId: 1
    };

    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(updatedPost)
    });

    if (!response.ok) {
      throw new Error(`Ошибка PUT: ${response.status}`);
    }

    const data = await response.json();
    displayOutput('crud-output', {
      action: 'PUT (Полная замена ресурса)',
      status: response.status,
      data
    });
    return data;
  } catch (error) {
    displayOutput('crud-output', error, true);
    throw error;
  } finally {
    setLoadingState('fetch-put', false);
  }
}

// 2.3. Создайте функцию fetchPatchRequest, которая отправляет PATCH запрос
async function fetchPatchRequest() {
  setLoadingState('fetch-patch', true);
  try {
    const patchData = {
      title: 'Частично измененный заголовок (PATCH)'
    };

    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(patchData)
    });

    if (!response.ok) {
      throw new Error(`Ошибка PATCH: ${response.status}`);
    }

    const data = await response.json();
    displayOutput('crud-output', {
      action: 'PATCH (Частичное обновление)',
      explanation: 'В отличие от PUT, передается только изменяемое поле title, остальные сохраняются.',
      status: response.status,
      data
    });
    return data;
  } catch (error) {
    displayOutput('crud-output', error, true);
    throw error;
  } finally {
    setLoadingState('fetch-patch', false);
  }
}

// 2.4. Создайте функцию fetchDeleteRequest, которая отправляет DELETE запрос
async function fetchDeleteRequest() {
  setLoadingState('fetch-delete', true);
  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Ошибка DELETE: ${response.status}`);
    }

    const result = {
      action: 'DELETE (Удаление ресурса)',
      status: response.status,
      message: 'Пост с ID 1 успешно удален из системы'
    };

    displayOutput('crud-output', result);
    return result;
  } catch (error) {
    displayOutput('crud-output', error, true);
    throw error;
  } finally {
    setLoadingState('fetch-delete', false);
  }
}

// 2.5. Создайте функцию setupCrudRequests, которая настраивает обработчики
function setupCrudRequests() {
  const btnPost = document.getElementById('fetch-post');
  const btnPut = document.getElementById('fetch-put');
  const btnPatch = document.getElementById('fetch-patch');
  const btnDelete = document.getElementById('fetch-delete');

  if (btnPost) btnPost.addEventListener('click', fetchPostRequest);
  if (btnPut) btnPut.addEventListener('click', fetchPutRequest);
  if (btnPatch) btnPatch.addEventListener('click', fetchPatchRequest);
  if (btnDelete) btnDelete.addEventListener('click', fetchDeleteRequest);
}

// ==========================================
// ЗАДАНИЕ 3: Заголовки и параметры
// ==========================================

// 3.1. Создайте функцию fetchWithHeaders, которая отправляет запрос с кастомными заголовками
async function fetchWithHeaders() {
  setLoadingState('fetch-headers', true);
  try {
    const customHeaders = {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'CustomClientVersion-2.0',
      'X-Request-Source': 'WebClient',
      'Authorization': 'Bearer sample_token_12345'
    };

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'GET',
      headers: customHeaders
    });

    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

    const data = await response.json();
    displayOutput('headers-output', {
      message: 'Запрос с кастомными заголовками отправлен успешно',
      sentHeaders: customHeaders,
      postsReceived: data.length
    });
    return data;
  } catch (error) {
    displayOutput('headers-output', error, true);
    throw error;
  } finally {
    setLoadingState('fetch-headers', false);
  }
}

// 3.2. Создайте функцию fetchWithAuth, которая имитирует авторизацию
async function fetchWithAuth() {
  setLoadingState('fetch-auth', true);
  try {
    // 1. Способ Bearer Token (JWT)
    const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.testToken';
    // 2. Способ Basic Auth (base64 username:password)
    const basicAuth = btoa('student_user:secret_password_2026');

    const authHeaders = {
      'Authorization': `Bearer ${bearerToken}`,
      'X-Alternative-Auth': `Basic ${basicAuth}`
    };

    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      headers: authHeaders
    });

    const post = await response.json();
    displayOutput('headers-output', {
      authTypesDemo: {
        bearer: `Authorization: Bearer ${bearerToken.slice(0, 20)}...`,
        basic: `Authorization: Basic ${basicAuth}`
      },
      status: response.status,
      result: 'Успешная авторизованная выборка данных',
      post
    });
    return post;
  } catch (error) {
    displayOutput('headers-output', error, true);
    throw error;
  } finally {
    setLoadingState('fetch-auth', false);
  }
}

// 3.3. Создайте функцию fetchWithParams, которая добавляет параметры к URL
async function fetchWithParams() {
  setLoadingState('fetch-params', true);
  try {
    const params = {
      _limit: 5,
      _sort: 'id',
      _order: 'desc'
    };

    const targetUrl = buildUrl(`${API_BASE_URL}/posts`, params);
    const response = await fetch(targetUrl);

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const posts = await response.json();
    displayOutput('headers-output', {
      requestedUrl: targetUrl,
      appliedParams: params,
      resultsCount: posts.length,
      samplePosts: posts.map(p => ({ id: p.id, title: p.title }))
    });
    return posts;
  } catch (error) {
    displayOutput('headers-output', error, true);
    throw error;
  } finally {
    setLoadingState('fetch-params', false);
  }
}

// 3.4. Создайте функцию fetchWithTimeout, которая реализует таймаут для запроса
async function fetchWithTimeout(timeoutMs = 3000) {
  setLoadingState('fetch-timeout', true);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const startTime = Date.now();
    const response = await fetch(`${API_BASE_URL}/photos`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    const elapsed = Date.now() - startTime;
    displayOutput('headers-output', {
      message: `Запрос завершился вовремя за ${elapsed} мс (лимит таймаута: ${timeoutMs} мс)`,
      itemsReceived: data.length
    });
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      displayOutput('headers-output', {
        type: 'TimeoutError',
        message: `Запрос был автоматически отменен AbortController по истечении ${timeoutMs} мс!`
      }, true);
    } else {
      displayOutput('headers-output', error, true);
    }
  } finally {
    clearTimeout(timeoutId);
    setLoadingState('fetch-timeout', false);
  }
}

// 3.5. Создайте функцию setupHeadersAndParams, которая настраивает обработчики
function setupHeadersAndParams() {
  const btnHeaders = document.getElementById('fetch-headers');
  const btnAuth = document.getElementById('fetch-auth');
  const btnParams = document.getElementById('fetch-params');
  const btnTimeout = document.getElementById('fetch-timeout');

  if (btnHeaders) btnHeaders.addEventListener('click', fetchWithHeaders);
  if (btnAuth) btnAuth.addEventListener('click', fetchWithAuth);
  if (btnParams) btnParams.addEventListener('click', fetchWithParams);
  if (btnTimeout) btnTimeout.addEventListener('click', () => fetchWithTimeout(3000));
}

// ==========================================
// ЗАДАНИЕ 4: Обработка ответов
// ==========================================

// 4.1. Создайте функцию fetchAndCheckStatus, которая проверяет статус ответа
async function fetchAndCheckStatus() {
  setLoadingState('fetch-status', true);
  try {
    const urls = [
      { url: `${API_BASE_URL}/posts/1`, label: 'Корректный URL (200 OK)' },
      { url: `${API_BASE_URL}/posts/999999`, label: 'Несуществующий ID (404 Not Found)' }
    ];

    const results = [];
    for (const item of urls) {
      const res = await fetch(item.url);
      results.push({
        test: item.label,
        status: res.status,
        statusText: res.statusText,
        ok: res.ok
      });
    }

    displayOutput('response-output', {
      description: 'Проверка response.ok для диапазонов 200-299',
      checks: results
    });
    return results;
  } catch (error) {
    displayOutput('response-output', error, true);
  } finally {
    setLoadingState('fetch-status', false);
  }
}

// 4.2. Создайте функцию fetchAndReadHeaders, которая читает заголовки ответа
async function fetchAndReadHeaders() {
  setLoadingState('fetch-headers-response', true);
  try {
    const response = await fetch(`${API_BASE_URL}/posts/1`);
    const headersList = {};

    response.headers.forEach((val, key) => {
      headersList[key] = val;
    });

    displayOutput('response-output', {
      keyHeaders: {
        'content-type': response.headers.get('content-type'),
        'cache-control': response.headers.get('cache-control'),
        'date': response.headers.get('date')
      },
      allHeaders: headersList
    });
    return headersList;
  } catch (error) {
    displayOutput('response-output', error, true);
  } finally {
    setLoadingState('fetch-headers-response', false);
  }
}

// 4.3. Создайте функцию fetchBlobData, которая работает с бинарными данными
async function fetchBlobData() {
  setLoadingState('fetch-blob', true);
  try {
    // Используем надежный сервис генерации аватаров или изображений
    const response = await fetch('https://picsum.photos/200/200');
    if (!response.ok) throw new Error(`Ошибка загрузки изображения: ${response.status}`);

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    const container = document.getElementById('response-data');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 10px;">
          <h4>Загруженный Blob (размер: ${(blob.size / 1024).toFixed(1)} КБ, тип: ${blob.type})</h4>
          <img src="${imageUrl}" alt="Blob image" style="border-radius: 8px; margin-top: 10px; max-width: 200px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);" />
        </div>
      `;
    }

    displayOutput('response-output', {
      message: 'Blob успешно получен и сконвертирован в ObjectURL',
      size: `${blob.size} байт`,
      type: blob.type,
      objectUrl: imageUrl
    });
    return imageUrl;
  } catch (error) {
    displayOutput('response-output', error, true);
  } finally {
    setLoadingState('fetch-blob', false);
  }
}

// 4.4. Создайте функцию fetchWithFormData, которая отправляет FormData
async function fetchWithFormData() {
  setLoadingState('fetch-formdata', true);
  try {
    const formData = new FormData();
    formData.append('username', 'student_alex');
    formData.append('role', 'Developer');
    formData.append('submissionDate', new Date().toISOString());

    // Имитируем отправку на jsonplaceholder
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      body: formData
      // Обратите внимание: Content-Type НЕ указывается вручную, браузер сам выставит multipart/form-data с boundary!
    });

    const result = await response.json();
    displayOutput('response-output', {
      method: 'POST с FormData',
      note: 'Браузер автоматически сформировал заголовок multipart/form-data',
      receivedResponse: result
    });
    return result;
  } catch (error) {
    displayOutput('response-output', error, true);
  } finally {
    setLoadingState('fetch-formdata', false);
  }
}

// 4.5. Создайте функцию setupResponseHandling, которая настраивает обработчики
function setupResponseHandling() {
  const btnStatus = document.getElementById('fetch-status');
  const btnHeaders = document.getElementById('fetch-headers-response');
  const btnBlob = document.getElementById('fetch-blob');
  const btnFormData = document.getElementById('fetch-formdata');

  if (btnStatus) btnStatus.addEventListener('click', fetchAndCheckStatus);
  if (btnHeaders) btnHeaders.addEventListener('click', fetchAndReadHeaders);
  if (btnBlob) btnBlob.addEventListener('click', fetchBlobData);
  if (btnFormData) btnFormData.addEventListener('click', fetchWithFormData);
}

// ==========================================
// ЗАДАНИЕ 5: Обработка ошибок
// ==========================================

// 5.1. Создайте функцию fetchNetworkError, которая обрабатывает сетевые ошибки
async function fetchNetworkError() {
  setLoadingState('fetch-network-error', true);
  try {
    // Несуществующий домен для гарантированного вызова сетевой ошибки (DNS / Network error)
    await fetch('https://invalid-non-existent-domain-xyz-987654.com');
  } catch (error) {
    displayOutput('error-output', {
      type: 'Network Error (Сетевая ошибка)',
      message: error.message,
      explanation: 'Браузер отклонил промис fetch, так как сетевое соединение с хостом не удалось установить.'
    }, true);
  } finally {
    setLoadingState('fetch-network-error', false);
  }
}

// 5.2. Создайте функцию fetchHttpError, которая обрабатывает HTTP ошибки
async function fetchHttpError() {
  setLoadingState('fetch-http-error', true);
  try {
    const response = await fetch(`${API_BASE_URL}/posts/999999999`);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: Ресурс не найден (${response.statusText})`);
    }
  } catch (error) {
    displayOutput('error-output', {
      type: 'HTTP Error (Ошибка статуса ответа)',
      message: error.message,
      rule: 'Всегда проверяйте if (!response.ok) для перехвата 4xx и 5xx статусов.'
    }, true);
  } finally {
    setLoadingState('fetch-http-error', false);
  }
}

// 5.3. Создайте функцию fetchWithAbort, которая демонстрирует отмену запроса
let globalAbortController = null;
async function fetchWithAbort() {
  if (globalAbortController) {
    globalAbortController.abort();
    displayOutput('error-output', 'Предыдущий незавершенный запрос был отменен!', true);
  }

  globalAbortController = new AbortController();
  setLoadingState('fetch-abort', true);

  try {
    displayOutput('error-output', 'Запрос отправлен. Задержка 500мс перед ручной отменой...');
    const timer = setTimeout(() => {
      if (globalAbortController) {
        globalAbortController.abort();
      }
    }, 500);

    const response = await fetch(`${API_BASE_URL}/photos`, {
      signal: globalAbortController.signal
    });

    clearTimeout(timer);
    const data = await response.json();
    displayOutput('error-output', `Запрос успел завершиться: получено ${data.length} элементов.`);
  } catch (error) {
    if (error.name === 'AbortError') {
      displayOutput('error-output', {
        type: 'AbortError',
        message: 'Запрос был успешно отменен с помощью AbortController.abort()!',
        canceledAt: new Date().toLocaleTimeString()
      }, true);
    } else {
      displayOutput('error-output', error, true);
    }
  } finally {
    globalAbortController = null;
    setLoadingState('fetch-abort', false);
  }
}

// 5.4. Создайте функцию fetchWithRetry, которая реализует повторные попытки
async function fetchWithRetry(url, options = {}, retries = 3, delay = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Попытка ${attempt} из ${retries} для ${url}...`);
      const response = await fetch(url, options);
      if (!response.ok && response.status >= 500) {
        throw new Error(`Сервер вернул статус ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Попытка ${attempt} не удалась: ${error.message}`);
      if (attempt === retries) {
        throw new Error(`Все ${retries} попыток завершились сбоем: ${error.message}`);
      }
      // Экспоненциальная задержка (exponential backoff)
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

async function handleRetryButtonClick() {
  setLoadingState('fetch-retry', true);
  try {
    const data = await fetchWithRetry(`${API_BASE_URL}/posts/1`, {}, 3, 300);
    displayOutput('error-output', {
      status: 'Успех после механизма повторных попыток (Retry)',
      data
    });
  } catch (err) {
    displayOutput('error-output', err, true);
  } finally {
    setLoadingState('fetch-retry', false);
  }
}

// 5.5. Создайте функцию setupErrorHandling, которая настраивает обработчики ошибок
function setupErrorHandling() {
  const btnNetwork = document.getElementById('fetch-network-error');
  const btnHttp = document.getElementById('fetch-http-error');
  const btnAbort = document.getElementById('fetch-abort');
  const btnRetry = document.getElementById('fetch-retry');

  if (btnNetwork) btnNetwork.addEventListener('click', fetchNetworkError);
  if (btnHttp) btnHttp.addEventListener('click', fetchHttpError);
  if (btnAbort) btnAbort.addEventListener('click', fetchWithAbort);
  if (btnRetry) btnRetry.addEventListener('click', handleRetryButtonClick);
}

// ==========================================
// ЗАДАНИЕ 6: Параллельные запросы
// ==========================================

// 6.1. Создайте функцию fetchWithPromiseAll, которая использует Promise.all
async function fetchWithPromiseAll() {
  setLoadingState('fetch-all', true);
  try {
    const measurement = await measureExecutionTime(async () => {
      const [users, posts, albums] = await Promise.all([
        fetch(`${API_BASE_URL}/users`).then(r => r.json()),
        fetch(`${API_BASE_URL}/posts`).then(r => r.json()),
        fetch(`${API_BASE_URL}/albums`).then(r => r.json())
      ]);
      return { usersCount: users.length, postsCount: posts.length, albumsCount: albums.length };
    });

    displayOutput('parallel-output', {
      method: 'Promise.all (Параллельное выполнение)',
      timeElapsedMs: measurement.executionTime,
      results: measurement.result
    });
    return measurement;
  } catch (error) {
    displayOutput('parallel-output', error, true);
  } finally {
    setLoadingState('fetch-all', false);
  }
}

// 6.2. Создайте функцию fetchWithPromiseRace, которая использует Promise.race
async function fetchWithPromiseRace() {
  setLoadingState('fetch-race', true);
  try {
    // Симулируем гонку двух запросов
    const winner = await Promise.race([
      fetch(`${API_BASE_URL}/posts/1`).then(async r => ({ source: 'posts/1', data: await r.json() })),
      fetch(`${API_BASE_URL}/users/1`).then(async r => ({ source: 'users/1', data: await r.json() }))
    ]);

    displayOutput('parallel-output', {
      method: 'Promise.race (Победитель первого ответа)',
      firstToResolve: winner.source,
      data: winner.data
    });
    return winner;
  } catch (error) {
    displayOutput('parallel-output', error, true);
  } finally {
    setLoadingState('fetch-race', false);
  }
}

// 6.3. Создайте функцию fetchSequentialRequests, которая выполняет последовательные запросы
async function fetchSequentialRequests() {
  setLoadingState('fetch-sequential', true);
  try {
    const measurement = await measureExecutionTime(async () => {
      // 1. Сначала получаем пользователя
      const userRes = await fetch(`${API_BASE_URL}/users/1`);
      const user = await userRes.json();

      // 2. Затем получаем его первый пост
      const postsRes = await fetch(`${API_BASE_URL}/posts?userId=${user.id}`);
      const posts = await postsRes.json();
      const firstPost = posts[0];

      // 3. Затем получаем комментарии к этому посту
      const commentsRes = await fetch(`${API_BASE_URL}/comments?postId=${firstPost.id}`);
      const comments = await commentsRes.json();

      return {
        user: user.name,
        postTitle: firstPost.title,
        commentsCount: comments.length
      };
    });

    displayOutput('parallel-output', {
      method: 'Последовательные зависимые запросы (Sequential)',
      timeElapsedMs: measurement.executionTime,
      result: measurement.result
    });
    return measurement;
  } catch (error) {
    displayOutput('parallel-output', error, true);
  } finally {
    setLoadingState('fetch-sequential', false);
  }
}

// 6.4. Создайте функцию setupParallelRequests, которая настраивает обработчики
function setupParallelRequests() {
  const btnAll = document.getElementById('fetch-all');
  const btnRace = document.getElementById('fetch-race');
  const btnSequential = document.getElementById('fetch-sequential');

  if (btnAll) btnAll.addEventListener('click', fetchWithPromiseAll);
  if (btnRace) btnRace.addEventListener('click', fetchWithPromiseRace);
  if (btnSequential) btnSequential.addEventListener('click', fetchSequentialRequests);
}

// ==========================================
// ЗАДАНИЕ 7: Реальные сценарии
// ==========================================

// 7.1. Создайте функцию fetchUserWithPosts, которая получает пользователя и его посты
async function fetchUserWithPosts(userId = 1) {
  setLoadingState('fetch-user-posts', true);
  try {
    const [user, posts] = await Promise.all([
      fetch(`${API_BASE_URL}/users/${userId}`).then(r => r.json()),
      fetch(`${API_BASE_URL}/posts?userId=${userId}`).then(r => r.json())
    ]);

    const combined = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company?.name
      },
      postsCount: posts.length,
      recentPosts: posts.slice(0, 3)
    };

    displayData('scenario-data', posts.slice(0, 3));
    displayOutput('scenario-output', combined);
    return combined;
  } catch (error) {
    displayOutput('scenario-output', error, true);
  } finally {
    setLoadingState('fetch-user-posts', false);
  }
}

// 7.2. Создайте функцию fetchWithSearch, которая реализует поиск
async function fetchWithSearch(keyword = 'qui') {
  setLoadingState('fetch-search', true);
  try {
    const response = await fetch(`${API_BASE_URL}/posts?title_like=${encodeURIComponent(keyword)}`);
    const posts = await response.json();

    displayData('scenario-data', posts.slice(0, 5));
    displayOutput('scenario-output', {
      keyword,
      foundCount: posts.length,
      sample: posts.slice(0, 3).map(p => ({ id: p.id, title: p.title }))
    });
    return posts;
  } catch (error) {
    displayOutput('scenario-output', error, true);
  } finally {
    setLoadingState('fetch-search', false);
  }
}

// 7.3. Создайте функцию simulateFileUpload, которая симулирует загрузку файла
async function simulateFileUpload() {
  setLoadingState('fetch-upload', true);
  const container = document.getElementById('scenario-data');
  if (container) {
    container.innerHTML = `
      <div style="padding: 10px;">
        <h4>Прогресс отправки файла:</h4>
        <div class="progress-bar">
          <div id="upload-progress-fill" class="progress-fill"></div>
        </div>
        <div id="upload-status-text" style="font-weight: bold; color: #27ae60;">0%</div>
      </div>
    `;
  }

  const fill = document.getElementById('upload-progress-fill');
  const statusText = document.getElementById('upload-status-text');

  for (let percent = 10; percent <= 100; percent += 20) {
    await new Promise(r => setTimeout(r, 150));
    if (fill) fill.style.width = `${percent}%`;
    if (statusText) statusText.textContent = `${percent}% Загружено...`;
  }

  try {
    const dummyBlob = new Blob(['Тестовое содержимое файла для симуляции загрузки'], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', dummyBlob, 'report_2026.txt');

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (statusText) statusText.textContent = '100% Загрузка успешно завершена!';
    displayOutput('scenario-output', {
      status: 'Успешная загрузка файла',
      fileSize: `${dummyBlob.size} bytes`,
      serverResponse: result
    });
    return result;
  } catch (error) {
    displayOutput('scenario-output', error, true);
  } finally {
    setLoadingState('fetch-upload', false);
  }
}

// 7.4. Создайте функцию createFetchCache, которая кэширует результаты запросов
function createFetchCache(ttlMs = 10000) {
  const cache = new Map();

  return async function cachedFetch(url, options = {}) {
    const key = `${url}-${JSON.stringify(options)}`;
    const now = Date.now();

    if (cache.has(key)) {
      const cached = cache.get(key);
      if (now - cached.timestamp < ttlMs) {
        console.log(`[Cache HIT] Результат извлечен из кэша: ${url}`);
        return { data: cached.data, fromCache: true, ageMs: now - cached.timestamp };
      }
      cache.delete(key);
    }

    console.log(`[Cache MISS] Выполняется реальный сетевой запрос: ${url}`);
    const response = await fetch(url, options);
    const data = await response.json();

    cache.set(key, { data, timestamp: now });
    return { data, fromCache: false, ageMs: 0 };
  };
}

const appCacheFetch = createFetchCache(15000);

async function handleCacheButtonClick() {
  setLoadingState('fetch-cache', true);
  try {
    const res1 = await appCacheFetch(`${API_BASE_URL}/posts/1`);
    displayOutput('scenario-output', {
      firstCall: { fromCache: res1.fromCache, title: res1.data.title },
      info: 'Повторный вызов в течение 15 секунд вернет ответ мгновенно из кэша'
    });
  } catch (error) {
    displayOutput('scenario-output', error, true);
  } finally {
    setLoadingState('fetch-cache', false);
  }
}

// 7.5. Создайте функцию setupRealScenarios, которая настраивает обработчики
function setupRealScenarios() {
  const btnUserPosts = document.getElementById('fetch-user-posts');
  const btnSearch = document.getElementById('fetch-search');
  const btnUpload = document.getElementById('fetch-upload');
  const btnCache = document.getElementById('fetch-cache');

  if (btnUserPosts) btnUserPosts.addEventListener('click', () => fetchUserWithPosts(1));
  if (btnSearch) btnSearch.addEventListener('click', () => fetchWithSearch('qui'));
  if (btnUpload) btnUpload.addEventListener('click', simulateFileUpload);
  if (btnCache) btnCache.addEventListener('click', handleCacheButtonClick);
}

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (из скриншотов задания)
// ==========================================

// Функция для вывода результатов с форматированием
function displayOutput(elementId, data, isError = false) {
  const output = document.getElementById(elementId);
  if (!output) return;

  const timestamp = new Date().toLocaleTimeString();
  let content;

  if (typeof data === 'object' && !(data instanceof Error)) {
    content = JSON.stringify(data, null, 2);
  } else if (data instanceof Error) {
    content = `Ошибка: ${data.message}\n${data.stack || ''}`;
  } else {
    content = String(data);
  }

  output.innerHTML = `[${timestamp}] ${content}`;
  output.className = `output ${isError ? 'error' : 'success'}`;
}

// Функция для отображения данных в контейнере
function displayData(elementId, data) {
  const container = document.getElementById(elementId);
  if (!container) return;

  if (Array.isArray(data)) {
    container.innerHTML = data.map(item => `
      <div class="user-card">
        <h4>${item.name || item.title || 'Без названия'}</h4>
        <p>Email: ${item.email || 'Нет'}</p>
        <p>Телефон: ${item.phone || 'Нет'}</p>
        <p>${item.body || item.description || ''}</p>
      </div>
    `).join('');
  } else if (typeof data === 'object') {
    container.innerHTML = `
      <div class="json-view">${JSON.stringify(data, null, 2)}</div>
    `;
  } else {
    container.innerHTML = `<p>${String(data)}</p>`;
  }
}

// Функция для добавления спиннера загрузки
function setLoadingState(buttonId, isLoading) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span>Загрузка...';
  } else {
    button.disabled = false;
    // Восстанавливаем оригинальный текст из data-атрибута или из текста кнопки
    const originalText = button.getAttribute('data-original-text') || button.textContent;
    button.innerHTML = originalText;
  }
}

// Функция для создания URL с параметрами
function buildUrl(baseUrl, params = {}) {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
}

// Утилита для измерения времени выполнения
async function measureExecutionTime(asyncFunction) {
  const startTime = Date.now();
  const result = await asyncFunction();
  const endTime = Date.now();
  return {
    result,
    executionTime: endTime - startTime
  };
}

// ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ
function initializeFetchAPI() {
  // Вызовите все функции настройки:
  setupGetRequests();
  setupCrudRequests();
  setupHeadersAndParams();
  setupResponseHandling();
  setupErrorHandling();
  setupParallelRequests();
  setupRealScenarios();

  // Сохраняем оригинальные тексты кнопок
  document.querySelectorAll('button').forEach(button => {
    button.setAttribute('data-original-text', button.textContent);
  });

  console.log('Все обработчики Fetch API инициализированы!');
}

// Запуск инициализации когда DOM загружен
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeFetchAPI);
}
