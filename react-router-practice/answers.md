### 1. В чем разница между `Link` и `NavLink` в React Router?

| Критерий | `Link` | `NavLink` |
| :--- | :--- | :--- |
| Назначение | Базовый компонент для декларативной навигации без перезагрузки страницы. | Специальная версия `Link`, предназначенная преимущественно для навигационных меню. |
| Определение активности | Не отслеживает совпадение текущего URL с адресом ссылки. | Автоматически определяет, совпадает ли `to` с текущим URL браузера. |
| Стилизация и классы | Применяет статичный класс или стили. | По умолчанию добавляет CSS-класс `active` к активной ссылке. Поддерживает функцию в `className` и `style` вида `({ isActive }) => ...`. |
| Производительность | Минимальные накладные расходы при рендере. | Выполняет сопоставление маршрута через контекст роутера для вычисления активности. |

Пример использования `NavLink`:
```javascript
<NavLink
  to="/products"
  className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
>
  Товары
</NavLink>
```

### 2. Как получить параметры из URL в компоненте?
Для извлечения динамических параметров пути (path parameters) используется хук `useParams()`:

1. В конфигурации маршрута параметр обозначается двоеточием:
   ```javascript
   <Route path="/products/:id" element={<ProductDetail />} />
   ```
2. В целевом компоненте значение извлекается по имени:
   ```javascript
   import { useParams } from 'react-router-dom';

   const ProductDetail = () => {
     const { id } = useParams();
     return <div>ID товара: {id}</div>;
   };
   ```

Для параметров строки запроса (query parameters, например `?category=books&page=2`) используется хук `useSearchParams()`:
```javascript
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get('category');
```

### 3. Что такое программная навигация и как ее реализовать?
Программная навигация — это переход пользователя между маршрутами не по клику на ссылку (`<Link>`), а в результате выполнения программного кода (после успешной отправки формы, завершения асинхронного запроса, по таймеру или при возникновении ошибки).

В React Router v6 она реализуется через хук `useNavigate()`:
```javascript
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendFeedback();
    
    // Переход на конкретный URL:
    navigate('/contact/success');
    
    // Переход назад по истории:
    // navigate(-1);
  };
};
```

### 4. Как передать данные между маршрутами?
Существует три основных способа передачи данных:

1. Через состояние истории (`state` в `navigate` или `Link`):
   Данные не отображаются в адресной строке и сохраняются в `window.history.state`.
   ```javascript
   // Отправка:
   navigate('/contact/success', { state: { message: 'Успешно!', orderId: 42 } });

   // Получение в целевом компоненте:
   import { useLocation } from 'react-router-dom';
   const location = useLocation();
   const { message, orderId } = location.state || {};
   ```
2. Через параметры пути (`params`):
   Применяется для идентификаторов сущностей (`/products/:id`).
3. Через query-параметры (`query string`):
   Применяется для фильтрации, сортировки и пагинации (`/products?category=books&sort=asc`).

### 5. Что делает компонент `Routes`?
В React Router v6 компонент `Routes` выступает контейнером для всех объявленных элементов `<Route>`:
- Выполняет поиск наиболее подходящего маршрута по текущему URL (алгоритм Best Match вместо строгого порядка следования сверху вниз, как было в v5 `Switch`).
- Гарантирует, что на экране одновременно отобразится только один дочерний `Route`, соответствующий текущему пути.
- Позволяет определять вложенные маршруты и отображать их через `<Outlet />`.

```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 6. Как создать защищённый маршрут?
Защищённый маршрут (Protected Route) ограничивает доступ неавторизованным пользователям и перенаправляет их на страницу входа. 

Реализуется через компонент-обертку с использованием `<Navigate />` и `<Outlet />`:
```javascript
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// В App.js:
<Routes>
  <Route path="/login" element={<Login />} />
  
  <Route element={<ProtectedRoute isAuthenticated={isAuth} />}>
    <Route path="/profile" element={<Profile />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
</Routes>
```

### 7. В чем разница между `useNavigate` и `redirect`?

| Критерий | `useNavigate` | `redirect` |
| :--- | :--- | :--- |
| Тип сущности | React Hook (хук компонента). | Утилитарная функция, возвращающая объект `Response` с HTTP-статусом перенаправления (302). |
| Место применения | Вызывается исключительно внутри тела функциональных React-компонентов или пользовательских хуков. | Используется вне дерева компонентов — внутри функций `loader`, `action` в Data Routers (React Router 6.4+). |
| Принцип работы | Взаимодействует с объектом браузерной истории клиента на этапе жизненного цикла компонента. | Прерывает выполнение текущего лоадера/экшена и передает команду навигации роутеру до рендеринга страницы. |
