"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import PropertyFilters, { FilterState } from "@/components/property/property-filters"
import PropertyGrid from "@/components/property/property-grid"

interface Property {
  id: string
  title: string
  price: number
  type: string
  status: string
  bedrooms: number
  bathrooms: number
  area: number
  address: string
  city: string
  state: string
  featured: boolean
  images: Array<{ url: string; isPrimary: boolean }>
  amenities: Array<{ amenity: { name: string } }>
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

function PropertiesPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [properties, setProperties] = useState<Property[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid')
  const [showFilters, setShowFilters] = useState(true)
  
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    propertyType: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    city: searchParams.get('city') || '',
    area: searchParams.get('area') || '',
    status: searchParams.get('status') || '',
    featured: searchParams.get('featured') === 'true',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  })

  const currentPage = parseInt(searchParams.get('page') || '1')

  // Fetch properties
  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value.toString())
        }
      })
      
      params.append('page', currentPage.toString())
      params.append('limit', '12')

      const response = await fetch(`/api/properties?${params}`)
      const data = await response.json()

      if (response.ok) {
        setProperties(data.properties)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch properties:', data.error)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update URL with filters
  const updateURL = () => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    if (currentPage > 1) {
      params.append('page', currentPage.toString())
    }
    
    const newURL = params.toString() ? `?${params.toString()}` : ''
    router.push(`/properties${newURL}`)
  }

  // Apply filters
  const applyFilters = () => {
    updateURL()
    fetchProperties()
  }

  // Clear filters
  const clearFilters = () => {
    const newFilters: FilterState = {
      search: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
      area: '',
      status: '',
      featured: false,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
    setFilters(newFilters)
    router.push('/properties')
  }

  // Handle pagination
  const goToPage = (page: number) => {
    router.push(`/properties?page=${page}`)
  }

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list' | 'compact') => {
    setViewMode(mode)
  }

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Update filters when search params change
  useEffect(() => {
    const newFilters: FilterState = {
      search: searchParams.get('search') || '',
      propertyType: searchParams.get('type') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      city: searchParams.get('city') || '',
      area: searchParams.get('area') || '',
      status: searchParams.get('status') || '',
      featured: searchParams.get('featured') === 'true',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc'
    }
    setFilters(newFilters)
  }, [searchParams])

  // Fetch properties when component mounts or filters change
  useEffect(() => {
    fetchProperties()
  }, [currentPage, filters])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Properties
          </h1>
          <p className="text-gray-600">
            Discover your perfect property from our extensive collection
          </p>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Filters */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <PropertyFilters
              filters={filters}
              onFiltersChange={setFilters}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* View Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleFilters}
                  className="lg:hidden px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                
                {pagination && (
                  <span className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, pagination.total)} of {pagination.total} properties
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleViewModeChange('compact')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'compact' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <PropertyGrid
                properties={properties}
                loading={loading}
                viewMode={viewMode}
                pagination={pagination || undefined}
                onPageChange={goToPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading component
function PropertiesPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<PropertiesPageLoading />}>
      <PropertiesPageContent />
    </Suspense>
  )
} 