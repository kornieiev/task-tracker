import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
          placeholder: 'Enter your email'
        },
        password: { 
          label: 'Password', 
          type: 'password',
          placeholder: 'Enter your password'
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Mock authentication for development
        // In production, you would validate against your database
        const mockUsers = [
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            email: 'Lola@mail.com',
            name: 'Lola',
            password: 'password123'
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440002', 
            email: 'Leo@mail.com',
            name: 'Leo',
            password: 'password123'
          }
        ]

        const user = mockUsers.find(
          u => u.email.toLowerCase() === credentials.email.toLowerCase() &&
               u.password === credentials.password
        )

        if (user) {
          // В демо-режиме пропускаем создание пользователя в Supabase
          // В продакшене здесь будет проверка и создание пользователя
          console.log('Demo mode: User authenticated:', user.email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
