import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, Server } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

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

// Симулируем получение данных с сервера
async function getServerSideData() {
  // Симулируем задержку сервера
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const serverTime = new Date().toISOString()
  const randomTaskCount = Math.floor(Math.random() * 3) + 3 // 3-5 задач
  
  // Генерируем динамические данные на сервере
  const serverTasks = Array.from({ length: randomTaskCount }, (_, i) => ({
    id: `ssr-task-${i + 1}`,
    title: [
      'Process Server Request',
      'Handle Database Query',
      'Generate Dynamic Content',
      'Render Server Response',
      'Optimize Server Performance'
    ][i] || `Dynamic Task ${i + 1}`,
    description: [
      'This task is generated server-side on each request',
      'Server-side rendering ensures fresh data on every page load',
      'Dynamic content is rendered on the server before sending to client',
      'SEO-friendly with server-rendered HTML',
      'Perfect for personalized or frequently changing content'
    ][i] || 'Server-generated task description',
    status: (['todo', 'in_progress', 'completed'] as const)[i % 3],
    priority: (['low', 'medium', 'high'] as const)[i % 3],
    created_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // Last 7 days
    server_timestamp: serverTime,
    request_id: Math.random().toString(36).substring(7),
  }))

  const stats = {
    total: serverTasks.length,
    completed: serverTasks.filter(task => task.status === 'completed').length,
    inProgress: serverTasks.filter(task => task.status === 'in_progress').length,
    todo: serverTasks.filter(task => task.status === 'todo').length,
    serverTime,
  }

  return { serverTasks, stats }
}

export default async function SSRTasksPage() {
  // Получаем данные на сервере при каждом запросе
  const { serverTasks, stats } = await getServerSideData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-blue-600">
                <Link href="/rendering-examples">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Examples
                </Link>
              </Button>
              <Server className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">SSR Tasks</h1>
                <p className="text-blue-100">Server-Side Rendering Demo</p>
              </div>
            </div>
            <div className="bg-blue-800 px-4 py-2 rounded-lg">
              <div className="text-sm font-medium">Render Strategy</div>
              <div className="text-xs text-blue-200">Server-Side Rendering</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="py-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-2">
                  🔄 Server-Side Rendering (SSR)
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  This page is rendered on the server on each request. The HTML is generated 
                  with fresh data and sent to the client. Great for personalized content 
                  and SEO with dynamic data.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-xs text-blue-600">
                  <div>
                    <strong>✅ Advantages:</strong>
                    <ul className="list-disc list-inside mt-1">
                      <li>Always fresh data</li>
                      <li>Great SEO with dynamic content</li>
                      <li>No client-side loading states</li>
                      <li>Works without JavaScript</li>
                    </ul>
                  </div>
                  <div>
                    <strong>⚠️ Considerations:</strong>
                    <ul className="list-disc list-inside mt-1">
                      <li>Slower than static pages</li>
                      <li>Higher server load</li>
                      <li>Cannot cache at CDN level</li>
                      <li>Requires server for each request</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 text-xs text-blue-600">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Rendered on server at: {format(new Date(stats.serverTime), 'PPpp')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Server Info */}
        <Card className="mb-8 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <Server className="h-5 w-5 mr-2" />
              Server Request Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Server Time:</span>
                <div className="text-gray-700">{format(new Date(stats.serverTime), 'PPpp')}</div>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Tasks Generated:</span>
                <div className="text-gray-700">{stats.total} tasks</div>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Refresh to see:</span>
                <div className="text-gray-700">New server-generated content</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards - Generated on Server */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-xs text-blue-600">Server-generated</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
              <p className="text-xs text-blue-600">
                {Math.round((stats.completed / stats.total) * 100)}% done
              </p>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-xs text-blue-600">Active work</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Todo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.todo}</div>
              <p className="text-xs text-blue-600">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Server-Rendered Tasks (Fresh on Each Request)
          </h2>
          {serverTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow border-blue-100">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 text-blue-800">
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
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        ID: {task.request_id}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    Server-Rendered
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="text-center text-blue-700">
              <p className="text-sm font-medium mb-2">
                🔄 This page is rendered on the server for each request using Server-Side Rendering (SSR)
              </p>
              <p className="text-xs">
                Refresh the page to see new server-generated content. Perfect for personalized 
                dashboards, user-specific data, or frequently changing content.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
