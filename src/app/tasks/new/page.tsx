'use client'

import { useState } from 'react'
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
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'

type FormData = {
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date: string
}

export default function NewTaskPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const utils = trpc.useUtils()

  const createTaskMutation = trpc.createTask.useMutation({
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

  if (status === 'loading') {
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

    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required'
    } else {
      const selectedDate = new Date(formData.due_date)
      const now = new Date()
      if (selectedDate <= now) {
        newErrors.due_date = 'Due date must be in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        due_date: new Date(formData.due_date).toISOString(),
      }

      await createTaskMutation.mutateAsync(taskData)
      router.push('/tasks')
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const canSubmit = () => {
    if (
      !formData.title.trim() ||
      !formData.due_date ||
      createTaskMutation.isPending
    ) {
      return false
    }

    const selectedDate = new Date(formData.due_date)
    const now = new Date()

    return selectedDate > now
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button variant="ghost" size="sm" asChild className="self-start">
              <Link href="/tasks">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Tasks</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Create New Task
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>
              Fill in the information below to create a new task
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder="Enter task title..."
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder="Enter task description..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <SelectItem value="in_progress">In Progress</SelectItem>
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
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={e => handleInputChange('due_date', e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link href="/tasks">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit()}
                  className="w-full sm:w-auto sm:min-w-[120px]"
                >
                  {createTaskMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Task
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
