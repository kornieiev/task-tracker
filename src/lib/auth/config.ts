import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from '@/lib/supabase'

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

          // ✅ Получаем данные пользователя из таблицы users
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, name')
            .eq('id', data.user.id)
            .single()

          if (userError || !userData) {
            console.log('User not found in users table, using auth data')
          }

          // ✅ Возвращаем пользователя без image
          return {
            id: data.user.id,
            email: data.user.email!,
            name: userData?.name || data.user.user_metadata?.name || 'User',
          }
        } catch (error: any) {
          console.log('Auth error:', error.message)
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
