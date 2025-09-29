'use client'

import { useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Trash2,
  Calendar,
  Clock,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

type FormData = {
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date: string
}

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

interface TaskPageProps {
  params: Promise<{
    id: string
  }>
}

export default function TaskPage({ params }: TaskPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const utils = trpc.useUtils()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const resolvedParams = use(params)

  const taskId = resolvedParams.id

  const { data: task, isLoading, error } = trpc.getTask.useQuery({ id: taskId })
  const updateTaskMutation = trpc.updateTask.useMutation({
    onSuccess: () => {
      utils.getTasks.invalidate()
      utils.getTask.invalidate({ id: taskId })
      utils.getTaskStats.invalidate()
    },
  })
  const deleteTaskMutation = trpc.deleteTask.useMutation({
    onSuccess: () => {
      utils.getTasks.invalidate()
      utils.getTaskStats.invalidate()
    },
  })

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date
          ? new Date(task.due_date).toISOString().slice(0, 16)
          : '',
      })
    }
  }, [task])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-red-600">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Task not found</h3>
                <p className="text-sm mb-4">
                  The task you&apos;re looking for doesn&apos;t exist or has
                  been deleted.
                </p>
                <Button asChild>
                  <Link href="/tasks">Back to Tasks</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length > 255) {
      newErrors.title = 'Title must be less than 255 characters'
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date
          ? new Date(formData.due_date).toISOString()
          : undefined,
      }

      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: updateData,
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTaskMutation.mutateAsync({ id: taskId })
      router.push('/tasks')
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex-shrink-0"
              >
                <Link href="/tasks">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Tasks</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate ml-2">
                Task Details
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 sm:flex-none min-w-0"
                  >
                    <Edit className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 sm:flex-none min-w-0"
                  >
                    <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Delete</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    disabled={updateTaskMutation.isPending}
                    className="flex-1 sm:flex-none min-w-0"
                  >
                    <X className="h-4 w-4 mr-1 sm:mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updateTaskMutation.isPending}
                    className="flex-1 sm:flex-none min-w-0"
                  >
                    {updateTaskMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1 sm:mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-1 sm:mr-2" />
                    )}
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-8">
          {/* Main Task Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={e =>
                          handleInputChange('title', e.target.value)
                        }
                        className={errors.title ? 'border-red-500' : ''}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">{errors.title}</p>
                      )}
                    </div>
                  ) : (
                    <CardTitle className="text-2xl mb-2">
                      {task.title}
                    </CardTitle>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Badge
                    variant="outline"
                    className={
                      priorityColors[
                        (isEditing
                          ? formData.priority
                          : task.priority) as keyof typeof priorityColors
                      ]
                    }
                  >
                    {isEditing ? formData.priority : task.priority}
                  </Badge>
                  <Badge
                    className={
                      statusColors[
                        (isEditing
                          ? formData.status
                          : task.status) as keyof typeof statusColors
                      ]
                    }
                  >
                    {(isEditing ? formData.status : task.status).replace(
                      '_',
                      ' '
                    )}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={e =>
                        handleInputChange('description', e.target.value)
                      }
                      rows={4}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Status */}
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: string) =>
                          handleInputChange('status', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: string) =>
                          handleInputChange('priority', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                      <Label htmlFor="due_date">Due Date</Label>
                      <Input
                        id="due_date"
                        type="datetime-local"
                        value={formData.due_date}
                        onChange={e =>
                          handleInputChange('due_date', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {task.description && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {task.description}
                      </p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {formatDate(task.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {formatDate(task.updated_at)}</span>
                    </div>
                    {task.due_date && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {formatDate(task.due_date)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Task</CardTitle>
              <CardDescription>
                Are you sure you want to delete this task? This action cannot be
                undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:justify-end gap-4 sm:space-x-4 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteTaskMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteTaskMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {deleteTaskMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
