'use client'

import { useSession } from 'next-auth/react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckSquare,
  Plus,
  Calendar,
  User,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
}

const priorityColors = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-red-50 text-red-700 border-red-200',
}

export default function TasksPage() {
  const { data: session, status } = useSession()
  // tRPC запрос для получения списка задач
  const {
    data: tasks,
    isLoading,
    error,
  } = trpc.getTasks.useQuery(undefined, {
    enabled: !!session, // Запрос только если есть сессия
    refetchOnWindowFocus: false, // Не перезапрашивать при фокусе окна
    staleTime: 30000, // Кеш на 30 секунд
  })
  // tRPC запрос для получения статистики задач
  const { data: stats } = trpc.getTaskStats.useQuery(undefined, {
    enabled: !!session,
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Please sign in to access your tasks.
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
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile-first responsive header */}
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            {/* Top row - Navigation and title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Back to Dashboard</span>
                  </Link>
                </Button>
                <CheckSquare className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  My Tasks
                </h1>
              </div>
              {/* Mobile new task button */}
              <Button asChild size="sm" className="md:hidden">
                <Link href="/tasks/new">
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Bottom row - User info and desktop new task button */}
            <div className="flex items-center justify-between md:justify-end md:space-x-4">
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <User className="h-4 w-4" />
                <span className="truncate max-w-[150px] md:max-w-none">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              {/* Desktop new task button */}
              <Button asChild className="hidden md:flex">
                <Link href="/tasks/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.inProgress}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Todo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {stats.todo}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tasks List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading tasks...</span>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-red-600">
                Error loading tasks. Please try again.
              </div>
            </CardContent>
          </Card>
        ) : !tasks || tasks.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                <p className="text-sm mb-4">
                  Get started by creating your first task
                </p>
                <Button asChild>
                  <Link href="/tasks/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Task
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        <Link
                          href={`/tasks/${task.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {task.title}
                        </Link>
                      </CardTitle>
                      {task.description && (
                        <CardDescription className="text-sm">
                          {task.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge
                        variant="outline"
                        className={priorityColors[task.priority]}
                      >
                        {task.priority}
                      </Badge>
                      <Badge className={statusColors[task.status]}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created:{' '}
                        {format(new Date(task.created_at), 'MMM dd, yyyy')}
                      </div>
                      {task.due_date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/tasks/${task.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
