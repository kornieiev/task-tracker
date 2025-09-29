'use client'

import { SessionProvider } from 'next-auth/react' // Провайдер аутентификации
import { ReactNode } from 'react' // Типизация для children
import { trpc } from '@/lib/trpc/client' // tRPC клиент

interface ProvidersProps {
  children: ReactNode
}

function ProvidersInner({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {/* SessionProvider - предоставляет контекст аутентификации для всего
        приложения. Внутри него все компоненты могут использовать useSession() */}
      {children}
    </SessionProvider>
  )
  //
}

export const Providers = trpc.withTRPC(ProvidersInner)

// Этот файл создает композицию провайдеров для всего приложения, объединяя NextAuth.js и tRPC.
// tRPC обеспечивает типизированные API вызовы
// SessionProvider дает типизированные сессии
// React Query (внутри tRPC) кэширует запросы
// SessionProvider оптимизирует проверку аутентификации

// Этот файл создает единую точку входа для всех глобальных провайдеров, обеспечивая доступ к аутентификации и типизированному API по всему приложению.
