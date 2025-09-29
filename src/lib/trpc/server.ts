import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/config'

// Создаем контекст для tRPC
export const createTRPCContext = async () => {
  const session = await getServerSession(authOptions)

  return {
    session,
    supabase,
    userId: session?.user?.email, // В demo режиме используем email как ID
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create()

// Middleware для проверки аутентификации
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session || !ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      session: ctx.session,
      userId: ctx.userId,
      supabase: ctx.supabase,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)

// Схемы валидации для задач
export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'completed']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  due_date: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user_id: z.string(),
})

export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
})

export const UpdateTaskSchema = CreateTaskSchema.partial()

// Временное in-memory хранилище для демо
type Task = {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  created_at: string
  updated_at: string
  user_id: string
}

const mockTasks = new Map<string, Task>([
  [
    'task-1',
    {
      id: 'task-1',
      title: 'Setup Development Environment',
      description: 'Install Node.js, Next.js and configure the project',
      status: 'completed',
      priority: 'high',
      due_date: '2024-12-30T12:00:00Z',
      created_at: '2024-12-20T10:00:00Z',
      updated_at: '2024-12-22T14:00:00Z',
      user_id: 'demo-user',
    },
  ],
  [
    'task-2',
    {
      id: 'task-2',
      title: 'Design Database Schema',
      description: 'Create tables for users, tasks, and authentication',
      status: 'completed',
      priority: 'high',
      due_date: '2024-12-31T12:00:00Z',
      created_at: '2024-12-22T10:00:00Z',
      updated_at: '2024-12-23T16:00:00Z',
      user_id: 'demo-user',
    },
  ],
  [
    'task-3',
    {
      id: 'task-3',
      title: 'Implement Authentication',
      description: 'Setup NextAuth.js with credentials provider',
      status: 'in_progress',
      priority: 'high',
      due_date: '2025-01-02T12:00:00Z',
      created_at: '2024-12-23T10:00:00Z',
      updated_at: '2024-12-25T12:00:00Z',
      user_id: 'demo-user',
    },
  ],
  [
    'task-4',
    {
      id: 'task-4',
      title: 'Create Task Management UI',
      description: 'Build forms and components for CRUD operations',
      status: 'todo',
      priority: 'medium',
      due_date: '2025-01-05T12:00:00Z',
      created_at: '2024-12-25T10:00:00Z',
      updated_at: '2024-12-25T10:00:00Z',
      user_id: 'demo-user',
    },
  ],
])

// Основной router
export const appRouter = router({
  // Получить все задачи пользователя
  getTasks: protectedProcedure.query(async ({ ctx }) => {
    const userTasks = Array.from(mockTasks.values()).filter(
      task => task.user_id === ctx.userId || task.user_id === 'demo-user'
    )
    return userTasks
  }),

  // Получить задачу по ID
  getTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const task = mockTasks.get(input.id)
      if (
        !task ||
        (task.user_id !== ctx.userId && task.user_id !== 'demo-user')
      ) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' })
      }
      return task
    }),

  // Создать новую задачу
  createTask: protectedProcedure
    .input(CreateTaskSchema)
    .mutation(async ({ input, ctx }) => {
      const now = new Date().toISOString()
      const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const newTask: Task = {
        id: taskId,
        title: input.title,
        description: input.description,
        status: input.status || 'todo',
        priority: input.priority || 'medium',
        due_date: input.due_date,
        created_at: now,
        updated_at: now,
        user_id: ctx.userId,
      }

      mockTasks.set(taskId, newTask)
      console.log('Created task:', newTask)

      return newTask
    }),

  // Обновить задачу
  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: UpdateTaskSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingTask = mockTasks.get(input.id)
      if (
        !existingTask ||
        (existingTask.user_id !== ctx.userId &&
          existingTask.user_id !== 'demo-user')
      ) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' })
      }

      const now = new Date().toISOString()
      const updatedTask: Task = {
        ...existingTask,
        ...input.data,
        title: input.data.title || existingTask.title,
        updated_at: now,
      }

      mockTasks.set(input.id, updatedTask)
      console.log('Updated task:', updatedTask)

      return updatedTask
    }),

  // Удалить задачу
  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const task = mockTasks.get(input.id)
      if (
        !task ||
        (task.user_id !== ctx.userId && task.user_id !== 'demo-user')
      ) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' })
      }

      mockTasks.delete(input.id)
      console.log('Deleted task:', input.id)

      return { success: true, id: input.id }
    }),

  // Получить статистику задач
  getTaskStats: protectedProcedure.query(async ({ ctx }) => {
    const userTasks = Array.from(mockTasks.values()).filter(
      task => task.user_id === ctx.userId || task.user_id === 'demo-user'
    )

    const total = userTasks.length
    const completed = userTasks.filter(
      task => task.status === 'completed'
    ).length
    const inProgress = userTasks.filter(
      task => task.status === 'in_progress'
    ).length
    const todo = userTasks.filter(task => task.status === 'todo').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      inProgress,
      todo,
      completionRate,
    }
  }),
})

export type AppRouter = typeof appRouter
