'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSignOut()
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/',
      redirect: true,
    })
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <LogOut className="h-12 w-12 text-gray-400" />
          </div>
          <CardTitle className="text-2xl">Sign Out</CardTitle>
          <CardDescription>
            You are being signed out of Task Tracker
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Signing out...</span>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSignOut}>
              Sign Out Now
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Thank you for using Task Tracker!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
