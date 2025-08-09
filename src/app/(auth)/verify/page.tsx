"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertCircle, Building2 } from 'lucide-react'

function VerifyPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message)
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed')
        }
      } catch {
        setStatus('error')
        setMessage('An error occurred during verification')
      }
    }

    verifyEmail()
  }, [token])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <AlertCircle className="w-16 h-16 text-blue-500 animate-pulse" />
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />
      default:
        return <AlertCircle className="w-16 h-16 text-blue-500" />
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verifying your email...'
      case 'success':
        return 'Email verified successfully!'
      case 'error':
        return 'Verification failed'
      default:
        return 'Email verification'
    }
  }

  const getStatusDescription = () => {
    switch (status) {
      case 'loading':
        return 'Please wait while we verify your email address.'
      case 'success':
        return 'Your email has been verified successfully. You can now sign in to your account.'
      case 'error':
        return message || 'There was an error verifying your email address.'
      default:
        return 'Email verification in progress.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Premier Deals</h1>
          <p className="text-gray-600">Email Verification</p>
        </div>

        {/* Verification Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-2xl">{getStatusTitle()}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">{getStatusDescription()}</p>

            {status === 'success' && (
              <div className="space-y-4">
                <Button 
                  onClick={() => router.push('/login')}
                  className="w-full"
                  size="lg"
                >
                  Sign In to Your Account
                </Button>
                <p className="text-sm text-gray-500">
                  You can now access all features of Premier Deals
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">{message}</p>
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => router.push('/login')}
                    variant="outline"
                    className="w-full"
                  >
                    Go to Sign In
                  </Button>
                  <Button 
                    onClick={() => router.push('/register')}
                    variant="outline"
                    className="w-full"
                  >
                    Create New Account
                  </Button>
                </div>
              </div>
            )}

            {status === 'loading' && (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
                <p className="text-sm text-gray-500">
                  This may take a few moments...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            &copy; 2024 Premier Deals. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

// Loading component
function VerifyPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Premier Deals</h1>
          <p className="text-gray-600">Email Verification</p>
        </div>
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-blue-500 animate-pulse" />
            </div>
            <CardTitle className="text-2xl">Verifying your email...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              This may take a few moments...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyPageLoading />}>
      <VerifyPageContent />
    </Suspense>
  )
} 