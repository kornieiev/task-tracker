import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// withAuth - это HOC (Higher-Order Component) от NextAuth.js
// который оборачивает middleware функцию и добавляет к ней логику аутентификации

export default withAuth(
  // Основная middleware функция - выполняется ПОСЛЕ проверки authorized callback
  function middleware(req) {
    // Check if user is trying to access protected routes

    // Извлекаем путь из URL запроса (например: /dashboard, /tasks, /auth/signin)
    const { pathname } = req.nextUrl

    // Allow access to auth pages when not authenticated

    // ПРОВЕРКА 1: Разрешаем доступ к страницам аутентификации без проверки токена
    // Это позволяет неавторизованным пользователям заходить на /auth/signin, /auth/signup
    if (pathname.startsWith('/auth/')) {
      return NextResponse.next() // Продолжить обработку запроса без изменений
    }

    // Redirect to signin if not authenticated and trying to access protected routes

    // ПРОВЕРКА 2: Редирект неавторизованных пользователей на страницу входа
    // req.nextauth.token - JWT токен пользователя (null если не авторизован)
    // pathname !== '/' - исключаем главную страницу (она публичная)
    if (!req.nextauth.token && pathname !== '/') {
      // Создаем URL для страницы входа на основе текущего запроса
      const signInUrl = new URL('/auth/signin', req.url)
      // Добавляем параметр callbackUrl - куда вернуть пользователя после входа
      signInUrl.searchParams.set('callbackUrl', req.url)
      // Выполняем редирект: /dashboard → /auth/signin?callbackUrl=/dashboard
      return NextResponse.redirect(signInUrl)
    }
    // Если все проверки прошли - продолжаем обычную обработку запроса
    return NextResponse.next()
  },
  {
    // Конфигурация для withAuth с дополнительными настройками
    callbacks: {
      // authorized callback - выполняется ПЕРВЫМ, перед основной middleware функцией
      // Определяет: должен ли вообще запрос попасть в middleware function выше
      authorized: ({ token, req }) => {
        // token - JWT токен пользователя (если авторизован) или null
        // req - объект запроса с информацией об URL
        const { pathname } = req.nextUrl

        // Allow access to public routes
        // БЕЛЫЙ СПИСОК: Публичные маршруты, доступные всем без аутентификации
        if (
          pathname === '/' || // main page
          pathname.startsWith('/auth/') ||
          pathname.startsWith('/api/auth/') || // API auth NextAuth
          pathname.startsWith('/faq') ||
          pathname.startsWith('/terms') ||
          pathname.startsWith('/_next/') || // Next.js system files
          pathname.includes('.') // Static files (favicon, images)
        ) {
          return true // Разрешить доступ БЕЗ проверки аутентификации
        }

        // Require authentication for all other routes
        // ЧЕРНЫЙ СПИСОК: Все остальные маршруты требуют аутентификации
        // !!token преобразует token в boolean:
        // token существует → true (доступ разрешен)
        // token равен null → false (доступ запрещен, сработает редирект в middleware)
        return !!token
      },
    },
  }
)

// Конфигурация определяет, к каким маршрутам применять middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */

    /*
     * Регулярное выражение определяет ВКЛЮЧЕННЫЕ в обработку пути:
     * /((?!api/auth|_next/static|_next/image|favicon.ico).*)
     *
     * Расшифровка:
     * - /( ... )    - начинается с корня
     * - (?! ... )   - negative lookahead (НЕ должно начинаться с)
     * - api/auth    - исключаем API маршруты аутентификации NextAuth.js
     * - _next/static - исключаем статичные файлы Next.js (CSS, JS)
     * - _next/image  - исключаем оптимизированные изображения Next.js
     * - favicon.ico  - исключаем иконку сайта
     * - .*          - любые другие символы после
     *
     * ВКЛЮЧАЕТСЯ В ОБРАБОТКУ: /dashboard, /tasks, /auth/signin, /faq, /terms
     * ИСКЛЮЧАЕТСЯ ИЗ ОБРАБОТКИ: /api/auth/session, /_next/static/css/app.css, /favicon.ico
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}

/*
ПОТОК ВЫПОЛНЕНИЯ:

1. Приходит запрос (например: GET /dashboard)

2. config.matcher проверяет: подходит ли путь под обработку?
   /dashboard подходит (не исключен)

3. authorized callback выполняется:
   - pathname = '/dashboard'
   - Не входит в белый список публичных маршрутов
   - return !!token → если token есть = true, если нет = false

4a. Если authorized вернул true:
    - middleware function выполняется
    - return NextResponse.next() → продолжить к странице

4b. Если authorized вернул false:
    - middleware function выполняется
    - Срабатывает редирект: NextResponse.redirect('/auth/signin?callbackUrl=/dashboard')

5. Результат:
   - Авторизованный пользователь → попадает на /dashboard
   - Неавторизованный пользователь → редирект на /auth/signin
*/
