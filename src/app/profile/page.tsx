import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User as UserIcon, ShieldCheck, IdCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Your Profile - Premier Deals',
  description: 'View your account details and preferences.',
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const user = session.user

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-3">Your Profile</h1>
            <p className="text-blue-100">Manage your account information and preferences</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
          {/* Overview Card */}
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">{user?.name || 'User'}</CardTitle>
                <p className="text-sm text-white/80">{user?.email}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">Welcome to your profile. Here you can review your account details.</p>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-blue-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center">
                  <IdCard className="w-4 h-4 mr-2" /> User ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="break-all text-white/90">{user?.id || '—'}</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="uppercase text-white/90">{user?.role || 'USER'}</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Email Verified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90">{user?.emailVerified ? 'Yes' : 'No'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}


