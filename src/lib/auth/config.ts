import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from '@/lib/supabase'

// ✅ Добавляем тип для пользователя из базы
type DatabaseUser = {
  id: string
  email: string
  name: string | null
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'lola@mail.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'qweqwe',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        try {
          // ✅ Аутентификация через Supabase Auth
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email.toLowerCase(),
            password: credentials.password,
          })

          if (error || !data.user) {
            throw new Error('Invalid email or password')
          }

          // ✅ Получаем данные пользователя из таблицы users с явной типизацией
          const { data: userData, error: userError } = (await supabase
            .from('users')
            .select('id, email, name')
            .eq('id', data.user.id)
            .single()) as { data: DatabaseUser | null; error: unknown } // ✅ Заменил any на unknown

          // ✅ Определяем имя пользователя
          let userName = 'User'

          if (userData && !userError) {
            userName = userData.name || 'User'
          } else if (data.user.user_metadata?.name) {
            userName = data.user.user_metadata.name
          }

          // ✅ Возвращаем пользователя
          return {
            id: data.user.id,
            email: data.user.email!,
            name: userName,
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Authentication failed'
          console.log('Auth error:', errorMessage)
          throw new Error('Invalid email or password')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
