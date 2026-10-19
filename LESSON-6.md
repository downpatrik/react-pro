# LESSON-6 - Защищённые маршруты и авторизация

## Запуск

```bash
npm ci
npm run dev # http://localhost:5173/login
npm run build
npm run lint
```

- `/login` - вход по email и паролю.
- `/register` - создание аккаунта с именем, email, паролем и ролями.
- `/profile` - защищённый профиль с именем пользователя и кнопкой выхода.
- `/public` - открытая страница, доступная до и после авторизации.

## Чеклист задания

- [x] **ProtectedRoute и useAuth - критерии на 3 балла.**
      [AuthContext](src/features/authRouting/model/AuthContext.tsx) предоставляет
      токен, пользователя, состояния загрузки и ошибки, методы входа и выхода.
      [useAuth](src/features/authRouting/model/useAuth.ts) получает контекст через
      `useContext` и проверяет наличие провайдера.
      [ProtectedRoute](src/features/authRouting/ui/ProtectedRoute.tsx) проверяет
      токен через контекст. Без авторизации возвращается
      `<Navigate to="/login" replace />`, с токеном - `<Outlet />`.
      Чтения `localStorage` внутри защиты маршрута нет.
      [AuthProvider](src/features/authRouting/model/AuthProvider.tsx) восстанавливает
      токен при начальной инициализации.
- [x] **LoginPage - критерии на 3 балла.**
      [LoginPage](src/pages/login/ui/LoginPage.tsx) содержит обязательные поля
      email и password. React Hook Form проверяет обязательность, Zod - формат
      email. Пробелы по краям email удаляются, пароль не преобразуется.
      Отправляется асинхронный `POST /auth/login` через RTK Query mutation.
      После успеха токен сохраняется в `localStorage` под ключом `authToken`,
      контекст обновляется и выполняется переход на `/profile` с `replace: true`.
      Во время запроса поля и кнопка заблокированы.
- [x] **ProfilePage - критерии на 3 балла.**
      [ProfilePage](src/pages/profile/ui/ProfilePage.tsx) доступна через вложенный
      защищённый маршрут. Пользователь загружается запросом `GET /users/me`
      с заголовком `Authorization: Bearer <token>` и доступен странице через
      контекст. Отображаются имя с сервера и email, если он присутствует.
      После обновления страницы сессия восстанавливается, профиль запрашивается
      заново.
- [x] **Бонус: PublicPage и выход - критерии на 3 балла.**
      [PublicPage](src/pages/public/ui/PublicPage.tsx) открывается без токена
      и после входа. Кнопка «Выйти» в профиле удаляет `authToken`, очищает
      сессию и кеш авторизации, затем вызывает
      `navigate("/login", { replace: true })`. Повторное открытие `/profile`
      после выхода перенаправляет на `/login`.

## RTK Query и контекст

В [authApi](src/features/authRouting/api/authApi.ts) создан отдельный `createApi`
с `reducerPath: "authApi"`. Используется `fetchBaseQuery` с таймаутом 15 секунд.
`register` и `login` описаны как mutation, `getMe` - как query; экспортируются
`useRegisterMutation`, `useLoginMutation` и `useGetMeQuery`.

Серверные данные, загрузка и ошибка управляются RTK Query. 

## Адреса API

- Рабочий адрес: `https://api.v2.react-learning.ru`.
- Swagger-документация: `https://api.v2.react-learning.ru/api`.
- Регистрация: `POST https://api.v2.react-learning.ru/auth/register`.
- Вход: `POST https://api.v2.react-learning.ru/auth/login`.
- Профиль: `GET https://api.v2.react-learning.ru/users/me`.

## Регистрация

`/register` использует тот же API через `useRegisterMutation`.
[RegisterPage](src/pages/register/ui/RegisterPage.tsx) передаёт форме callback
и отправляет `{ name, email, password, roles }` на `POST /auth/register`.
Так слайсы `user-register` и `authRouting` не импортируют друг друга.

Вместо социальных ссылок используются чекбоксы `USER` и `ADMIN`.
По умолчанию выбрана `USER`, хотя бы одна роль обязательна.
React Hook Form и Zod проверяют поля и совпадение паролей; подтверждение пароля
не передаётся на сервер. Поля блокируются до завершения запроса.
Ответ 409 показывает, что email занят; после ошибки значения сохраняются.