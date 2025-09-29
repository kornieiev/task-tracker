// 'use client'

// import { SessionProvider } from 'next-auth/react' // Провайдер аутентификации
// import { ReactNode } from 'react' // Типизация для children
// import { trpc } from '@/lib/trpc/client' // tRPC клиент

// interface ProvidersProps {
//   children: ReactNode
// }

// function ProvidersInner({ children }: ProvidersProps) {
//   return (
//     <SessionProvider>
//       {/* SessionProvider - предоставляет контекст аутентификации для всего
//         приложения. Внутри него все компоненты могут использовать useSession() */}
//       {children}
//     </SessionProvider>
//   )
//   //
// }

// export const Providers = trpc.withTRPC(ProvidersInner)

// // Этот файл создает композицию провайдеров для всего приложения, объединяя NextAuth.js и tRPC.
// // tRPC обеспечивает типизированные API вызовы
// // SessionProvider дает типизированные сессии
// // React Query (внутри tRPC) кэширует запросы
// // SessionProvider оптимизирует проверку аутентификации

// // Этот файл создает единую точку входа для всех глобальных провайдеров, обеспечивая доступ к аутентификации и типизированному API по всему приложению.
'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { trpc, getBaseUrl } from '@/lib/trpc/client'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 минут
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // Добавляем headers для авторизации если нужно
          async headers() {
            return {
              // authorization: getAuthCookie(),
            }
          },
        }),
      ],
    })
  )

  return (
    <SessionProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  )
}

// Современный подход tRPC v11:
// 1. createTRPCReact вместо createTRPCNext
// 2. Прямое использование Provider'ов вместо withTRPC HOC
// 3. Полный контроль над QueryClient настройками
