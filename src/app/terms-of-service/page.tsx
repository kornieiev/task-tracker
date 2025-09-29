import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, FileText, Clock, Shield, Users } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { getLatestToSDocument, getAllToSDocuments } from '@/lib/tos-db'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const latestDocument = await getLatestToSDocument()

  return {
    title: `Terms of Service v${latestDocument?.version || '1.0'} | Task Tracker`,
    description: `Current terms and conditions for Task Tracker. Version ${latestDocument?.version || '1.0'}, effective from ${latestDocument ? format(new Date(latestDocument.effective_date), 'MMMM yyyy') : 'now'}.`,
    keywords: [
      'terms of service',
      'legal',
      'task tracker',
      'conditions',
      `version ${latestDocument?.version || '1.0'}`,
    ],
    authors: [{ name: 'Task Tracker Team' }],
    openGraph: {
      title: `Terms of Service v${latestDocument?.version || '1.0'} - Task Tracker`,
      description: `Current terms and conditions for Task Tracker application. Version ${latestDocument?.version || '1.0'}.`,
      type: 'article',
      locale: 'en_US',
      publishedTime: latestDocument?.effective_date,
      modifiedTime: latestDocument?.created_at,
    },
    twitter: {
      card: 'summary',
      title: `Terms of Service v${latestDocument?.version || '1.0'} - Task Tracker`,
      description: `Current terms and conditions for Task Tracker application`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function TermsOfServicePage() {
  const latestDocument = await getLatestToSDocument()
  const allDocuments = await getAllToSDocuments()

  if (!latestDocument) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Terms Available</h3>
            <p className="text-gray-600 mb-4">
              Terms of Service document not found.
            </p>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-white hover:bg-slate-600"
              >
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="text-slate-100 mb-6">
              Current terms and conditions for using Task Tracker
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Version {latestDocument.version}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Effective:{' '}
                    {format(
                      new Date(latestDocument.effective_date),
                      'MMMM dd, yyyy'
                    )}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <Users className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
                {latestDocument.content}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Version History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allDocuments.map(doc => (
                <div
                  key={doc.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <span className="font-medium">Version {doc.version}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {format(new Date(doc.effective_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  {doc.is_active && (
                    <Badge className="bg-green-100 text-green-700">
                      Current
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-8 justify-center">
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/faq">View FAQ</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
