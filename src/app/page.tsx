'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckSquare, Plus, Users, Shield, LucideIcon } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()

  const cardsInfo: Array<{
    title: string
    text: string
    icon: LucideIcon
    iconColor: string
  }> = [
    {
      title: 'Simple Task Management',
      text: 'Create, edit, and track your tasks with an intuitive interface. Mark tasks as complete and see your progress at a glance.',
      icon: CheckSquare,
      iconColor: 'text-blue-600',
    },
    {
      title: 'Secure & Private',
      text: 'Your tasks are private and secure. Each user can only access their own data with built-in authentication and authorization.',
      icon: Shield,
      iconColor: 'text-green-600',
    },
    {
      title: 'User-Friendly',
      text: 'Clean, modern interface built with the latest web technologies. Works perfectly on desktop and mobile devices.',
      icon: Users,
      iconColor: 'text-purple-600',
    },
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {session.user?.name}! 👋
            </h1>
            <p className="text-gray-600">Ready to resolve your tasks?</p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button asChild size="lg">
              <Link href="/dashboard">
                <CheckSquare className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tasks/new">
                <Plus className="mr-2 h-5 w-5" />
                Create Task
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Task Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-0 max-w-2xl mx-auto">
            A simple way to organize and track your tasks.
          </p>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay productive and don&apos;t miss a deadline again.
          </p>

          <div className="flex justify-center space-x-4">
            <Button asChild size="lg">
              <Link href="/auth/signin">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/faq">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {cardsInfo.map((card, index) => (
            <Card key={index}>
              <CardHeader>
                <card.icon className={`h-12 w-12 ${card.iconColor} mb-4`} />
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{card.text}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to get organized?
          </h2>
          <p className="text-gray-600 mb-6">
            Try demo accounts and learn more about the application.
          </p>

          <div className="flex justify-center space-x-4">
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/terms">Terms of Service</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
