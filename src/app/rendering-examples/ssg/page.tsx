import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckSquare, Calendar, Clock, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

// Статические данные для демонстрации SSG
const staticTasks = [
  {
    id: 'ssg-task-1',
    title: 'Learn Next.js SSG',
    description: 'Understanding Static Site Generation and its benefits for performance and SEO',
    status: 'completed' as const,
    priority: 'high' as const,
    created_at: '2024-12-20T10:00:00Z',
    updated_at: '2024-12-22T14:00:00Z',
    category: 'learning',
  },
  {
    id: 'ssg-task-2', 
    title: 'Build Static Documentation',
    description: 'Create comprehensive documentation that can be statically generated',
    status: 'in_progress' as const,
    priority: 'medium' as const,
    created_at: '2024-12-22T10:00:00Z',
    updated_at: '2024-12-25T12:00:00Z',
    category: 'development',
  },
  {
    id: 'ssg-task-3',
    title: 'Optimize Build Performance',
    description: 'Implement static generation for better loading times and SEO',
    status: 'todo' as const,
    priority: 'high' as const,
    created_at: '2024-12-25T10:00:00Z',
    updated_at: '2024-12-25T10:00:00Z',
    category: 'optimization',
  },
]

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

// Генерируем статистику во время билда
const stats = {
  total: staticTasks.length,
  completed: staticTasks.filter(task => task.status === 'completed').length,
  inProgress: staticTasks.filter(task => task.status === 'in_progress').length,
  todo: staticTasks.filter(task => task.status === 'todo').length,
}

export default function SSGTasksPage() {
  // Время генерации страницы (во время билда)
  const buildTime = new Date().toISOString()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-green-600">
                <Link href="/rendering-examples">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Examples
                </Link>
              </Button>
              <CheckSquare className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">SSG Tasks</h1>
                <p className="text-green-100">Static Site Generation Demo</p>
              </div>
            </div>
            <div className="bg-green-800 px-4 py-2 rounded-lg">
              <div className="text-sm font-medium">Build Strategy</div>
              <div className="text-xs text-green-200">Static Site Generation</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="py-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 mb-2">
                  🚀 Static Site Generation (SSG)
                </h3>
                <p className="text-green-700 text-sm mb-4">
                  This page is generated at build time with static data. It loads instantly, 
                  is great for SEO, and can be cached globally on CDN. Perfect for content 
                  that doesn&apos;t change frequently.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-xs text-green-600">
                  <div>
                    <strong>✅ Advantages:</strong>
                    <ul className="list-disc list-inside mt-1">
                      <li>Fastest loading times</li>
                      <li>Excellent SEO</li>
                      <li>CDN cacheable</li>
                      <li>Low server load</li>
                    </ul>
                  </div>
                  <div>
                    <strong>⚠️ Considerations:</strong>
                    <ul className="list-disc list-inside mt-1">
                      <li>Data is static at build time</li>
                      <li>Requires rebuild for updates</li>
                      <li>Not suitable for dynamic content</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 text-xs text-green-600">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Generated at build time: {format(new Date(buildTime), 'PPpp')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.total}</div>
              <p className="text-xs text-green-600">Static count</p>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-green-600">
                {Math.round((stats.completed / stats.total) * 100)}% done
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.inProgress}</div>
              <p className="text-xs text-green-600">Active work</p>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Todo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.todo}</div>
              <p className="text-xs text-green-600">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Static Tasks (Generated at Build Time)
          </h2>
          {staticTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow border-green-100">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 text-green-800">
                      {task.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {task.description}
                    </CardDescription>
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
                      Created: {format(new Date(task.created_at), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {task.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Static Content
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardContent className="py-4">
            <div className="text-center text-green-700">
              <p className="text-sm font-medium mb-2">
                ⚡ This page was pre-rendered at build time using Static Site Generation (SSG)
              </p>
              <p className="text-xs">
                Data is static and won&apos;t change until the next build. Perfect for content like 
                documentation, blogs, or landing pages.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
