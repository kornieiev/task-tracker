import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, HelpCircle, Rocket, Settings, Wrench } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | Task Tracker',
  description:
    'Find answers to common questions about Task Tracker. Learn how to create, manage, and organize your tasks effectively.',
  keywords: [
    'FAQ',
    'help',
    'task management',
    'questions',
    'support',
    'Next.js',
  ],
  openGraph: {
    title: 'FAQ - Task Tracker Help Center',
    description:
      'Get help with Task Tracker - answers to common questions about creating and managing tasks.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const faqData = [
  {
    category: 'Getting Started',
    icon: Rocket,
    color: 'text-green-600',
    questions: [
      {
        q: 'What is Task Tracker?',
        a: 'A simple task management app built with Next.js to help organize your work.',
      },
      {
        q: 'How do I create tasks?',
        a: 'Click "New Task" from the dashboard or tasks page, fill in the details and save.',
      },
      {
        q: 'How does login work?',
        a: 'Use the demo accounts: lola@mail.com or leo@mail.com with qweqwe.',
      },
    ],
  },
  {
    category: 'Managing Tasks',
    icon: Settings,
    color: 'text-blue-600',
    questions: [
      {
        q: 'Can I edit tasks?',
        a: 'Yes, click on any task to view details and use the edit button.',
      },
      {
        q: 'What are the task statuses?',
        a: 'Tasks can be: To Do (not started), In Progress (working on), or Completed.',
      },
      {
        q: 'How do I delete tasks?',
        a: 'Open task details and click the delete button. This cannot be undone.',
      },
    ],
  },
  {
    category: 'Troubleshooting',
    icon: Wrench,
    color: 'text-orange-600',
    questions: [
      {
        q: 'App loading slowly?',
        a: 'Try refreshing the page, clearing browser cache, or using a different browser.',
      },
      {
        q: 'Login not working?',
        a: 'Double-check credentials, try demo accounts, or clear cookies and retry.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white mb-4"
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <HelpCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">FAQ</h1>
            <p className="text-indigo-100">
              Common questions about Task Tracker
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {faqData.map((section, sIndex) => {
            const Icon = section.icon
            return (
              <div key={sIndex}>
                <div className="flex items-center mb-6">
                  <Icon className={`h-8 w-8 mr-3 ${section.color}`} />
                  <h2 className={`text-2xl font-bold ${section.color}`}>
                    {section.category}
                  </h2>
                </div>

                <div className="space-y-4">
                  {section.questions.map((faq, qIndex) => (
                    <Card
                      key={qIndex}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{faq.q}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{faq.a}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex gap-4 mt-8 justify-center">
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/terms-of-service">Terms of service</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
