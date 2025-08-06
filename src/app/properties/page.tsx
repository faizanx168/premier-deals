"use client"

import { useState, useEffect } from "react"
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

export default function PropertiesPage() {
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
    
    params.append('page', '1') // Reset to first page when filters change
    
    router.push(`/properties?${params}`)
  }

  // Apply filters
  const applyFilters = () => {
    updateURL()
  }

  // Clear filters
  const clearFilters = () => {
    const clearedFilters: FilterState = {
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
    setFilters(clearedFilters)
    router.push('/properties')
  }

  // Navigate to page
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/properties?${params}`)
  }

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list' | 'compact') => {
    setViewMode(mode)
  }

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  useEffect(() => {
    fetchProperties()
  }, [currentPage, searchParams])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Properties in Islamabad
          </h1>
          <p className="text-gray-600">
            Discover your perfect home in Pakistan&apos;s capital city
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PropertyFilters
              filters={filters}
              onFiltersChange={setFilters}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              isCollapsed={!showFilters}
              onToggleCollapse={toggleFilters}
            />
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <PropertyGrid
              properties={properties}
              loading={loading}
              pagination={pagination || undefined}
              onPageChange={goToPage}
              onViewModeChange={handleViewModeChange}
              viewMode={viewMode}
              showFilters={true}
              onToggleFilters={toggleFilters}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 