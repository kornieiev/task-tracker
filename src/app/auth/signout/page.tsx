'use client'

// !

// Импорты для работы с клиентскими функциями
import { useEffect } from 'react'
import { signOut } from 'next-auth/react' // Функция выхода из NextAuth.js
import { useRouter } from 'next/navigation' // Навигация в App Router
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'

export default function SignOutPage() {
  // Получаем объект роутера для программной навигации
  const router = useRouter()

  // useEffect - выполняется после монтирования компонента
  useEffect(() => {
    // Auto-sign out after a short delay for better UX
    // Создаем таймер на 2 секунды для автоматического выхода
    // Это дает пользователю время прочитать сообщение и передумать
    const timer = setTimeout(() => {
      handleSignOut() // Автоматически выполняем выход через 2 секунды
    }, 2000)

    return () => clearTimeout(timer)
  }, []) // Пустой массив зависимостей = выполнить только один раз при монтировании

  // Асинхронная функция для выполнения выхода из системы
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/', // После выхода перенаправить на главную страницу
      redirect: true, // Автоматически выполнить редирект
    })
    // После выполнения signOut пользователь будет перенаправлен на '/'
    // Сессия будет очищена, JWT токен удален
  }

  // Функция отмены - возвращает пользователя на предыдущую страницу
  const handleCancel = () => {
    router.back() // Переход назад в истории браузера (как кнопка "Назад")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <LogOut className="h-12 w-12 text-gray-400" />
          </div>
          <CardTitle className="text-2xl">Sign Out</CardTitle>
          <CardDescription>
            You are being signed out of Task Tracker
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Signing out...</span>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSignOut}>
              Sign Out Now
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Thank you for using Task Tracker!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
