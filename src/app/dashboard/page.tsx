'use client'

// !

import { useSession } from 'next-auth/react' // Хук для получения сессии пользователя
import { trpc } from '@/lib/trpc/client' // tRPC клиент для типизированных API вызовов
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckSquare, Plus, LogOut, User, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

export default function DashboardPage() {
  // СОСТОЯНИЕ АУТЕНТИФИКАЦИИ
  // Получаем данные сессии и статус загрузки из NextAuth.js
  const { data: session, status } = useSession()

  // ЗАПРОС СТАТИСТИКИ ЗАДАЧ
  // tRPC хук для получения статистики (общее количество, завершенные, процент выполнения)
  const { data: stats, isLoading: statsLoading } = trpc.getTaskStats.useQuery(
    undefined, // Параметры запроса (не требуются)
    {
      enabled: !!session, // Выполнять запрос только если пользователь авторизован
    }
  )

  // ЗАПРОС СПИСКА ЗАДАЧ
  // tRPC хук для получения всех задач пользователя
  const { data: tasks, isLoading: tasksLoading } = trpc.getTasks.useQuery(
    undefined, // Параметры запроса (не требуются)
    {
      enabled: !!session, // Выполнять запрос только если пользователь авторизован
    }
  )

  // СОСТОЯНИЕ ЗАГРУЗКИ АУТЕНТИФИКАЦИИ
  // Показываем спиннер пока NextAuth.js проверяет сессию
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // ЗАЩИТА ОТ НЕАВТОРИЗОВАННОГО ДОСТУПА
  // Если сессии нет - показываем экран доступа запрещен
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Please sign in to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <CheckSquare className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Task Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-4 w-4" />
                <span>{session.user?.name || session.user?.email}</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/signout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user?.name || 'User'}! 👋
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Here&apos;s your task overview. Ready to be productive?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    All your tasks
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.completed || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.completionRate || 0}% completion rate
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <CheckSquare className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-orange-600">
                    {(stats?.todo || 0) + (stats?.inProgress || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Need attention
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" asChild>
                <Link href="/tasks/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Task
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/tasks">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  View All Tasks
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/rendering-examples">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Rendering Examples
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/faq">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  FAQ (SSG Demo)
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/terms-of-service">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Terms of Service (SSR)
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Your latest task activity</CardDescription>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : tasks && tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.slice(0, 4).map(task => {
                    const statusColor =
                      task.status === 'completed'
                        ? 'bg-green-500'
                        : task.status === 'in_progress'
                          ? 'bg-orange-500'
                          : 'bg-gray-300'

                    return (
                      <div
                        key={task.id}
                        className="flex items-center space-x-4"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${statusColor}`}
                        ></div>
                        <div className="flex-1">
                          <Link
                            href={`/tasks/${task.id}`}
                            className="text-sm font-medium hover:text-blue-600 transition-colors"
                          >
                            {task.title}
                          </Link>
                          <p className="text-xs text-gray-500">
                            {format(new Date(task.updated_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No tasks yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p>
            💡 This is a demo dashboard. In the next phase, we&apos;ll connect
            real data from the database.
          </p>
        </div>
      </div>
    </div>
  )
}
