// "use client"
// ! Temporary use client component, until not added redirecting after real signup

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Registration is currently disabled in demo mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            This is a demo application. Please use one of the provided demo
            accounts to test the functionality.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Demo Accounts:</h3>
            <div className="space-y-1 text-sm text-blue-800">
              <div>lola@mail.com / qweqwe</div>
              <div>leo@mail.com / qweqwe</div>
            </div>
          </div>

          <Button asChild className="w-full">
            <Link href="/auth/signin">Go to Sign In</Link>
          </Button>

          <p className="text-xs text-gray-500">
            In a production environment, you would implement proper user
            registration here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
