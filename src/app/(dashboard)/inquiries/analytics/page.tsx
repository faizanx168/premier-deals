"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp,
  TrendingDown,
  MessageSquare,
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  BarChart3,
  Download,
  RefreshCw
} from "lucide-react"

interface InquiryAnalytics {
  totalInquiries: number
  newInquiries: number
  contactedInquiries: number
  viewingScheduled: number
  offerMade: number
  closedInquiries: number
  spamInquiries: number
  conversionRate: number
  avgResponseTime: number
  inquiriesThisMonth: number
  inquiriesLastMonth: number
  topProperties: Array<{
    propertyId: string
    propertyTitle: string
    inquiryCount: number
  }>
  statusDistribution: Array<{
    status: string
    count: number
    percentage: number
  }>
  monthlyTrend: Array<{
    month: string
    count: number
  }>
}

export default function InquiryAnalyticsPage() {
  const [analytics, setAnalytics] = useState<InquiryAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  // Fetch analytics data
  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/inquiries/analytics?timeRange=${timeRange}`)
      const data = await response.json()

      if (response.ok) {
        setAnalytics(data)
      } else {
        console.error('Failed to fetch analytics:', data.error)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inquiry Analytics</h1>
              <p className="text-gray-600">Track and analyze inquiry performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {analytics ? (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalInquiries}</p>
                      <div className="flex items-center mt-2">
                        {analytics.inquiriesThisMonth > analytics.inquiriesLastMonth ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${
                          analytics.inquiriesThisMonth > analytics.inquiriesLastMonth 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {analytics.inquiriesThisMonth} this month
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{formatPercentage(analytics.conversionRate)}</p>
                      <p className="text-sm text-green-600 mt-2">+2.1% from last month</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.avgResponseTime}h</p>
                      <p className="text-sm text-green-600 mt-2">-0.5h from last month</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Closed Deals</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.closedInquiries}</p>
                      <p className="text-sm text-green-600 mt-2">+15% from last month</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.statusDistribution.map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(item.status)}
                          <span className="text-sm text-gray-600">{item.count} inquiries</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatPercentage(item.percentage)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Top Properties by Inquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topProperties.map((property, index) => (
                      <div key={property.propertyId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{property.propertyTitle}</p>
                            <p className="text-xs text-gray-600">{property.inquiryCount} inquiries</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Monthly Trend
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                                     {analytics.monthlyTrend.map((item) => {
                    const maxCount = Math.max(...analytics.monthlyTrend.map(t => t.count))
                    const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                    
                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-500 rounded-t"
                          style={{ height: `${height}%` }}
                        ></div>
                        <p className="text-xs text-gray-600 mt-2">{item.month}</p>
                        <p className="text-xs font-medium text-gray-900">{item.count}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No analytics data available
            </h3>
            <p className="text-gray-600">
              Analytics will appear here once you have inquiries in your system
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 