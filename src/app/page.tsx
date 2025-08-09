export const dynamic = 'force-dynamic'

import HeroSection from "@/components/home/hero-section"
import FeaturedProperties from "@/components/home/featured-properties"
import RecentProperties from "@/components/home/recent-properties"
import AboutSection from "@/components/home/about-section"

// Fetch statistics from the API
async function getStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/properties`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return {
        totalProperties: 500,
        totalCities: 50,
        happyClients: 1000
      }
    }
    
    const data = await response.json()
    const totalProperties = data.pagination?.total || 500
    
    // For now, we'll use default values for cities and clients
    // In a real app, you might have separate API endpoints for these stats
    return {
      totalProperties,
      totalCities: 50,
      happyClients: 1000
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalProperties: 500,
      totalCities: 50,
      happyClients: 1000
    }
  }
}

export default async function Home() {
  const stats = await getStats()

  return (
    <>
      <HeroSection stats={stats} />
      <FeaturedProperties />
      <RecentProperties />
      <AboutSection />
    </>
  )
}
