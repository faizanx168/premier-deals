import Link from "next/link"
import { Button } from "@/components/ui/button"
import PropertyCard from "@/components/property/property-card"
import { ArrowRight } from "lucide-react"

// Types for the property data
interface Property {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  sqft: number
  imageUrl: string
  type: "sale" | "rent" | "land"
  featured: boolean
  rating?: number
  reviewCount?: number
}

// Fetch featured properties from the API
async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/properties?featured=true&limit=6`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('Failed to fetch featured properties:', response.statusText)
      return []
    }
    
    const data = await response.json()
    return data.properties || []
  } catch (error) {
    console.error('Error fetching featured properties:', error)
    return []
  }
}

export default async function FeaturedProperties() {
  const featuredProperties = await getFeaturedProperties()

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties that offer exceptional 
            value and lifestyle opportunities.
          </p>
        </div>

        {/* Properties Grid */}
        {featuredProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link href="/properties">
                <Button size="lg" className="bg-primary hover:bg-primary-hover">
                  View All Properties
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">No featured properties available at the moment.</p>
            <Link href="/properties">
              <Button size="lg" className="bg-primary hover:bg-primary-hover">
                Browse All Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
} 