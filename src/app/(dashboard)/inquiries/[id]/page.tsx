"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Mail, 
  Phone, 
  Calendar,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  User,
  DollarSign,
  Edit,
  Save,
  X,
  Home
} from "lucide-react"

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'NEW' | 'CONTACTED' | 'VIEWING_SCHEDULED' | 'OFFER_MADE' | 'CLOSED' | 'SPAM'
  createdAt: string
  updatedAt: string
  property: {
    id: string
    title: string
    price: number
    type: string
    status: string
    address: string
    city: string
    state: string
    images: Array<{ url: string; isPrimary: boolean }>
  }
}

export default function InquiryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    status: '',
    notes: ''
  })

  // Fetch inquiry details
  const fetchInquiry = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/inquiries/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setInquiry(data.inquiry)
        setEditData({
          status: data.inquiry.status,
          notes: data.inquiry.notes || ''
        })
      } else {
        console.error('Failed to fetch inquiry:', data.error)
        router.push('/inquiries')
      }
    } catch {
      console.error('Error fetching inquiry')
      router.push('/inquiries')
    } finally {
      setLoading(false)
    }
  }

  // Update inquiry
  const updateInquiry = async () => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/inquiries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        const data = await response.json()
        setInquiry(data.inquiry)
        setIsEditing(false)
        alert('Inquiry updated successfully')
      } else {
        alert('Failed to update inquiry')
      }
    } catch {
      alert('Failed to update inquiry')
    } finally {
      setUpdating(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />New</Badge>
      case 'CONTACTED':
        return <Badge className="bg-blue-100 text-blue-800"><MessageSquare className="w-3 h-3 mr-1" />Contacted</Badge>
      case 'VIEWING_SCHEDULED':
        return <Badge className="bg-purple-100 text-purple-800"><Calendar className="w-3 h-3 mr-1" />Viewing Scheduled</Badge>
      case 'OFFER_MADE':
        return <Badge className="bg-orange-100 text-orange-800"><DollarSign className="w-3 h-3 mr-1" />Offer Made</Badge>
      case 'CLOSED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Closed</Badge>
      case 'SPAM':
        return <Badge className="bg-red-100 text-red-800"><MessageSquare className="w-3 h-3 mr-1" />Spam</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 100000000) {
      return `PKR ${(amount / 100000000).toFixed(1)}Cr`
    } else if (amount >= 1000000) {
      return `PKR ${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `PKR ${(amount / 1000).toFixed(0)}K`
    }
    return `PKR ${amount.toLocaleString()}`
  }

  useEffect(() => {
    if (params.id) {
      fetchInquiry()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inquiry...</p>
        </div>
      </div>
    )
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inquiry not found</h3>
          <Button onClick={() => router.push('/inquiries')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inquiries
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/inquiries')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inquiry Details</h1>
                <p className="text-gray-600">Manage inquiry from {inquiry.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(inquiry.status)}
              <Button 
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900 font-medium">{inquiry.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900">{inquiry.email}</p>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                  {inquiry.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900">{inquiry.phone}</p>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Date</label>
                    <p className="text-gray-900">{formatDate(inquiry.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{inquiry.message}</p>
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Property of Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {inquiry.property.images.length > 0 && (
                      <img
                        src={inquiry.property.images.find(img => img.isPrimary)?.url || inquiry.property.images[0].url}
                        alt={inquiry.property.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{inquiry.property.title}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <span className="ml-2 font-medium">{formatCurrency(inquiry.property.price)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-medium">{inquiry.property.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className="ml-2 font-medium">{inquiry.property.status}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-2 font-medium">{inquiry.property.city}, {inquiry.property.state}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => router.push(`/properties/${inquiry.property.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Property
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="VIEWING_SCHEDULED">Viewing Scheduled</option>
                        <option value="OFFER_MADE">Offer Made</option>
                        <option value="CLOSED">Closed</option>
                        <option value="SPAM">Spam</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        value={editData.notes}
                        onChange={(e) => setEditData({...editData, notes: e.target.value})}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Add internal notes..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={updateInquiry} disabled={updating} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        {updating ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    {editData.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{editData.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open(`mailto:${inquiry.email}?subject=Re: Inquiry about ${inquiry.property.title}`)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                {inquiry.phone && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(`tel:${inquiry.phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Customer
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/properties/${inquiry.property.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Property
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/properties/${inquiry.property.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Property
                </Button>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Inquiry Received</p>
                      <p className="text-xs text-gray-500">{formatDate(inquiry.createdAt)}</p>
                    </div>
                  </div>
                  {inquiry.updatedAt !== inquiry.createdAt && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Status Updated</p>
                        <p className="text-xs text-gray-500">{formatDate(inquiry.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 