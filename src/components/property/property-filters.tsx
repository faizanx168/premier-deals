"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Filter, 
  Search, 
  X, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square,
  Home,
  Building2,
  Landmark,
  Store
} from "lucide-react"

export interface FilterState {
  search: string
  propertyType: string
  minPrice: string
  maxPrice: string
  bedrooms: string
  bathrooms: string
  city: string
  area: string
  status: string
  featured: boolean
  sortBy: string
  sortOrder: string
}

interface PropertyFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const propertyTypes = [
  { value: "HOUSE", label: "House", icon: Home },
  { value: "APARTMENT", label: "Apartment", icon: Building2 },
  { value: "CONDO", label: "Condo", icon: Building2 },
  { value: "TOWNHOUSE", label: "Townhouse", icon: Home },
  { value: "LAND", label: "Land", icon: Landmark },
  { value: "COMMERCIAL", label: "Commercial", icon: Store },
]

const cities = [
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Quetta",
  "Faisalabad",
  "Multan",
  "Sialkot",
  "Gujranwala"
]

const sortOptions = [
  { value: "createdAt", label: "Date Added" },
  { value: "price", label: "Price" },
  { value: "title", label: "Name" },
  { value: "bedrooms", label: "Bedrooms" },
  { value: "area", label: "Area" },
]

export default function PropertyFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  isCollapsed = false,
  onToggleCollapse
}: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  const updateFilter = (key: keyof FilterState, value: string | boolean) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleApplyFilters = () => {
    onApplyFilters()
  }

  const handleClearFilters = () => {
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
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    onClearFilters()
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.search) count++
    if (localFilters.propertyType) count++
    if (localFilters.minPrice || localFilters.maxPrice) count++
    if (localFilters.bedrooms) count++
    if (localFilters.bathrooms) count++
    if (localFilters.city) count++
    if (localFilters.area) count++
    if (localFilters.status) count++
    if (localFilters.featured) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
            >
              {isCollapsed ? "Show" : "Hide"}
            </Button>
          )}
        </div>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent className="space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Properties
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by title, location..."
                value={localFilters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <Select
              value={localFilters.propertyType}
              onChange={(e) => updateFilter('propertyType', e.target.value)}
            >
              <option value="">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (PKR)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Min"
                  value={localFilters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  type="number"
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Max"
                  value={localFilters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  type="number"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <div className="relative">
                <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Select
                  value={localFilters.bedrooms}
                  onChange={(e) => updateFilter('bedrooms', e.target.value)}
                  className="pl-10"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <div className="relative">
                <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Select
                  value={localFilters.bathrooms}
                  onChange={(e) => updateFilter('bathrooms', e.target.value)}
                  className="pl-10"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </Select>
              </div>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Select
                value={localFilters.city}
                onChange={(e) => updateFilter('city', e.target.value)}
                className="pl-10"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Area (sq ft)
            </label>
            <div className="relative">
              <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Enter minimum area..."
                value={localFilters.area}
                onChange={(e) => updateFilter('area', e.target.value)}
                type="number"
                className="pl-10"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={localFilters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="PENDING">Pending</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
            </Select>
          </div>

          {/* Featured Only */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={localFilters.featured}
              onChange={(e) => updateFilter('featured', e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Featured Properties Only
            </label>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select
                value={localFilters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <Select
                value={localFilters.sortOrder}
                onChange={(e) => updateFilter('sortOrder', e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t">
            <Button onClick={handleApplyFilters} className="w-full">
              Apply Filters
            </Button>
            {activeFiltersCount > 0 && (
              <Button 
                onClick={handleClearFilters} 
                variant="outline" 
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
} 