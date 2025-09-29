'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, Monitor, Loader2, RefreshCw } from 'lucide-react'
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

type Task = {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  fetch_timestamp: string
  client_id: string
}

type Stats = {
  total: number
  completed: number
  inProgress: number
  todo: number
  fetchTime: string
}

// Симулируем API запрос на клиенте
async function fetchClientData(): Promise<{ tasks: Task[], stats: Stats }> {
  // Симулируем загрузку
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const fetchTime = new Date().toISOString()
  const randomTaskCount = Math.floor(Math.random() * 4) + 2 // 2-5 задач
  
  // Генерируем динамические данные на клиенте
  const tasks: Task[] = Array.from({ length: randomTaskCount }, (_, i) => ({
    id: `csr-task-${i + 1}`,
    title: [
      'Load Dynamic Content',
      'Fetch Client Data',
      'Render Interactive UI',
      'Handle User Interactions',
      'Update Real-time State'
    ][i] || `Client Task ${i + 1}`,
    description: [
      'This task is fetched and rendered on the client-side',
      'Interactive content that loads after page mount',
      'Perfect for dashboards and user-specific data',
      'Enables rich interactions and real-time updates',
      'Can update without full page reload'
    ][i] || 'Client-fetched task description',
    status: (['todo', 'in_progress', 'completed'] as const)[i % 3],
    priority: (['low', 'medium', 'high'] as const)[i % 3],
    created_at: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(), // Last 5 days
    fetch_timestamp: fetchTime,
    client_id: Math.random().toString(36).substring(7),
  }))

  const stats: Stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    todo: tasks.filter(task => task.status === 'todo').length,
    fetchTime,
  }

  return { tasks, stats }
}

export default function CSRTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [lastFetch, setLastFetch] = useState<string>('')

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchClientData()
      setTasks(data.tasks)
      setStats(data.stats)
      setLastFetch(data.stats.fetchTime)
    } catch (err) {
      setError('Failed to load client data')
      console.error('Client fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsMounted(true)
    loadData()
  }, [])

  const handleRefresh = () => {
    loadData()
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-orange-600">
                <Link href="/rendering-examples">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Examples
                </Link>
              </Button>
              <Monitor className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">CSR Tasks</h1>
                <p className="text-orange-100">Client-Side Rendering Demo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
                className="text-white hover:bg-orange-600"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <div className="bg-orange-800 px-4 py-2 rounded-lg">
                <div className="text-sm font-medium">Render Strategy</div>
                <div className="text-xs text-orange-200">Client-Side Rendering</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="py-6">
            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Monitor className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800 mb-2">
                  💻 Client-Side Rendering (CSR)
                </h3>
                <p className="text-orange-700 text-sm mb-4">
                  This page loads first with minimal HTML, then fetches data and renders content 
                  in the browser. Great for interactive dashboards and applications that need 
                  real-time updates.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-xs text-orange-600">
                  <div>
                    <strong>✅ Advantages:</strong>
                    <ul className="list-disc list-inside mt-1">
                      <li>Highly interactive</li>
                      <li>Smooth user experience</li>
                      <li>Real-time updates</li>
                      <li>Reduced server load</li>
                    </ul>
                  </div>
                  <div>
                    <strong>⚠️ Considerations:</strong>
                    <ul className="list-disc list-inside mt-1">
                      <li>Slower initial load</li>
                      <li>SEO challenges</li>
                      <li>Loading states needed</li>
                      <li>Requires JavaScript</li>
                    </ul>
                  </div>
                </div>
                {lastFetch && (
                  <div className="mt-4 text-xs text-orange-600">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Last fetched on client: {format(new Date(lastFetch), 'PPpp')}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="mb-8 border-orange-200">
            <CardContent className="py-8">
              <div className="flex items-center justify-center space-x-4">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <div>
                  <div className="text-orange-800 font-medium">Loading client data...</div>
                  <div className="text-orange-600 text-sm">Fetching from client-side API</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="py-6">
              <div className="text-red-800 font-medium mb-2">❌ Error Loading Data</div>
              <div className="text-red-600 text-sm mb-4">{error}</div>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Client Request Info */}
        {stats && !isLoading && (
          <Card className="mb-8 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Client Request Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-orange-600 font-medium">Client Fetch Time:</span>
                  <div className="text-gray-700">{format(new Date(stats.fetchTime), 'PPpp')}</div>
                </div>
                <div>
                  <span className="text-orange-600 font-medium">Tasks Loaded:</span>
                  <div className="text-gray-700">{stats.total} tasks</div>
                </div>
                <div>
                  <span className="text-orange-600 font-medium">Click refresh to see:</span>
                  <div className="text-gray-700">New client-fetched content</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {stats && !isLoading && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
                <p className="text-xs text-orange-600">Client-fetched</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.completed}</div>
                <p className="text-xs text-orange-600">
                  {Math.round((stats.completed / stats.total) * 100)}% done
                </p>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
                <p className="text-xs text-orange-600">Active work</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Todo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.todo}</div>
                <p className="text-xs text-orange-600">Pending</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tasks List */}
        {tasks && !isLoading && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Client-Rendered Tasks (Fetched in Browser)
            </h2>
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow border-orange-100">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 text-orange-800">
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
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                          ID: {task.client_id}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-orange-600 font-medium">
                      Client-Rendered
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {!isLoading && (
          <Card className="mt-8 bg-orange-50 border-orange-200">
            <CardContent className="py-4">
              <div className="text-center text-orange-700">
                <p className="text-sm font-medium mb-2">
                  💻 This page uses Client-Side Rendering (CSR) to fetch and display data
                </p>
                <p className="text-xs">
                  Content loads in the browser after the initial page load. Perfect for interactive 
                  applications, user dashboards, and real-time data that updates frequently.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
