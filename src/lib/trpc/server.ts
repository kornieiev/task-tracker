import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import { supabaseServer } from '@/lib/supabase/server' // ✅ Service role client
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/config'

export const createTRPCContext = async () => {
  const session = await getServerSession(authOptions)

  return {
    session,
    supabase: supabaseServer, // ✅ Используем service role
    userId: session?.user?.id,
    userEmail: session?.user?.email,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create()

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session || !ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      session: ctx.session,
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      supabase: ctx.supabase, // Service role client
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)

// Схемы остаются те же
export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'completed']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  due_date: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user_id: z.string().uuid(),
})

export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
})

export const UpdateTaskSchema = CreateTaskSchema.partial()

export const appRouter = router({
  getTasks: protectedProcedure.query(async ({ ctx }) => {
    console.log('📋 Getting tasks for user UUID:', ctx.userId)

    const { data, error } = await ctx.supabase
      .from('tasks')
      .select('*')
      .eq('user_id', ctx.userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.log('❌ Error getting tasks:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Database error: ${error.message}`,
      })
    }

    console.log(`✅ Found ${data?.length || 0} tasks`)
    return data || []
  }),

  getTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('tasks')
        .select('*')
        .eq('id', input.id)
        .eq('user_id', ctx.userId)
        .single()

      if (error || !data) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' })
      }

      return data
    }),

  // ✅ Создание задачи с service role (обходит RLS)
  createTask: protectedProcedure
    .input(CreateTaskSchema)
    .mutation(async ({ input, ctx }) => {
      console.log('➕ Creating task for user UUID:', ctx.userId)

      const { data, error } = await ctx.supabase
        .from('tasks')
        .insert({
          ...input,
          user_id: ctx.userId, // ✅ Явно указываем user_id
        })
        .select()
        .single()

      if (error) {
        console.log('❌ Error creating task:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create task: ${error.message}`,
        })
      }

      console.log('✅ Created task:', data)
      return data
    }),

  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: UpdateTaskSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('tasks')
        .update({
          ...input.data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .eq('user_id', ctx.userId) // ✅ Защита на уровне приложения
        .select()
        .single()

      if (error || !data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found or update failed',
        })
      }

      console.log('✅ Updated task:', data)
      return data
    }),

  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from('tasks')
        .delete()
        .eq('id', input.id)
        .eq('user_id', ctx.userId) // ✅ Защита на уровне приложения

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found or delete failed',
        })
      }

      console.log('✅ Deleted task:', input.id)
      return { success: true, id: input.id }
    }),

  getTaskStats: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from('tasks')
      .select('status')
      .eq('user_id', ctx.userId)

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to get stats: ${error.message}`,
      })
    }

    const tasks = data || []
    const total = tasks.length
    const completed = tasks.filter(task => task.status === 'completed').length
    const inProgress = tasks.filter(
      task => task.status === 'in_progress'
    ).length
    const todo = tasks.filter(task => task.status === 'todo').length
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
