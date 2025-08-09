"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Bed, Bath, Square, MapPin, Star } from "lucide-react"
import { useState } from "react"

interface PropertyImage {
  id: string
  url: string
  isPrimary: boolean
  order: number
}

interface PropertyCardProps {
  id: string
  title: string
  price: number
  address?: string
  city?: string
  state?: string
  location?: string // Fallback for location
  bedrooms?: number
  bathrooms?: number
  area?: number
  sqft?: number // Fallback for area
  images?: PropertyImage[]
  imageUrl?: string // Fallback for single image
  type: "SALE" | "RENT" | "LAND" | "sale" | "rent" | "land"
  featured?: boolean
  rating?: number
  reviewCount?: number
}

export default function PropertyCard({
  id,
  title,
  price,
  address,
  city,
  state,
  location,
  bedrooms,
  bathrooms,
  area,
  sqft,
  images,
  imageUrl,
  type,
  featured = false,
  rating,
  reviewCount
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  // Determine the image to display
  const displayImage = images && images.length > 0 
    ? images.find(img => img.isPrimary)?.url || images[0].url 
    : imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'

  // Determine location
  const displayLocation = location || [city, state].filter(Boolean).join(', ') || address || 'Location not specified'

  // Determine area/size
  const displayArea = area || sqft || 0

  // Normalize type
  const normalizedType = type.toLowerCase() as "sale" | "rent" | "land"

  const formatPrice = (price: number) => {
    if (normalizedType === "rent") {
      return `PKR ${price.toLocaleString()}/mo`
    }
    return `PKR ${price.toLocaleString()}`
  }

  const formatArea = (area: number) => {
    if (area >= 1000) {
      return `${(area / 1000).toFixed(1)}k sqft`
    }
    return `${area} sqft`
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <Link href={`/properties/${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={displayImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white-600'}`} 
            />
          </button>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 rounded-md text-xs font-medium">
              Featured
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
            {normalizedType === "sale" ? "For Sale" : normalizedType === "rent" ? "For Rent" : "Land"}
          </div>

          {/* Rating */}
          {rating && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{rating}</span>
              {reviewCount && (
                <span className="text-xs text-white-600">({reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-white-900">
              {formatPrice(price)}
            </span>
            {normalizedType === "rent" && (
              <span className="text-sm text-white-500">
                PKR {Math.round(price / 30).toLocaleString()}/night
              </span>
            )}
          </div>

          {/* Title and Location */}
          <div>
            <h3 className="font-semibold text-white-900 line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center space-x-1 text-white-500 text-sm mt-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{displayLocation}</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between text-sm text-white-600">
            <div className="flex items-center space-x-4">
              {bedrooms !== undefined && (
                <div className="flex items-center space-x-1">
                  <Bed className="w-4 h-4" />
                  <span>{bedrooms}</span>
                </div>
              )}
              {bathrooms !== undefined && (
                <div className="flex items-center space-x-1">
                  <Bath className="w-4 h-4" />
                  <span>{bathrooms}</span>
                </div>
              )}
              {displayArea > 0 && (
                <div className="flex items-center space-x-1">
                  <Square className="w-4 h-4" />
                  <span>{formatArea(displayArea)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full mt-3" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 