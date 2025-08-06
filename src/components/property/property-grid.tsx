"use client"

import { useState } from "react"
import PropertyCard from "./property-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Grid, 
  List, 
  Grid3X3, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react"

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

interface PropertyGridProps {
  properties: Property[]
  loading: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  onPageChange?: (page: number) => void
  onViewModeChange?: (mode: 'grid' | 'list' | 'compact') => void
  viewMode?: 'grid' | 'list' | 'compact'
  showFilters?: boolean
  onToggleFilters?: () => void
}

export default function PropertyGrid({
  properties,
  loading,
  pagination,
  onPageChange,
  onViewModeChange,
  viewMode = 'grid',
  showFilters = true,
  onToggleFilters
}: PropertyGridProps) {
  const [currentViewMode, setCurrentViewMode] = useState<'grid' | 'list' | 'compact'>(viewMode)

  const handleViewModeChange = (mode: 'grid' | 'list' | 'compact') => {
    setCurrentViewMode(mode)
    onViewModeChange?.(mode)
  }

  const getGridClasses = () => {
    switch (currentViewMode) {
      case 'grid':
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      case 'list':
        return "space-y-4"
      case 'compact':
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    }
  }

  const renderSkeleton = () => {
    const skeletonCount = currentViewMode === 'compact' ? 8 : currentViewMode === 'list' ? 4 : 6
    
    return (
      <div className={getGridClasses()}>
        {[...Array(skeletonCount)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-4 rounded"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderEmptyState = () => (
    <Card className="text-center py-12">
      <CardContent>
        <div className="text-gray-400 mb-4">
          <Grid className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No properties found
        </h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your filters or search criteria
        </p>
        <Button variant="outline" onClick={onToggleFilters}>
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Adjust Filters
        </Button>
      </CardContent>
    </Card>
  )

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null

    return (
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-gray-700">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} properties
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={!pagination.hasPrevPage}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          {[...Array(pagination.totalPages)].map((_, i) => {
            const page = i + 1
            if (
              page === 1 ||
              page === pagination.totalPages ||
              (page >= pagination.page - 1 && page <= pagination.page + 1)
            ) {
              return (
                <Button
                  key={page}
                  variant={page === pagination.page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange?.(page)}
                >
                  {page}
                </Button>
              )
            } else if (
              page === pagination.page - 2 ||
              page === pagination.page + 2
            ) {
              return <span key={page} className="px-2">...</span>
            }
            return null
          })}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading...
              </div>
            ) : (
              `${pagination?.total || properties.length} Properties Found`
            )}
          </h2>
          {pagination && (
            <p className="text-sm text-gray-600 mt-1">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} properties
            </p>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          {showFilters && onToggleFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFilters}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          )}
          
          <div className="flex items-center border rounded-lg">
            <Button
              variant={currentViewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={currentViewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={currentViewMode === 'compact' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('compact')}
              className="rounded-l-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Properties Grid/List */}
      {loading ? (
        renderSkeleton()
      ) : properties.length > 0 ? (
        <div className={getGridClasses()}>
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              price={property.price}
              location={`${property.city}, ${property.state}`}
              bedrooms={property.bedrooms || 0}
              bathrooms={property.bathrooms || 0}
              sqft={property.area || 0}
              imageUrl={property.images.find(img => img.isPrimary)?.url || property.images[0]?.url || ''}
              type={property.type.toLowerCase() as 'sale' | 'rent' | 'land'}
              featured={property.featured}
            />
          ))}
        </div>
      ) : (
        renderEmptyState()
      )}

      {/* Pagination */}
      {renderPagination()}
    </div>
  )
} 