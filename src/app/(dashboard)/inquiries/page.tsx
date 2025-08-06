"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  User,
  DollarSign
} from "lucide-react"

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'NEW' | 'CONTACTED' | 'VIEWING_SCHEDULED' | 'OFFER_MADE' | 'CLOSED' | 'SPAM'
  createdAt: string
  property: {
    id: string
    title: string
    images: Array<{ url: string; isPrimary: boolean }>
  }
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Fetch inquiries
  const fetchInquiries = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/inquiries')
      const data = await response.json()

      if (response.ok) {
        setInquiries(data.inquiries || [])
      } else {
        console.error('Failed to fetch inquiries:', data.error)
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update inquiry status
  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setInquiries(inquiries.map(inquiry => 
          inquiry.id === id ? { ...inquiry, status: status as Inquiry['status'] } : inquiry
        ))
        alert('Status updated successfully')
      } else {
        alert('Failed to update status')
      }
    } catch {
      alert('Failed to update status')
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            New
          </span>
        )
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <MessageSquare className="w-3 h-3 mr-1" />
            Contacted
          </span>
        )
      case 'VIEWING_SCHEDULED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Calendar className="w-3 h-3 mr-1" />
            Viewing Scheduled
          </span>
        )
      case 'OFFER_MADE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <DollarSign className="w-3 h-3 mr-1" />
            Offer Made
          </span>
        )
      case 'CLOSED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Closed
          </span>
        )
      case 'SPAM':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <MessageSquare className="w-3 h-3 mr-1" />
            Spam
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  // Filter inquiries
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.property.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || inquiry.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    fetchInquiries()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inquiry Management</h1>
            <p className="text-gray-600">Manage and respond to property inquiries</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or property..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Status</option>
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="VIEWING_SCHEDULED">Viewing Scheduled</option>
                  <option value="OFFER_MADE">Offer Made</option>
                  <option value="CLOSED">Closed</option>
                  <option value="SPAM">Spam</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    setFilterStatus('')
                  }}
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Inquiries ({filteredInquiries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading inquiries...</p>
              </div>
            ) : filteredInquiries.length > 0 ? (
              <div className="space-y-4">
                {filteredInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="border rounded-lg p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                <span>{inquiry.email}</span>
                              </div>
                              {inquiry.phone && (
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  <span>{inquiry.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{formatDate(inquiry.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Property of Interest</h4>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                              {inquiry.property.images.length > 0 && (
                                <img
                                  src={inquiry.property.images.find(img => img.isPrimary)?.url || inquiry.property.images[0].url}
                                  alt={inquiry.property.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{inquiry.property.title}</p>
                              <p className="text-sm text-gray-600">Property ID: {inquiry.property.id}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {inquiry.message}
                          </p>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col items-end space-y-3">
                        <div>
                          {getStatusBadge(inquiry.status)}
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(`mailto:${inquiry.email}?subject=Re: Inquiry about ${inquiry.property.title}`)}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                          
                          {inquiry.phone && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(`tel:${inquiry.phone}`)}
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(`/properties/${inquiry.property.id}`, '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Property
                          </Button>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <select
                            value={inquiry.status}
                            onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="NEW">Mark as New</option>
                            <option value="CONTACTED">Mark as Contacted</option>
                            <option value="VIEWING_SCHEDULED">Mark as Viewing Scheduled</option>
                            <option value="OFFER_MADE">Mark as Offer Made</option>
                            <option value="CLOSED">Mark as Closed</option>
                            <option value="SPAM">Mark as Spam</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MessageSquare className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No inquiries found
                </h3>
                <p className="text-gray-600">
                  {searchQuery || filterStatus 
                    ? 'Try adjusting your filters' 
                    : 'Inquiries from your property listings will appear here'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 