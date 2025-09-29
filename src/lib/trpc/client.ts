import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from './server'

export const trpc = createTRPCReact<AppRouter>()

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

// Экспортируем базовый URL для использования в Providers
export { getBaseUrl }
