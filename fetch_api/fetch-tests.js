// === ТЕСТИРОВАНИЕ FETCH API РЕШЕНИЙ (fetch-tests.js) ===

const FetchTestSuite = {
  results: [],

  async runTest(name, testFn) {
    console.log(`[TEST RUNNING] ${name}...`);
    try {
      await testFn();
      this.results.push({ name, status: 'PASSED', message: 'Тест успешно пройден' });
      console.log(`%c[PASS] ${name}`, 'color: green; font-weight: bold;');
    } catch (err) {
      this.results.push({ name, status: 'FAILED', message: err.message });
      console.error(`[FAIL] ${name}:`, err);
    }
  },

  renderResults() {
    const summary = document.getElementById('tests-summary');
    const container = document.getElementById('tests-container');
    if (!summary || !container) return;

    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const total = this.results.length;

    summary.innerHTML = `<strong>Пройдено тестов: ${passed} из ${total} (${Math.round((passed / total) * 100)}%)</strong>`;
    summary.className = `output ${passed === total ? 'success' : 'error'}`;

    container.innerHTML = this.results.map(r => `
      <div class="test-result ${r.status === 'PASSED' ? 'test-success' : 'test-failure'}">
        <strong>${r.status === 'PASSED' ? '✅' : '❌'} ${r.name}</strong>
        <p style="margin: 4px 0 0; font-size: 0.9rem; color: #555;">${r.message}</p>
      </div>
    `).join('');
  },

  async executeAll() {
    this.results = [];
    const runBtn = document.getElementById('run-all-tests');
    if (runBtn) {
      runBtn.disabled = true;
      runBtn.textContent = 'Идет тестирование...';
    }

    // Тест 1: Проверка buildUrl с параметрами и краевыми случаями (null/undefined)
    await this.runTest('Утилита buildUrl: корректное кодирование и фильтрация null/undefined', async () => {
      const url = buildUrl('https://api.example.com/items', {
        page: 1,
        filter: 'test value',
        empty: null,
        ignored: undefined
      });
      if (!url.includes('page=1')) throw new Error('Параметр page отсутствует');
      if (!url.includes('filter=test+value') && !url.includes('filter=test%20value')) {
        throw new Error('Кодирование пробела выполнено некорректно');
      }
      if (url.includes('empty') || url.includes('ignored')) {
        throw new Error('Параметры со значениями null/undefined не были отфильтрованы');
      }
    });

    // Тест 2: GET запрос к посту
    await this.runTest('GET запрос: получение поста #1', async () => {
      const res = await fetchGetRequest();
      if (!res || res.id !== 1) throw new Error('Ожидался пост с ID = 1');
      if (!res.title || typeof res.title !== 'string') throw new Error('Пост не содержит строковый title');
    });

    // Тест 3: GET запрос пользователей
    await this.runTest('GET JSON: получение списка пользователей', async () => {
      const users = await fetchJsonData();
      if (!Array.isArray(users) || users.length === 0) throw new Error('Ожидался непустой массив пользователей');
      if (!users[0].email || !users[0].name) throw new Error('Пользователь не содержит email или name');
    });

    // Тест 4: POST создание ресурса
    await this.runTest('POST запрос: создание нового поста с возвратом ID', async () => {
      const created = await fetchPostRequest();
      if (!created || !created.id) throw new Error('Сервер не вернул id созданного объекта');
      if (created.userId !== 1) throw new Error('Некорректный userId');
    });

    // Тест 5: PUT обновление ресурса
    await this.runTest('PUT запрос: полная замена ресурса', async () => {
      const updated = await fetchPutRequest();
      if (!updated || updated.id !== 1) throw new Error('Некорректный ID обновленного поста');
      if (!updated.title.includes('PUT')) throw new Error('Заголовок не обновился');
    });

    // Тест 6: PATCH частичное обновление ресурса
    await this.runTest('PATCH запрос: частичная модификация поля', async () => {
      const patched = await fetchPatchRequest();
      if (!patched || !patched.title.includes('PATCH')) throw new Error('Поле title не было модифицировано');
    });

    // Тест 7: DELETE удаление ресурса
    await this.runTest('DELETE запрос: удаление поста с корректным статусом', async () => {
      const deleted = await fetchDeleteRequest();
      if (!deleted || deleted.status !== 200) throw new Error('Ожидался HTTP статус 200 при удалении');
    });

    // Тест 8: Кастомные заголовки
    await this.runTest('Запрос с кастомными заголовками', async () => {
      const posts = await fetchWithHeaders();
      if (!Array.isArray(posts) || posts.length === 0) throw new Error('Данные с кастомными заголовками не получены');
    });

    // Тест 9: URLSearchParams пагинация и фильтрация
    await this.runTest('Запрос с параметрами (_limit=5)', async () => {
      const posts = await fetchWithParams();
      if (!Array.isArray(posts) || posts.length !== 5) throw new Error('Параметр _limit=5 не сработал');
    });

    // Тест 10: Механизм кэширования createFetchCache
    await this.runTest('Кэширование запросов createFetchCache: проверка TTL и повторных вызовов', async () => {
      const customCache = createFetchCache(2000);
      const first = await customCache(`${API_BASE_URL}/posts/1`);
      if (first.fromCache !== false) throw new Error('Первый запрос должен быть из сети (fromCache: false)');

      const second = await customCache(`${API_BASE_URL}/posts/1`);
      if (second.fromCache !== true) throw new Error('Повторный запрос должен быть взят из кэша (fromCache: true)');
    });

    // Тест 11: Параллельное выполнение Promise.all
    await this.runTest('Параллельное выполнение Promise.all: одновременный запрос 3 сущностей', async () => {
      const perf = await fetchWithPromiseAll();
      if (!perf || !perf.result) throw new Error('Promise.all не вернул результат');
      if (perf.result.usersCount < 1 || perf.result.postsCount < 1) throw new Error('Неполные данные в Promise.all');
    });

    // Тест 12: Агрегация связанных данных (User + Posts)
    await this.runTest('Реальный сценарий: агрегация пользователя и его постов', async () => {
      const agg = await fetchUserWithPosts(1);
      if (!agg || !agg.user || !Array.isArray(agg.recentPosts)) throw new Error('Некорректная структура агрегации');
      if (agg.user.id !== 1) throw new Error('Неверный ID пользователя');
    });

    this.renderResults();
    if (runBtn) {
      runBtn.disabled = false;
      runBtn.textContent = 'Запустить все тесты Fetch API';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const runBtn = document.getElementById('run-all-tests');
  if (runBtn) {
    runBtn.addEventListener('click', () => FetchTestSuite.executeAll());
  }
});
