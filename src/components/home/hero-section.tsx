"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Building2, Home, Map } from "lucide-react"

interface HeroSectionProps {
  stats?: {
    totalProperties: number
    totalCities: number
    happyClients: number
  }
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [propertyType, setPropertyType] = useState<"buy" | "rent" | "land">("buy")

  const handleSearch = () => {
    // Handle search functionality
    console.log("Searching for:", searchQuery, "Type:", propertyType)
  }

  // Default stats if not provided
  const defaultStats = {
    totalProperties: 500,
    totalCities: 50,
    happyClients: 1000
  }

  const displayStats = stats || defaultStats

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop"
          alt="Luxury real estate"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Dream
              <span className="text-accent block">Property Today</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-gray-200 mb-8 max-w-2xl">
              Discover the perfect home, investment property, or land with Premier Deals. 
              Your trusted partner in real estate excellence.
            </p>

            {/* Search Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              {/* Property Type Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setPropertyType("buy")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    propertyType === "buy"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Buy
                </button>
                <button
                  onClick={() => setPropertyType("rent")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    propertyType === "rent"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Rent
                </button>
                <button
                  onClick={() => setPropertyType("land")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    propertyType === "land"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Map className="w-4 h-4 inline mr-2" />
                  Land
                </button>
              </div>

              {/* Search Input */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Enter city, neighborhood, or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg border-gray-300 focus:border-primary"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="h-12 px-8 text-lg bg-primary hover:bg-primary-hover"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{displayStats.totalProperties}+</div>
                  <div className="text-sm text-gray-600">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{displayStats.totalCities}+</div>
                  <div className="text-sm text-gray-600">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{displayStats.happyClients}+</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 