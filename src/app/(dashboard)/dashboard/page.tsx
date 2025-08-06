"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  MessageSquare, 
  TrendingUp, 
  Eye, 
  DollarSign,
  Calendar,
  ArrowUpRight,
  Building2,
  Phone,
  Mail,
  Plus,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"

interface DashboardStats {
  totalProperties: number
  totalInquiries: number
  totalViews: number
  totalRevenue: number
  propertiesThisMonth: number
  inquiriesThisMonth: number
  viewsThisMonth: number
  revenueThisMonth: number
  activeProperties: number
  pendingInquiries: number
  conversionRate: number
  avgResponseTime: number
}

interface PropertyPerformance {
  id: string
  title: string
  views: number
  inquiries: number
  conversionRate: number
  status: 'AVAILABLE' | 'PENDING' | 'SOLD' | 'RENTED' | 'OFF_MARKET'
  price: number
  location: string
  image: string
}

interface RecentInquiry {
  id: string
  name: string
  email: string
  phone: string
  propertyTitle: string
  message: string
  status: 'NEW' | 'CONTACTED' | 'VIEWING_SCHEDULED' | 'OFFER_MADE' | 'CLOSED' | 'SPAM'
  timestamp: string
  priority: 'high' | 'medium' | 'low'
}

interface Activity {
  id: string
  type: 'inquiry' | 'property' | 'view' | 'sale' | 'rental'
  title: string
  description: string
  timestamp: string
  icon: string
  color: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [propertyPerformance, setPropertyPerformance] = useState<PropertyPerformance[]>([])
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch real data from APIs
      const [statsRes, propertiesRes, inquiriesRes, activitiesRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/properties?limit=5&sort=createdAt'),
        fetch('/api/inquiries?limit=5&sort=createdAt'),
        fetch('/api/dashboard/activities')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json()
        // Transform properties data for performance display
        const performanceData = propertiesData.properties.map((property: {
          id: string
          title: string
          status: string
          price: number
          city: string
          state: string
        }) => ({
          id: property.id,
          title: property.title,
          views: Math.floor(Math.random() * 200) + 50, // Mock views for now
          inquiries: Math.floor(Math.random() * 10) + 1, // Mock inquiries for now
          conversionRate: Math.floor(Math.random() * 10) + 2, // Mock conversion rate
          status: property.status,
          price: Number(property.price),
          location: `${property.city}, ${property.state}`,
          image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop' // Default image
        }))
        setPropertyPerformance(performanceData)
      }

      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json()
        // Transform inquiries data
        const transformedInquiries = inquiriesData.inquiries.map((inquiry: {
          id: string
          name: string
          email: string
          phone?: string
          message: string
          status: string
          createdAt: string
          property?: {
            title: string
          }
        }) => ({
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone || '',
          propertyTitle: inquiry.property?.title || 'Property Inquiry',
          message: inquiry.message,
          status: inquiry.status,
          timestamp: inquiry.createdAt,
          priority: inquiry.status === 'NEW' ? 'high' : inquiry.status === 'CONTACTED' ? 'medium' : 'low'
        }))
        setRecentInquiries(transformedInquiries)
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json()
        setActivities(activitiesData)
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NEW: { label: 'New', color: 'bg-blue-100 text-blue-800' },
      CONTACTED: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
      VIEWING_SCHEDULED: { label: 'Viewing Scheduled', color: 'bg-purple-100 text-purple-800' },
      OFFER_MADE: { label: 'Offer Made', color: 'bg-orange-100 text-orange-800' },
      CLOSED: { label: 'Closed', color: 'bg-green-100 text-green-800' },
      SPAM: { label: 'Spam', color: 'bg-red-100 text-red-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.NEW
    return <Badge className={config.color}>{config.label}</Badge>
  }

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { label: 'High', color: 'bg-red-100 text-red-800' },
      medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Low', color: 'bg-green-100 text-green-800' }
    }
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
    return <Badge className={config.color}>{config.label}</Badge>
  }

  // Get activity icon
  const getActivityIcon = (icon: string, color: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      MessageSquare: MessageSquare,
      Home: Home,
      Eye: Eye,
      DollarSign: DollarSign,
      TrendingUp: TrendingUp
    }
    
    const IconComponent = iconMap[icon] || Calendar
    const colorClasses = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      red: 'text-red-500',
      yellow: 'text-yellow-500'
    }
    
    return <IconComponent className={`w-4 h-4 ${colorClasses[color as keyof typeof colorClasses] || 'text-gray-500'}`} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your properties.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Last updated:</span>
            <span className="text-sm font-medium">
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Properties */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalProperties || 0}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{stats?.propertiesThisMonth || 0} this month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Inquiries */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalInquiries || 0}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{stats?.inquiriesThisMonth || 0} this month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Views */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{(stats?.totalViews || 0).toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{stats?.viewsThisMonth || 0} this month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{formatCurrency(stats?.revenueThisMonth || 0)} this month</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.conversionRate || 0}%</p>
              <p className="text-sm text-green-600 mt-1">+2.1% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.avgResponseTime || 0}h</p>
              <p className="text-sm text-green-600 mt-1">-0.5h from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Pending Inquiries</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.pendingInquiries || 0}</p>
              <p className="text-sm text-yellow-600 mt-1">Requires attention</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Performance */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Performing Properties</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {propertyPerformance.length > 0 ? (
                  propertyPerformance.map((property) => (
                    <div key={property.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{property.title}</h3>
                          <Badge className={
                            property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                            property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            property.status === 'SOLD' ? 'bg-blue-100 text-blue-800' :
                            property.status === 'RENTED' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {property.views} views
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {property.inquiries} inquiries
                            </span>
                            <span className="text-green-600 font-medium">
                              {property.conversionRate}% conversion
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(property.price)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No properties found</p>
                    <p className="text-sm text-gray-500">Add your first property to see performance data</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Inquiries */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Inquiries</CardTitle>
              <Link href="/inquiries">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInquiries.length > 0 ? (
                  recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {inquiry.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{inquiry.name}</p>
                            <p className="text-xs text-gray-500">{inquiry.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          {getStatusBadge(inquiry.status)}
                          {getPriorityBadge(inquiry.priority)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{inquiry.propertyTitle}</p>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{inquiry.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(inquiry.timestamp)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No inquiries yet</p>
                    <p className="text-sm text-gray-500">Inquiries will appear here when customers contact you</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Views Trend (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Chart will be embedded here</p>
                <p className="text-sm text-gray-500">Views over time visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Property Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Chart will be embedded here</p>
                <p className="text-sm text-gray-500">Property type distribution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.icon, activity.color)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(activity.timestamp)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent activity</p>
                <p className="text-sm text-gray-500">Activity will appear here as you manage properties</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/admin-properties">
              <Button className="h-16 w-full flex flex-col items-center justify-center">
                <Plus className="w-6 h-6 mb-2" />
                <span>Add Property</span>
              </Button>
            </Link>
            <Link href="/admin-properties">
              <Button variant="outline" className="h-16 w-full flex flex-col items-center justify-center">
                <Building2 className="w-6 h-6 mb-2" />
                <span>Manage Properties</span>
              </Button>
            </Link>
            <Link href="/inquiries">
              <Button variant="outline" className="h-16 w-full flex flex-col items-center justify-center">
                <MessageSquare className="w-6 h-6 mb-2" />
                <span>View Inquiries</span>
              </Button>
            </Link>
            <Button variant="outline" className="h-16 w-full flex flex-col items-center justify-center">
              <TrendingUp className="w-6 h-6 mb-2" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 