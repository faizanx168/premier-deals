import Link from "next/link"
import { Button } from "@/components/ui/button"
import PropertyCard from "@/components/property/property-card"
import { ArrowRight } from "lucide-react"

// Types for the property data
interface Property {
  id: string
  title: string
  price: number
  address?: string
  city?: string
  state?: string
  location?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  sqft?: number
  images?: Array<{
    id: string
    url: string
    isPrimary: boolean
    order: number
  }>
  imageUrl?: string
  type: "SALE" | "RENT" | "LAND" | "sale" | "rent" | "land"
  featured?: boolean
  rating?: number
  reviewCount?: number
}

// Fetch recent properties from the API
async function getRecentProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/properties?limit=6`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('Failed to fetch recent properties:', response.statusText)
      return []
    }
    
    const data = await response.json()
    return data.properties || []
  } catch (error) {
    console.error('Error fetching recent properties:', error)
    return []
  }
}

export default async function RecentProperties() {
  const recentProperties = await getRecentProperties()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our newest additions to the market, featuring the latest properties 
            available for sale, rent, or investment.
          </p>
        </div>

        {/* Properties Grid */}
        {recentProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {recentProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link href="/properties">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  View All Properties
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">No properties available at the moment.</p>
            <Link href="/properties">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Browse Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
} 