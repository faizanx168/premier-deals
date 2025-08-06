// Basic types for the application (before Prisma client generation)

// User types
export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'REALTOR'
  createdAt: Date
  updatedAt: Date
}

// Property types
export interface Property {
  id: string
  title: string
  description: string
  price: number
  type: 'HOUSE' | 'APARTMENT' | 'CONDO' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL'
  status: 'AVAILABLE' | 'SOLD' | 'RENTED' | 'PENDING' | 'OFF_MARKET'
  bedrooms?: number
  bathrooms?: number
  area?: number
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  latitude?: number
  longitude?: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PropertyImage {
  id: string
  url: string
  alt?: string
  isPrimary: boolean
  order: number
  propertyId: string
  createdAt: Date
}

export interface Amenity {
  id: string
  name: string
  category: string
  icon?: string
  createdAt: Date
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'NEW' | 'CONTACTED' | 'VIEWING_SCHEDULED' | 'OFFER_MADE' | 'CLOSED' | 'SPAM'
  propertyId?: string
  userId?: string
  createdAt: Date
  updatedAt: Date
}

// Extended types for API responses
export type PropertyWithImages = Property & {
  images: PropertyImage[]
  amenities: (PropertyAmenity & {
    amenity: Amenity
  })[]
}

export type PropertyAmenity = {
  id: string
  propertyId: string
  amenityId: string
  amenity: Amenity
}

export type InquiryWithProperty = Inquiry & {
  property?: Property | null
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface PropertyFormData {
  title: string
  description: string
  price: number
  type: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  address: string
  city: string
  state: string
  zipCode: string
  country?: string
  featured?: boolean
  amenities?: string[]
}

export interface InquiryFormData {
  name: string
  email: string
  phone?: string
  message: string
  propertyId?: string
}

// Filter types
export interface PropertyFilters {
  type?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  city?: string
  status?: string
  featured?: boolean
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
} 